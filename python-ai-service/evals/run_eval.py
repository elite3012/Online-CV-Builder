from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.main import analyze_ats, analyze_match
from evals.benchmark_cases import BENCHMARK_CASES


def main() -> int:
    failures: list[str] = []

    for case in BENCHMARK_CASES:
        mode = case.get("mode", "match")
        expectations = case["expectations"]

        if mode == "ats":
            result, _ = analyze_ats(case["cv"])
        else:
            result, _ = analyze_match(case["cv"], case["jd"])

        case_failures = validate_case(case["name"], result.model_dump(), expectations)
        failures.extend(case_failures)
        print_case(case["name"], mode, result.model_dump(), case_failures)

    if failures:
        print(f"\nEvaluation failed: {len(failures)} expectation(s) not met.")
        return 1

    print("\nEvaluation passed: all benchmark expectations met.")
    return 0


def validate_case(name: str, result: dict, expectations: dict) -> list[str]:
    failures: list[str] = []

    if "min_score" in expectations and result["score"] < expectations["min_score"]:
        failures.append(f"{name}: expected score >= {expectations['min_score']}, got {result['score']}")
    if "max_score" in expectations and result["score"] > expectations["max_score"]:
        failures.append(f"{name}: expected score <= {expectations['max_score']}, got {result['score']}")
    if "min_keyword_coverage" in expectations:
        if (result.get("keywordCoverage") or 0) < expectations["min_keyword_coverage"]:
            failures.append(
                f"{name}: expected keywordCoverage >= {expectations['min_keyword_coverage']}, got {result.get('keywordCoverage')}"
            )
    if "min_evidence" in expectations and len(result.get("evidenceHighlights") or []) < expectations["min_evidence"]:
        failures.append(
            f"{name}: expected at least {expectations['min_evidence']} evidence highlights, got {len(result.get('evidenceHighlights') or [])}"
        )
    if "min_missing_terms" in expectations and len(result.get("missingSkills") or []) < expectations["min_missing_terms"]:
        failures.append(
            f"{name}: expected at least {expectations['min_missing_terms']} missing terms, got {len(result.get('missingSkills') or [])}"
        )
    if "min_section_coverage" in expectations and (result.get("sectionCoverage") or 0) < expectations["min_section_coverage"]:
        failures.append(
            f"{name}: expected sectionCoverage >= {expectations['min_section_coverage']}, got {result.get('sectionCoverage')}"
        )

    return failures


def print_case(name: str, mode: str, result: dict, failures: list[str]) -> None:
    print(f"\n[{name}] mode={mode}")
    print(
        f"score={result['score']} semantic={result.get('semanticScore')} "
        f"keyword={result.get('keywordCoverage')} section={result.get('sectionCoverage')}"
    )
    print(f"engine={result.get('analysisEngine')}")
    if result.get("evidenceHighlights"):
        print(f"evidence={len(result['evidenceHighlights'])}")
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
    else:
        print("PASS")


if __name__ == "__main__":
    raise SystemExit(main())
