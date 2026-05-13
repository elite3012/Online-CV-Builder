# Online CV Builder

Online CV Builder is a full-stack resume platform with a React frontend, a Spring Boot core backend, and a Python AI analysis service for ATS readiness and semantic resume-to-job matching.

The project started as a structured CV builder with JWT auth, live editing, and export workflows. It now also includes an AI layer that compares resume language against a target job description using TF-IDF vectorization, cosine similarity, keyword-gap extraction, and section-level scoring.

---

## What makes this project interesting

- **Hybrid AI architecture:** Business logic, auth, ownership checks, and export stay in Spring Boot, while the AI analysis layer runs as a separate Python service.
- **Semantic JD matching:** Resume text and job descriptions are embedded with TF-IDF features and compared using cosine similarity, so the system goes beyond raw token overlap.
- **ATS readiness scoring:** The platform also scores section completeness, keyword visibility, content density, and achievement evidence.
- **Safe fallback path:** If the Python AI service is unavailable, the Java backend falls back to rule-based ATS and keyword analysis instead of breaking the feature.

---

## Core features

### Resume platform
- JWT-based registration, login, profile update, and password change
- Multi-section CV editor with nested education, experience, projects, certificates, and skills
- Template gallery with live editing workflow
- PDF and DOCX export endpoints
- Ownership validation on CV CRUD operations

### AI and ML layer
- ATS readiness mode for structure and completeness checks
- Semantic match mode for comparing a CV against a job description
- Keyword coverage and missing-signal extraction
- Section-level insights for summary, skills, experience, projects, and education
- Actionable strengths, focus areas, and rewrite suggestions

---

## Architecture

```text
React + Vite frontend
        |
        v
Spring Boot REST API
  - Auth / CV CRUD / Export / Validation
  - AI gateway + fallback logic
        |
        +--> Python FastAPI AI service
              - TF-IDF vectorization
              - Cosine similarity
              - Section coverage scoring
              - Keyword gap analysis
        |
        v
PostgreSQL
```

### Why this split

- Spring Boot remains a stable system-of-record backend for account, CV, and export workflows.
- Python is used where it adds the most value: experimentation and iteration on AI/NLP logic.
- Recruiters and reviewers can see a clear separation between product backend engineering and the ML analysis layer.

---

## Tech stack

### Frontend
- React
- Vite
- Material UI
- Motion

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL

### AI service
- Python
- FastAPI
- scikit-learn
- TF-IDF + cosine similarity

---

## AI scoring design

### ATS readiness
The ATS mode scores:

- section coverage
- content density
- achievement evidence

### Semantic match
The semantic mode combines:

- **semantic similarity:** TF-IDF vector comparison between the JD and resume text
- **keyword coverage:** important JD phrases found or missing in the CV
- **section coverage:** whether the resume exposes enough structured evidence

This produces:

- overall AI match score
- semantic similarity score
- keyword coverage score
- section coverage score
- matched signals
- missing signals
- strengths and focus areas

---

## Project structure

```text
Online-CV-Builder/
|-- backend/
|   |-- src/main/java/com/cvbuilder/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- model/
|   |   |-- repository/
|   |   |-- security/
|   |   |-- service/
|   |-- src/main/resources/application.properties
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- data/
|   |-- package.json
|
|-- python-ai-service/
|   |-- app/main.py
|   |-- requirements.txt
```

---

## Local setup

### 1. Database

Create a PostgreSQL database named `CVBuilder`, then update credentials in `backend/src/main/resources/application.properties`.

### 2. Spring Boot backend

```bash
cd D:\MainProject\Online-CV-Builder\backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8081`.

### 3. Python AI service

```bash
cd D:\MainProject\Online-CV-Builder\python-ai-service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The Spring backend is configured to call `http://localhost:8000/analyze`.

If this service is not running, the app still works because the backend falls back to its built-in Java analyzer.

### 4. Frontend

```bash
cd D:\MainProject\Online-CV-Builder\frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Main API areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/cv`
- `POST /api/cv`
- `PUT /api/cv/{id}`
- `DELETE /api/cv/{id}`
- `POST /api/ai/analyze-jd`
- `GET /api/export/pdf/{id}`
- `GET /api/export/docx/{id}`

---

## Notes on the current implementation

- The AI service uses classic ML/NLP methods that are lightweight and explainable.
- The previous analysis flow was mostly rule-based; the new Python layer makes the project meaningfully stronger from an AI/ML portfolio perspective.
- A full backend rewrite to Python is not required for this goal, because the strongest ML value is concentrated in the analysis service rather than the CRUD/auth/export system.

---

## License

This project is released under the [MIT License](LICENSE).
