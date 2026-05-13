# Online CV Builder

Online CV Builder is a full-stack resume platform with a React frontend, a Spring Boot core backend, and a Python AI analysis service for ATS readiness, semantic resume-to-job matching, grounded evidence retrieval, and traceable AI workflows.

The project started as a structured CV builder with JWT auth, live editing, and export workflows. It now also includes an AI layer that compares resume language against a target job description using switchable semantic engines, keyword-gap extraction, retrieval-grounded evidence, section-level scoring, and JSON trace logging.

---

## What makes this project interesting

- **Hybrid AI architecture:** Business logic, auth, ownership checks, and export stay in Spring Boot, while the AI analysis layer runs as a separate Python service.
- **Switchable semantic engines:** The analyzer can run with TF-IDF or `sentence-transformers`, which makes the project look more like a modern AI engineering system than a single fixed heuristic.
- **Grounded retrieval layer:** The analyzer retrieves the strongest resume snippets as evidence for why a match score was assigned.
- **ATS readiness scoring:** The platform also scores section completeness, keyword visibility, content density, and achievement evidence.
- **Eval-first mindset:** A lightweight benchmark harness is included so analysis quality can be regression-tested instead of judged only by UI demos.
- **Observability built in:** Each analysis can emit a JSON trace with engine choice, metrics, matched terms, missing terms, and evidence snippets.
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
- Engine switch between `TF-IDF` and `sentence-transformers`
- Retrieval-grounded evidence snippets pulled from the resume
- Keyword coverage and missing-signal extraction
- Section-level insights for summary, skills, experience, projects, and education
- Actionable strengths, focus areas, and rewrite suggestions
- JSON trace logging for each analysis run
- Offline evaluation harness for repeatable quality checks

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
              - Sentence-transformers embeddings
              - Cosine similarity
              - Evidence retrieval
              - Section coverage scoring
              - Keyword gap analysis
              - JSON trace logging
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
- sentence-transformers
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

- **semantic similarity:** either TF-IDF cosine similarity or sentence-transformers embeddings, depending on the selected engine
- **keyword coverage:** important JD phrases found or missing in the CV
- **section coverage:** whether the resume exposes enough structured evidence
- **grounded evidence retrieval:** highest-signal CV snippets returned as support for the analysis

This produces:

- overall AI match score
- semantic similarity score
- keyword coverage score
- section coverage score
- matched signals
- missing signals
- strengths and focus areas
- grounded evidence snippets
- trace id for observability

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
|   |-- traces/
|   |-- evals/
|   |-- requirements.txt
|-- docker-compose.yml
```

---

## One-command Docker setup

Run the whole stack with one command:

```bash
cd D:\MainProject\Online-CV-Builder
docker compose up --build
```

Services:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8081`
- ai-service: `http://localhost:8000`
- postgres: `localhost:5432`

The compose stack also mounts AI traces and model cache volumes so the system looks much closer to a real multi-service application.

---

## Render full-stack deployment

This repo now includes a production-style [render.yaml](/D:/MainProject/Online-CV-Builder/render.yaml) blueprint for deploying:

- `cv-builder-frontend` as a static site
- `cv-builder-backend` as a public web service
- `cv-builder-ai-service` as a public web service
- `cv-builder-db` as a free Render Postgres database

Render-specific production touches already wired in:

- frontend build derives `VITE_API_URL` from the backend public Render URL
- backend entrypoint converts Render Postgres `connectionString` into Spring JDBC settings
- backend reads the AI service public URL from Render environment variables
- backend health endpoint is available at `GET /api/health`
- AI service respects Render's `PORT` environment variable
- SPA routing is handled through a static-site rewrite to `/index.html`

Quick start:

```text
1. Push this repo to GitHub
2. In Render, choose "New Blueprint Instance"
3. Point Render to this repository
4. Review the four resources from render.yaml
5. Deploy
```

Detailed notes live in [DEPLOY_TO_RENDER.md](/D:/MainProject/Online-CV-Builder/DEPLOY_TO_RENDER.md).

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

During semantic matching, you can choose between:

- `Auto`
- `TF-IDF`
- `Sentence Transformers`

### 3.1 Optional: run the offline AI eval suite

```bash
cd D:\MainProject\Online-CV-Builder\python-ai-service
python evals/run_eval.py
```

This runs a small benchmark set to check that semantic matching, ATS readiness, and evidence retrieval still behave as expected after changes.

### 3.2 Inspect AI traces

Each analysis run can emit a JSON trace under:

```text
python-ai-service/traces/
```

The trace contains:

- requested engine
- effective engine
- score breakdown
- matched and missing terms
- evidence snippets
- response payload

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
- `GET /engines`
- `GET /traces/{trace_id}`
- `GET /api/export/pdf/{id}`
- `GET /api/export/docx/{id}`

---

## Hugging Face deployment

The most realistic free deployment path is to publish the AI service only as a Hugging Face Docker Space. The `python-ai-service/` folder already contains:

- [Dockerfile](/D:/MainProject/Online-CV-Builder/python-ai-service/Dockerfile)
- [SPACE_README.md](/D:/MainProject/Online-CV-Builder/python-ai-service/SPACE_README.md)
- [DEPLOY_TO_HF.md](/D:/MainProject/Online-CV-Builder/python-ai-service/DEPLOY_TO_HF.md)

The full product stack is better run locally with `docker compose`, because it depends on multiple services and a database.

If you want the full app online instead of only the AI API, Render is the better target because this project uses multiple networked services plus Postgres.

---

## Notes on the current implementation

- The AI service mixes classic ML/NLP methods with modern embedding-based retrieval so it stays lightweight while still looking current for AI Engineer applications.
- The previous analysis flow was mostly rule-based; the new Python layer makes the project meaningfully stronger from an AI/ML portfolio perspective.
- Retrieval-grounded evidence, engine switching, trace logging, and a small evaluation harness make the project look closer to modern AI engineering work than a plain ATS keyword checker.
- A full backend rewrite to Python is not required for this goal, because the strongest ML value is concentrated in the analysis service rather than the CRUD/auth/export system.

---

## License

This project is released under the [MIT License](LICENSE).
