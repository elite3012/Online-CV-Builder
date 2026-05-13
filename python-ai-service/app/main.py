from __future__ import annotations

import json
import importlib.util
import os
import re
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


GENERIC_TERMS = {
    "ability",
    "candidate",
    "communication",
    "company",
    "culture",
    "degree",
    "duties",
    "environment",
    "experience",
    "ideal",
    "including",
    "knowledge",
    "looking",
    "manage",
    "management",
    "metric",
    "metrics",
    "opportunity",
    "preferred",
    "qualification",
    "qualifications",
    "required",
    "requirements",
    "requiring",
    "responsibilities",
    "responsibility",
    "role",
    "skills",
    "strong",
    "team",
    "using",
    "work",
    "working",
    "years",
}

ACHIEVEMENT_HINTS = (
    "improved",
    "reduced",
    "increased",
    "built",
    "business",
    "designed",
    "deployed",
    "launched",
    "optimized",
    "automated",
    "delivered",
    "led",
    "grew",
    "%",
)

DEFAULT_EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
TRACE_DIR = Path(os.getenv("TRACE_DIR", Path(__file__).resolve().parents[1] / "traces"))
TRACE_DIR.mkdir(parents=True, exist_ok=True)

_EMBEDDING_MODEL = None
_EMBEDDING_MODEL_ERROR: str | None = None


class AnalyzeRequest(BaseModel):
    mode: str
    jdText: str | None = None
    cv: dict[str, Any]
    engine: str | None = "auto"


class AnalyzeResponse(BaseModel):
    score: int
    atsPassed: bool
    matchedSkills: list[str]
    missingSkills: list[str]
    atsWarnings: list[str]
    suggestions: list[str]
    analysisEngine: str
    semanticScore: float | None = None
    keywordCoverage: float | None = None
    sectionCoverage: float | None = None
    strengths: list[str]
    focusAreas: list[str]
    evidenceHighlights: list[str] = []
    traceId: str | None = None


app = FastAPI(title="CV Builder AI Service", version="2.0.0")


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "service": "CV Builder AI Service",
        "status": "ok",
        "endpoints": ["/health", "/engines", "/analyze", "/traces/{trace_id}"],
        "defaultEmbeddingModel": DEFAULT_EMBEDDING_MODEL,
    }


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "engines": describe_engines(),
        "defaultEmbeddingModel": DEFAULT_EMBEDDING_MODEL,
        "traceDir": str(TRACE_DIR),
    }


@app.get("/engines")
def engines() -> dict[str, Any]:
    return {"engines": describe_engines()}


@app.get("/traces/{trace_id}")
def read_trace(trace_id: str) -> dict[str, Any]:
    trace_path = TRACE_DIR / f"{trace_id}.json"
    if not trace_path.exists():
        raise HTTPException(status_code=404, detail="Trace not found.")
    return json.loads(trace_path.read_text(encoding="utf-8"))


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    started_at = time.perf_counter()
    trace_id = uuid.uuid4().hex
    requested_engine = normalize_engine_name(request.engine)
    mode = (request.mode or "match").strip().lower()

    if mode == "ats":
        response, trace_meta = analyze_ats(request.cv, requested_engine)
    else:
        response, trace_meta = analyze_match(request.cv, request.jdText or "", requested_engine)

    response.traceId = trace_id
    write_trace(
        trace_id=trace_id,
        mode=mode,
        requested_engine=requested_engine,
        response=response,
        trace_meta=trace_meta,
        request=request,
        duration_ms=round_metric((time.perf_counter() - started_at) * 1000.0),
    )
    return response


def analyze_ats(cv: dict[str, Any], requested_engine: str = "auto") -> tuple[AnalyzeResponse, dict[str, Any]]:
    full_text = normalize_text(str(cv.get("fullText", "")))
    skills = coerce_list(cv.get("skills"))
    experiences = coerce_list(cv.get("experiences"))
    projects = coerce_list(cv.get("projects"))
    section_coverage = compute_section_coverage(cv)
    detail_density = clamp(len(full_text) / 12.0, 0.0, 100.0)
    achievement_density = clamp(count_achievement_signals(full_text) * 12.5, 0.0, 100.0)
    evidence_bonus = (5 if experiences else 0) + (5 if projects else 0) + (2 if len(skills) >= 5 else 0)
    score = round_int(section_coverage * 0.5 + detail_density * 0.2 + achievement_density * 0.2 + evidence_bonus)

    warnings: list[str] = []
    suggestions: list[str] = []
    strengths: list[str] = []
    focus_areas: list[str] = []

    if section_coverage < 70:
        warnings.append("Key resume sections are incomplete, which weakens ATS parsing reliability.")
        focus_areas.append("Complete personal info, summary, skills, experience, and education sections.")
    else:
        strengths.append("Core ATS sections are present and easy to parse.")

    if len(full_text) < 320:
        warnings.append("Resume content is concise, but may be too short for strong recruiter evidence.")
        suggestions.append("Add richer context, tool names, and measurable achievements in experience bullets.")
        focus_areas.append("Expand experience bullets with outcomes, metrics, and domain-specific tools.")
    else:
        strengths.append("Resume contains enough textual context for ranking and search.")

    if len(skills) < 5:
        warnings.append("Skill coverage is light for ATS keyword retrieval.")
        suggestions.append("List technical tools, frameworks, platforms, and domain keywords explicitly.")
        focus_areas.append("Enrich the skills section with role-specific tools and technologies.")
    else:
        strengths.append("Skills section exposes explicit search terms for recruiter queries.")

    if count_achievement_signals(full_text) < 2:
        suggestions.append("Add impact verbs and measurable results such as percentages, time savings, or scale.")
        focus_areas.append("Convert generic responsibilities into achievement-driven bullets.")
    else:
        strengths.append("Achievement language helps the resume sound evidence-based.")

    if not experiences:
        warnings.append("Work experience is missing, which sharply lowers ATS and recruiter confidence.")
    if not projects and len(experiences) < 2:
        suggestions.append("Projects can strengthen early-career resumes when experience is still limited.")

    response = AnalyzeResponse(
        score=score,
        atsPassed=score >= 70 and section_coverage >= 60,
        matchedSkills=[],
        missingSkills=[],
        atsWarnings=limit_items(warnings),
        suggestions=limit_items(suggestions),
        analysisEngine="python-ats-heuristic",
        sectionCoverage=section_coverage,
        strengths=limit_items(strengths),
        focusAreas=limit_items(focus_areas),
        evidenceHighlights=[],
    )
    trace_meta = {
        "effectiveEngine": "ats-heuristic",
        "metrics": {
            "sectionCoverage": section_coverage,
            "detailDensity": round_metric(detail_density),
            "achievementDensity": round_metric(achievement_density),
            "evidenceBonus": evidence_bonus,
        },
    }
    return response, trace_meta


def analyze_match(
    cv: dict[str, Any],
    jd_text: str,
    requested_engine: str = "auto",
) -> tuple[AnalyzeResponse, dict[str, Any]]:
    normalized_jd = normalize_text(jd_text)
    cv_text = normalize_text(str(cv.get("fullText", "")))

    if not normalized_jd:
        response = AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["Job description is empty or unreadable."],
            suggestions=["Paste the target JD to run semantic comparison."],
            analysisEngine="validation-empty-jd",
            strengths=[],
            focusAreas=["Provide a complete job description before analysis."],
            evidenceHighlights=[],
        )
        return response, {"effectiveEngine": "none", "metrics": {}}

    if not cv_text:
        response = AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["Resume content is empty or unreadable."],
            suggestions=["Add summary, skills, experience, and projects before matching."],
            analysisEngine="validation-empty-cv",
            strengths=[],
            focusAreas=["Populate the resume with enough content for semantic analysis."],
            evidenceHighlights=[],
        )
        return response, {"effectiveEngine": "none", "metrics": {}}

    summary_text = normalize_text(str(cv.get("summary", "")))
    skills_text = normalize_text(" ".join(coerce_list(cv.get("skills"))))
    experience_text = normalize_text(join_structured_items(coerce_list(cv.get("experiences"))))
    project_text = normalize_text(join_structured_items(coerce_list(cv.get("projects"))))
    education_text = normalize_text(join_structured_items(coerce_list(cv.get("educations"))))

    docs = [
        normalized_jd,
        cv_text,
        summary_text or "summary",
        skills_text or "skills",
        experience_text or "experience",
        project_text or "projects",
        education_text or "education",
    ]

    tfidf_vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        stop_words="english",
        lowercase=True,
        sublinear_tf=True,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#./-]{1,}\b",
    )

    try:
        tfidf_matrix = tfidf_vectorizer.fit_transform(docs)
    except ValueError:
        response = AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["The job description does not contain enough analyzable language."],
            suggestions=["Paste a fuller JD with responsibilities, tools, qualifications, and business context."],
            analysisEngine="validation-unreadable-jd",
            strengths=[],
            focusAreas=["Provide a richer job description for semantic analysis."],
            evidenceHighlights=[],
        )
        return response, {"effectiveEngine": "none", "metrics": {}}

    effective_engine, semantic_scores, engine_warning = compute_semantic_scores(
        docs,
        requested_engine,
    )
    feature_names = tfidf_vectorizer.get_feature_names_out()
    overall_semantic = semantic_scores["overall"]
    section_scores = semantic_scores["sections"]
    semantic_score = max(overall_semantic, overall_semantic * 0.6 + max(section_scores.values()) * 0.4)

    jd_terms = merge_terms(
        extract_candidate_phrases(normalized_jd),
        extract_top_terms(tfidf_matrix[0], feature_names),
    )
    cv_token_set = build_token_set(cv_text)
    matched_terms = [term for term in jd_terms if phrase_tokens_present(term, cv_token_set)]
    missing_terms = [term for term in jd_terms if term not in matched_terms]
    keyword_coverage = (len(matched_terms) / len(jd_terms) * 100.0) if jd_terms else 0.0
    section_coverage = compute_section_coverage(cv)
    evidence_highlights = retrieve_evidence(normalized_jd, cv)

    score = round_int(
        semantic_score * 0.5
        + keyword_coverage * 0.3
        + section_coverage * 0.1
        + min(len(evidence_highlights), 3) * 4.0
    )

    warnings: list[str] = []
    suggestions: list[str] = []
    strengths: list[str] = []
    focus_areas: list[str] = []

    if engine_warning:
        warnings.append(engine_warning)

    if semantic_score < 45:
        warnings.append("Semantic alignment is weak: the resume narrative does not yet sound close to the target JD.")
        suggestions.append("Rewrite the summary and recent experience using the role's verbs, tools, and business context.")
        focus_areas.append("Bring summary and latest experience closer to the target job language.")
    else:
        strengths.append("Overall resume language is reasonably aligned with the target role.")

    if keyword_coverage < 45:
        warnings.append("Important JD phrases are still missing from the resume.")
        suggestions.append("Add the missing tools, frameworks, and domain phrases where they are genuinely supported by evidence.")
        focus_areas.append("Close the highest-value keyword gaps from the job description.")
    else:
        strengths.append("Keyword coverage is strong enough to support search and ranking.")

    if section_scores["experience"] < 40:
        suggestions.append("Your experience bullets should mirror the target responsibilities more directly.")
        focus_areas.append("Improve experience bullets with role-specific outcomes and tooling.")
    else:
        strengths.append("Experience section contributes useful evidence for the target role.")

    if evidence_highlights:
        strengths.append("Grounded evidence was retrieved from the resume to support the match analysis.")
    else:
        suggestions.append("Add richer project or experience bullets so the retriever can surface stronger evidence.")

    if section_scores["skills"] < 45:
        suggestions.append("Move critical tools from the JD into the explicit skills section for better ATS retrieval.")

    if count_achievement_signals(cv_text) < 2:
        suggestions.append("Add metrics, scale, or impact statements so the JD match feels evidence-based.")

    strongest_section = max(section_scores, key=section_scores.get)
    strengths.append(f"Best semantic evidence currently comes from the {strongest_section} section.")

    top_missing = limit_items(missing_terms, 5)
    if top_missing:
        focus_areas.append("Highest-priority gaps: " + ", ".join(top_missing))

    response = AnalyzeResponse(
        score=score,
        atsPassed=score >= 70 and section_coverage >= 60,
        matchedSkills=limit_items(matched_terms, 8),
        missingSkills=limit_items(missing_terms, 8),
        atsWarnings=limit_items(warnings),
        suggestions=limit_items(suggestions),
        analysisEngine=effective_engine,
        semanticScore=round_metric(semantic_score),
        keywordCoverage=round_metric(keyword_coverage),
        sectionCoverage=section_coverage,
        strengths=limit_items(strengths),
        focusAreas=limit_items(focus_areas),
        evidenceHighlights=limit_items(evidence_highlights, 3),
    )
    trace_meta = {
        "effectiveEngine": effective_engine,
        "metrics": {
            "overallSemantic": round_metric(overall_semantic),
            "semanticScore": round_metric(semantic_score),
            "keywordCoverage": round_metric(keyword_coverage),
            "sectionCoverage": round_metric(section_coverage),
        },
        "sectionScores": {key: round_metric(value) for key, value in section_scores.items()},
        "jdTerms": jd_terms,
        "matchedTerms": matched_terms,
        "missingTerms": missing_terms,
        "evidenceHighlights": evidence_highlights,
    }
    return response, trace_meta


def compute_semantic_scores(docs: list[str], requested_engine: str) -> tuple[str, dict[str, Any], str | None]:
    section_names = ["summary", "skills", "experience", "projects", "education"]
    effective_engine = "tfidf-cosine"
    engine_warning = None

    use_embedding = requested_engine in {"auto", "sentence-transformers"}
    if use_embedding:
        model = get_embedding_model()
        if model is not None:
            vectors = model.encode(docs, normalize_embeddings=True)
            overall = cosine_similarity([vectors[0]], [vectors[1]])[0, 0] * 100.0
            sections = {
                section_names[index]: cosine_similarity([vectors[0]], [vectors[index + 2]])[0, 0] * 100.0
                for index in range(len(section_names))
            }
            effective_engine = f"sentence-transformers::{DEFAULT_EMBEDDING_MODEL.split('/')[-1]}"
            return effective_engine, {"overall": overall, "sections": sections}, None

        if requested_engine == "sentence-transformers":
            engine_warning = "Sentence-transformers was requested but is not available, so the service fell back to TF-IDF."
        elif _EMBEDDING_MODEL_ERROR:
            engine_warning = "Embedding model was unavailable during auto mode, so TF-IDF was used."

    fallback_scores = compute_tfidf_semantic_scores(docs)
    return effective_engine, fallback_scores, engine_warning


def compute_tfidf_semantic_scores(docs: list[str]) -> dict[str, Any]:
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        stop_words="english",
        lowercase=True,
        sublinear_tf=True,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#./-]{1,}\b",
    )
    matrix = vectorizer.fit_transform(docs)
    return {
        "overall": cosine_similarity(matrix[0:1], matrix[1:2])[0, 0] * 100.0,
        "sections": {
            "summary": cosine_similarity(matrix[0:1], matrix[2:3])[0, 0] * 100.0,
            "skills": cosine_similarity(matrix[0:1], matrix[3:4])[0, 0] * 100.0,
            "experience": cosine_similarity(matrix[0:1], matrix[4:5])[0, 0] * 100.0,
            "projects": cosine_similarity(matrix[0:1], matrix[5:6])[0, 0] * 100.0,
            "education": cosine_similarity(matrix[0:1], matrix[6:7])[0, 0] * 100.0,
        },
    }


def get_embedding_model():
    global _EMBEDDING_MODEL, _EMBEDDING_MODEL_ERROR
    if _EMBEDDING_MODEL is not None:
        return _EMBEDDING_MODEL
    if _EMBEDDING_MODEL_ERROR is not None:
        return None

    try:
        from sentence_transformers import SentenceTransformer

        _EMBEDDING_MODEL = SentenceTransformer(DEFAULT_EMBEDDING_MODEL)
        return _EMBEDDING_MODEL
    except Exception as exc:  # pragma: no cover - runtime-dependent
        _EMBEDDING_MODEL_ERROR = str(exc)
        return None


def describe_engines() -> list[dict[str, Any]]:
    embedding_installed = importlib.util.find_spec("sentence_transformers") is not None
    return [
        {
            "id": "auto",
            "label": "Auto",
            "available": True,
            "details": "Prefer sentence-transformers and fall back to TF-IDF when needed.",
        },
        {
            "id": "tfidf",
            "label": "TF-IDF",
            "available": True,
            "details": "Classic sparse vector baseline with cosine similarity.",
        },
        {
            "id": "sentence-transformers",
            "label": "Sentence Transformers",
            "available": embedding_installed,
            "details": DEFAULT_EMBEDDING_MODEL if embedding_installed else (_EMBEDDING_MODEL_ERROR or "Not installed"),
        },
    ]


def extract_top_terms(vector_row: Any, feature_names: Any) -> list[str]:
    scores = vector_row.toarray()[0]
    ranked = sorted(
        ((feature_names[index], score) for index, score in enumerate(scores) if score > 0),
        key=lambda item: item[1],
        reverse=True,
    )

    terms: list[str] = []
    for term, _ in ranked:
        cleaned = term.strip()
        tokens = [normalize_token(token) for token in cleaned.split() if token]
        if len(cleaned) < 3 or not tokens:
            continue
        if len(tokens) > 2:
            continue
        if any(token in GENERIC_TERMS for token in tokens):
            continue
        if cleaned.isdigit():
            continue
        if cleaned in terms:
            continue
        terms.append(cleaned)
        if len(terms) == 12:
            break
    return terms


def extract_candidate_phrases(text: str) -> list[str]:
    cleaned = re.sub(
        r"(job title|company / industry|responsibilities|required skills|qualifications|nice-to-have)\s*:",
        " ",
        text,
        flags=re.IGNORECASE,
    )
    segments = re.split(r"[,;\n]|(?:\band\b)|(?:\bwith\b)", cleaned)
    terms: list[str] = []

    for segment in segments:
        normalized_segment = normalize_text(segment)
        tokens = [
            normalize_token(token)
            for token in normalized_segment.split()
            if token and normalize_token(token) not in GENERIC_TERMS
        ]
        if not tokens:
            continue
        if len(tokens) <= 2:
            terms.append(" ".join(tokens))
            continue
        for index in range(len(tokens) - 1):
            pair = f"{tokens[index]} {tokens[index + 1]}"
            if pair not in terms:
                terms.append(pair)
        for token in tokens:
            if token not in terms:
                terms.append(token)

    return limit_items(terms, 12)


def retrieve_evidence(jd_text: str, cv: dict[str, Any]) -> list[str]:
    snippets = build_evidence_snippets(cv)
    if not snippets:
        return []

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words="english",
        lowercase=True,
        sublinear_tf=True,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#./-]{1,}\b",
    )

    try:
        matrix = vectorizer.fit_transform([jd_text, *snippets])
    except ValueError:
        return []

    similarities = cosine_similarity(matrix[0:1], matrix[1:]).flatten()
    ranked = sorted(
        ((snippets[index], similarities[index]) for index in range(len(snippets)) if similarities[index] > 0.05),
        key=lambda item: item[1],
        reverse=True,
    )
    return [snippet for snippet, _ in ranked[:3]]


def build_evidence_snippets(cv: dict[str, Any]) -> list[str]:
    snippets: list[str] = []

    summary = normalize_text(str(cv.get("summary", "")))
    if summary:
        snippets.append(f"Summary evidence: {summary}")

    for item in coerce_list(cv.get("experiences")):
        if isinstance(item, dict):
            role = str(item.get("jobTitle", "")).strip()
            company = str(item.get("company", "")).strip()
            description = normalize_text(str(item.get("description", "")))
            context = " - ".join(part for part in [role, company] if part)
            if description:
                snippets.append(f"Experience evidence: {context}. {description}".strip())

    for item in coerce_list(cv.get("projects")):
        if isinstance(item, dict):
            name = str(item.get("projectName", "")).strip()
            role = str(item.get("role", "")).strip()
            description = normalize_text(str(item.get("description", "")))
            context = " - ".join(part for part in [name, role] if part)
            if description:
                snippets.append(f"Project evidence: {context}. {description}".strip())

    skills = ", ".join(coerce_list(cv.get("skills")))
    if skills:
        snippets.append(f"Skills evidence: {normalize_text(skills)}")

    return limit_items(snippets, 8)


def compute_section_coverage(cv: dict[str, Any]) -> float:
    personal = cv.get("personalInformation") or {}
    checks = [
        bool(str(personal.get("fullName", "")).strip() and str(personal.get("email", "")).strip()),
        bool(str(cv.get("summary", "")).strip()),
        len(coerce_list(cv.get("skills"))) > 0,
        len(coerce_list(cv.get("experiences"))) > 0,
        len(coerce_list(cv.get("educations"))) > 0,
    ]
    return round_metric(sum(1 for item in checks if item) * 100.0 / len(checks))


def count_achievement_signals(text: str) -> int:
    lowered = text.lower()
    score = sum(lowered.count(token) for token in ACHIEVEMENT_HINTS)
    score += len(re.findall(r"\b\d+(?:\.\d+)?%|\b\d+\+?|\$\d+", lowered))
    return score


def phrase_tokens_present(phrase: str, text_tokens: set[str]) -> bool:
    phrase_tokens = [normalize_token(token) for token in phrase.split() if token]
    return bool(phrase_tokens) and all(token in text_tokens for token in phrase_tokens)


def join_structured_items(items: list[Any]) -> str:
    chunks: list[str] = []
    for item in items:
        if isinstance(item, dict):
            chunks.append(" ".join(str(value) for value in item.values() if value is not None and str(value).strip()))
        else:
            chunks.append(str(item))
    return " ".join(chunks)


def coerce_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def normalize_text(value: str) -> str:
    text = re.sub(r"[\r\n\t]+", " ", value or "")
    text = re.sub(r"[^a-zA-Z0-9+#./,% -]", " ", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def build_token_set(text: str) -> set[str]:
    return {normalize_token(token) for token in re.findall(r"[a-zA-Z0-9+#./-]+", text)}


def normalize_token(token: str) -> str:
    normalized = token.lower().strip()
    if normalized.endswith("ies") and len(normalized) > 4:
        return normalized[:-3] + "y"
    if normalized.endswith("s") and len(normalized) > 3 and not normalized.endswith("ss"):
        return normalized[:-1]
    return normalized


def normalize_engine_name(engine: str | None) -> str:
    normalized = (engine or "auto").strip().lower()
    if normalized in {"embedding", "embeddings", "sentence-transformer"}:
        return "sentence-transformers"
    if normalized not in {"auto", "tfidf", "sentence-transformers"}:
        return "auto"
    return normalized


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def round_metric(value: float) -> float:
    return round(value, 1)


def round_int(value: float) -> int:
    return int(round(clamp(value, 0.0, 100.0)))


def limit_items(items: list[str], max_items: int = 4) -> list[str]:
    deduped: list[str] = []
    for item in items:
        cleaned = str(item).strip()
        if not cleaned or cleaned in deduped:
            continue
        deduped.append(cleaned)
        if len(deduped) >= max_items:
            break
    return deduped


def merge_terms(primary: list[str], secondary: list[str], max_items: int = 12) -> list[str]:
    merged: list[str] = []
    for group in (primary, secondary):
        for item in group:
            cleaned = str(item).strip()
            if not cleaned or cleaned in merged:
                continue
            merged.append(cleaned)
            if len(merged) >= max_items:
                return merged
    return merged


def write_trace(
    trace_id: str,
    mode: str,
    requested_engine: str,
    response: AnalyzeResponse,
    trace_meta: dict[str, Any],
    request: AnalyzeRequest,
    duration_ms: float,
) -> None:
    trace_payload = {
        "traceId": trace_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mode": mode,
        "requestedEngine": requested_engine,
        "effectiveEngine": trace_meta.get("effectiveEngine"),
        "durationMs": duration_ms,
        "requestSummary": {
            "jdLength": len((request.jdText or "").strip()),
            "cvTextLength": len(str(request.cv.get("fullText", "")).strip()),
            "skillsCount": len(coerce_list(request.cv.get("skills"))),
            "experienceCount": len(coerce_list(request.cv.get("experiences"))),
            "projectCount": len(coerce_list(request.cv.get("projects"))),
        },
        "metrics": trace_meta.get("metrics", {}),
        "sectionScores": trace_meta.get("sectionScores", {}),
        "matchedTerms": trace_meta.get("matchedTerms", []),
        "missingTerms": trace_meta.get("missingTerms", []),
        "evidenceHighlights": trace_meta.get("evidenceHighlights", []),
        "response": response.model_dump(),
    }

    trace_path = TRACE_DIR / f"{trace_id}.json"
    trace_path.write_text(json.dumps(trace_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"event": "analysis_trace", **trace_payload}, ensure_ascii=False))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
