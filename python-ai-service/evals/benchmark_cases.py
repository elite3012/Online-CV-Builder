BENCHMARK_CASES = [
    {
        "name": "strong_ml_match",
        "jd": "Machine learning intern requiring Python, SQL, model deployment, classification, FastAPI, and experimentation metrics.",
        "cv": {
            "fullText": (
                "Machine learning intern with Python, SQL, FastAPI, and scikit-learn. "
                "Built churn prediction models, evaluated classification metrics, and deployed inference APIs."
            ),
            "summary": "Machine learning intern focused on predictive modeling, experimentation, and backend APIs.",
            "skills": ["Python", "SQL", "FastAPI", "scikit-learn"],
            "experiences": [
                {
                    "jobTitle": "ML Intern",
                    "company": "ABC AI",
                    "description": "Built classification models, analyzed business metrics, and deployed API services.",
                }
            ],
            "projects": [
                {
                    "projectName": "Churn Model",
                    "role": "Developer",
                    "description": "Trained a classification model and monitored precision, recall, and business metrics.",
                }
            ],
            "educations": [{"school": "HCMIU", "degree": "BEng", "description": "AI coursework"}],
            "personalInformation": {"fullName": "Tran Phuc Quy", "email": "q@example.com"},
        },
        "expectations": {
            "min_score": 55,
            "min_keyword_coverage": 55,
            "min_evidence": 2,
        },
    },
    {
        "name": "weak_alignment",
        "jd": "Data scientist role requiring Python, experimentation design, statistics, A/B testing, and stakeholder communication.",
        "cv": {
            "fullText": "Frontend developer with React, CSS, and Figma experience building landing pages.",
            "summary": "Frontend developer focused on UI polish and design systems.",
            "skills": ["React", "CSS", "Figma"],
            "experiences": [
                {
                    "jobTitle": "Frontend Intern",
                    "company": "UI Labs",
                    "description": "Built landing pages and improved visual consistency.",
                }
            ],
            "projects": [],
            "educations": [{"school": "HCMIU", "degree": "BEng", "description": "Software coursework"}],
            "personalInformation": {"fullName": "Tran Phuc Quy", "email": "q@example.com"},
        },
        "expectations": {
            "max_score": 45,
            "min_missing_terms": 2,
        },
    },
    {
        "name": "ats_readiness_case",
        "mode": "ats",
        "cv": {
            "fullText": "Python, SQL, machine learning, deployed APIs, experimentation, dashboards, and measurable results 20%.",
            "summary": "AI engineering student building ML and backend projects.",
            "skills": ["Python", "SQL", "FastAPI", "scikit-learn", "Docker"],
            "experiences": [
                {
                    "jobTitle": "AI Intern",
                    "company": "ML Studio",
                    "description": "Built ML APIs, evaluated models, and improved latency by 20%.",
                }
            ],
            "projects": [
                {
                    "projectName": "Resume Matcher",
                    "role": "Builder",
                    "description": "Designed semantic matching and ATS analysis features.",
                }
            ],
            "educations": [{"school": "HCMIU", "degree": "BEng", "description": "AI major"}],
            "personalInformation": {
                "fullName": "Tran Phuc Quy",
                "email": "q@example.com",
                "jobTitle": "AI Engineer Intern",
            },
        },
        "expectations": {
            "min_score": 70,
            "min_section_coverage": 80,
        },
    },
]
