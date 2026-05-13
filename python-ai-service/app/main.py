from __future__ import annotations

import re
from typing import Any

from fastapi import FastAPI
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


class AnalyzeRequest(BaseModel):
    mode: str
    jdText: str | None = None
    cv: dict[str, Any]


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


app = FastAPI(title="CV Builder AI Service", version="1.0.0")


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "engine": "python-fastapi-tfidf",
        "features": ["semantic-match", "keyword-gap-analysis", "ats-structure-scoring"],
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    mode = (request.mode or "match").strip().lower()
    if mode == "ats":
        return analyze_ats(request.cv)
    return analyze_match(request.cv, request.jdText or "")


def analyze_ats(cv: dict[str, Any]) -> AnalyzeResponse:
    full_text = normalize_text(str(cv.get("fullText", "")))
    skills = coerce_list(cv.get("skills"))
    experiences = coerce_list(cv.get("experiences"))
    projects = coerce_list(cv.get("projects"))
    section_coverage = compute_section_coverage(cv)
    detail_density = clamp(len(full_text) / 12.0, 0.0, 100.0)
    achievement_density = clamp(count_achievement_signals(full_text) * 12.5, 0.0, 100.0)
    score = round_int(section_coverage * 0.55 + detail_density * 0.25 + achievement_density * 0.20)

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

    return AnalyzeResponse(
        score=score,
        atsPassed=score >= 70 and section_coverage >= 60,
        matchedSkills=[],
        missingSkills=[],
        atsWarnings=limit_items(warnings),
        suggestions=limit_items(suggestions),
        analysisEngine="python-fastapi-tfidf",
        sectionCoverage=section_coverage,
        strengths=limit_items(strengths),
        focusAreas=limit_items(focus_areas),
    )


def analyze_match(cv: dict[str, Any], jd_text: str) -> AnalyzeResponse:
    normalized_jd = normalize_text(jd_text)
    cv_text = normalize_text(str(cv.get("fullText", "")))

    if not normalized_jd:
        return AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["Job description is empty or unreadable."],
            suggestions=["Paste the target JD to run semantic comparison."],
            analysisEngine="python-fastapi-tfidf",
            strengths=[],
            focusAreas=["Provide a complete job description before analysis."],
        )

    if not cv_text:
        return AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["Resume content is empty or unreadable."],
            suggestions=["Add summary, skills, experience, and projects before matching."],
            analysisEngine="python-fastapi-tfidf",
            strengths=[],
            focusAreas=["Populate the resume with enough content for semantic analysis."],
        )

    summary_text = normalize_text(str(cv.get("summary", "")))
    skills_text = normalize_text(" ".join(coerce_list(cv.get("skills"))))
    experience_text = normalize_text(join_structured_items(coerce_list(cv.get("experiences"))))
    project_text = normalize_text(join_structured_items(coerce_list(cv.get("projects"))))
    education_text = normalize_text(join_structured_items(coerce_list(cv.get("educations"))))

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        stop_words="english",
        lowercase=True,
        sublinear_tf=True,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#./-]{1,}\b",
    )

    docs = [
        normalized_jd,
        cv_text,
        summary_text or "summary",
        skills_text or "skills",
        experience_text or "experience",
        project_text or "projects",
        education_text or "education",
    ]
    try:
        matrix = vectorizer.fit_transform(docs)
    except ValueError:
        return AnalyzeResponse(
            score=0,
            atsPassed=False,
            matchedSkills=[],
            missingSkills=[],
            atsWarnings=["The job description does not contain enough analyzable language."],
            suggestions=["Paste a fuller JD with responsibilities, tools, qualifications, and business context."],
            analysisEngine="python-fastapi-tfidf",
            strengths=[],
            focusAreas=["Provide a richer job description for semantic analysis."],
        )
    feature_names = vectorizer.get_feature_names_out()

    overall_semantic = cosine_similarity(matrix[0:1], matrix[1:2])[0, 0] * 100.0
    section_coverage = compute_section_coverage(cv)
    section_scores = {
        "summary": cosine_similarity(matrix[0:1], matrix[2:3])[0, 0] * 100.0,
        "skills": cosine_similarity(matrix[0:1], matrix[3:4])[0, 0] * 100.0,
        "experience": cosine_similarity(matrix[0:1], matrix[4:5])[0, 0] * 100.0,
        "projects": cosine_similarity(matrix[0:1], matrix[5:6])[0, 0] * 100.0,
        "education": cosine_similarity(matrix[0:1], matrix[6:7])[0, 0] * 100.0,
    }
    semantic_score = max(overall_semantic, overall_semantic * 0.6 + max(section_scores.values()) * 0.4)

    jd_terms = merge_terms(
        extract_candidate_phrases(normalized_jd),
        extract_top_terms(matrix[0], feature_names),
    )
    cv_token_set = build_token_set(cv_text)
    matched_terms = [term for term in jd_terms if phrase_tokens_present(term, cv_token_set)]
    missing_terms = [term for term in jd_terms if term not in matched_terms]
    keyword_coverage = (len(matched_terms) / len(jd_terms) * 100.0) if jd_terms else 0.0

    score = round_int(semantic_score * 0.55 + keyword_coverage * 0.30 + section_coverage * 0.15)
    warnings: list[str] = []
    suggestions: list[str] = []
    strengths: list[str] = []
    focus_areas: list[str] = []

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

    if section_scores["skills"] < 45:
        suggestions.append("Move critical tools from the JD into the explicit skills section for better ATS retrieval.")

    if count_achievement_signals(cv_text) < 2:
        suggestions.append("Add metrics, scale, or impact statements so the JD match feels evidence-based.")

    strongest_section = max(section_scores, key=section_scores.get)
    strengths.append(f"Best semantic evidence currently comes from the {strongest_section} section.")

    top_missing = limit_items(missing_terms, 5)
    if top_missing:
        focus_areas.append("Highest-priority gaps: " + ", ".join(top_missing))

    return AnalyzeResponse(
        score=score,
        atsPassed=score >= 70 and section_coverage >= 60,
        matchedSkills=limit_items(matched_terms, 8),
        missingSkills=limit_items(missing_terms, 8),
        atsWarnings=limit_items(warnings),
        suggestions=limit_items(suggestions),
        analysisEngine="python-fastapi-tfidf",
        semanticScore=round_metric(semantic_score),
        keywordCoverage=round_metric(keyword_coverage),
        sectionCoverage=section_coverage,
        strengths=limit_items(strengths),
        focusAreas=limit_items(focus_areas),
    )


def extract_top_terms(vector_row: Any, feature_names: Any) -> list[str]:
    scores = vector_row.toarray()[0]
    ranked = sorted(
        (
            (feature_names[index], score)
            for index, score in enumerate(scores)
            if score > 0
        ),
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
            chunks.append(
                " ".join(str(value) for value in item.values() if value is not None and str(value).strip())
            )
        else:
            chunks.append(str(item))
    return " ".join(chunks)


def coerce_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    return []


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
