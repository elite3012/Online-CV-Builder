# Online CV Builder

Online CV Builder is a full-stack resume platform that I built to go beyond a normal CRUD portfolio app.

The goal was not only to let users type a resume and export a PDF. I wanted one product that covers the whole workflow:

- build a CV from scratch
- import an existing resume from PDF or DOCX
- switch templates without rewriting content
- run ATS checks and semantic matching against a job description
- return grounded feedback instead of vague AI scores
- export polished resume files again when the editing is done

At a technical level, this project combines a React frontend, a Spring Boot backend, PostgreSQL, and a separate Python AI service. The result is a system that feels much closer to applied AI product engineering than a classroom demo.

## Deploy on Render

The primary deployment target for this project is Render.

This repository already includes a ready-to-use [`render.yaml`](render.yaml) blueprint for the full stack:

- `cv-builder-frontend` as a static site
- `cv-builder-backend` as a Docker web service
- `cv-builder-ai-service` as a Docker web service
- `cv-builder-db` as a managed Postgres database

### Quick deploy

1. Push this repository to GitHub.
2. Open the [Render Dashboard](https://dashboard.render.com/).
3. Choose `New` -> `Blueprint`.
4. Connect this repository.
5. Confirm Render detects [`render.yaml`](render.yaml).
6. Apply the blueprint and wait for the services to finish deploying.

After deploy, verify:

- frontend loads successfully
- backend health is available at `/api/health`
- AI service health is available at `/health`
- register/login works
- create or import a CV works
- ATS analysis and JD matching both run

The detailed deployment guide lives in [`DEPLOY_TO_RENDER.md`](DEPLOY_TO_RENDER.md).

## Why I built it this way

I care about AI projects that are useful, inspectable, and deployable.

This repository reflects that mindset:

- the product layer stays stable in Java with authentication, ownership checks, CRUD, validation, and exports
- the AI layer lives in Python where NLP and model experimentation are faster
- the frontend is not an afterthought; it supports editing, import, preview, template switching, and analysis in one flow
- the analysis is traceable, with evidence snippets and trace logs instead of a magic number with no explanation

I wanted the repo to show system thinking, not just model usage.

## What the product can do

### Resume workflow

- JWT-based registration, login, logout, profile update, and password change
- Create resumes with structured sections:
  - personal information
  - summary
  - education
  - experience
  - projects
  - certificates
  - skills
- Live editor with autosave
- Multiple resume templates with instant switching
- Preview before export
- Import CV files from `.pdf`, `.docx`, `.txt`, and `.md`
- Export resumes to PDF and DOCX

### AI workflow

- ATS-only mode for structure and readiness checks
- Job-description matching mode for semantic comparison
- Switchable engines:
  - TF-IDF
  - sentence-transformers
  - auto mode
- Keyword coverage and missing-signal detection
- Section-level scoring and content checks
- Grounded evidence snippets pulled from the resume
- Actionable suggestions instead of only a final score
- Trace logging for each analysis
- Rule-based backend fallback if the Python AI service is unavailable

## What makes this project stronger than a typical student CV builder

- It is a real multi-service system, not one monolith with AI buzzwords sprinkled on top.
- The AI feature is part of an actual user workflow: import, edit, evaluate, improve, export.
- The system separates concerns cleanly between product backend engineering and ML/NLP iteration.
- The analysis tries to be explainable through evidence and trace output.
- The repository includes deployment and verification paths instead of stopping at "it works on my machine."

## Architecture

```text
React + Vite
    |
    v
Spring Boot API
  - auth
  - CV CRUD
  - validation
  - ownership checks
  - import orchestration
  - export
  - AI gateway + fallback logic
    |
    +--> FastAPI AI service
    |     - ATS scoring
    |     - semantic matching
    |     - evidence retrieval
    |     - trace logging
    |     - CV import parsing
    |
    v
PostgreSQL
```

### Why the split matters

- Spring Boot is the system of record. It handles accounts, persistence, security, business rules, and export workflows.
- Python handles the parts where iteration speed matters most: parsing documents, NLP, vector scoring, and analysis logic.
- This separation makes the codebase easier to reason about and closer to how AI features are often integrated into real products.

## Applied AI flow

When a user checks a resume against a job description, the system follows this path:

1. The frontend sends the selected CV id, job description text, and analysis mode.
2. Spring Boot validates ownership and loads the CV data.
3. The backend converts the CV into a normalized payload for the AI service.
4. The Python service runs one of two paths:
   - ATS analysis for structure and completeness
   - semantic matching for JD comparison
5. The AI service returns:
   - overall score
   - ATS warnings
   - matched skills
   - missing skills
   - strengths
   - focus areas
   - grounded evidence highlights
   - trace id
6. If the AI service is down or times out, Spring Boot falls back to a simpler built-in analysis so the feature still works.

That fallback path matters. I did not want an "AI feature" that makes the whole product brittle.

## CV import flow

One of the most practical features in this repo is CV import.

Instead of forcing users to rebuild everything manually, they can upload an existing resume and let the system:

- extract text from PDF or DOCX
- detect sections
- infer likely skills and role direction
- map content into the editable resume structure
- suggest a starting template

This turns the app from "just another editor" into a migration tool that can actually fit how people already work.

## What this repository demonstrates

If someone is reviewing this project to understand how I work, these are the skills I wanted to make visible:

- designing end-to-end product flows, not isolated scripts
- connecting Java backend engineering with Python AI services cleanly
- building usable UX around AI features
- preferring explainability and fallbacks over hype
- treating deployment and maintainability as part of the work
- cleaning up code paths and reducing dead weight instead of leaving "demo leftovers" everywhere

## Tech stack

### Frontend

- React 18
- Vite
- Material UI
- Framer Motion
- html2canvas
- jsPDF

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- Apache POI
- PDFBox

### AI service

- Python
- FastAPI
- scikit-learn
- sentence-transformers
- pypdf
- python-docx
- rapidfuzz
- dateparser

### Tooling and deployment

- Render blueprint via [`render.yaml`](render.yaml)
- Docker Compose for local development
- H2 test profile for backend tests

## Repository structure

```text
.
|-- backend/
|   |-- src/main/java/com/cvbuilder/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- model/
|   |   |-- repository/
|   |   |-- security/
|   |   |-- service/
|   |-- src/main/resources/
|   |-- src/test/
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- data/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|
|-- python-ai-service/
|   |-- app/
|   |-- evals/
|   |-- traces/
|   |-- requirements.txt
|
|-- docker-compose.yml
|-- render.yaml
```

## Local development

Render is the main deployment path for this project.

If you want to run the full stack locally for development, use Docker Compose:

```bash
docker compose up --build
```

Services:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8081`
- AI service: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

This is the easiest local way to run the full product as intended.

## Manual local setup

### 1. Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+
- Python 3.10+
- PostgreSQL

### 2. Database

Create a PostgreSQL database named `CVBuilder`.

Defaults are already provided in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties), but you can override them with environment variables such as:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `AI_SERVICE_URL`
- `JWT_SECRET`

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

### 4. Start the AI service

```bash
cd python-ai-service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

## Verification

These are the checks I use to keep the project honest:

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
cd backend
mvn test
```

The backend test profile uses H2, so tests do not depend on a local Postgres instance.

### AI service

```bash
cd python-ai-service
python -m compileall app
python evals/run_eval.py
```

The eval harness is intentionally lightweight, but it still helps prevent regressions in ATS and matching behavior.

## Render notes

- The frontend is deployed as a static site, not a web service.
- The backend reads its database connection from Render Postgres.
- The backend talks to the AI service through the AI service public URL.
- Free instances may cold-start, so the first AI request can be slower.
- The first embedding-based semantic request can take longer because the model may need to warm up.

If you need the exact step-by-step deployment flow, use [`DEPLOY_TO_RENDER.md`](DEPLOY_TO_RENDER.md).

## Honest limitations

I think it is better to be clear about tradeoffs than to oversell them.

- CV import is text-based and works best when the PDF or DOCX contains extractable text. It is not a full OCR pipeline for scanned resumes.
- The frontend PDF export is template-faithful because it renders from the visual preview, while backend document exports focus more on reliable structured output than perfect visual parity.
- The semantic layer is intentionally lightweight enough to run locally or on free-tier infrastructure. That makes it practical, but it is not pretending to be a large proprietary hiring model.
- The current AI evaluation harness is useful for regression checks, but it is still small and should grow over time.

## Final note

This project matters to me because it sits at the intersection I care about most:

- software engineering that has to survive real product flows
- AI features that are grounded and explainable
- developer discipline that includes cleanup, testing, deployment, and documentation

It started as a CV builder. It became a much better representation of how I want to build applied AI systems.

## License

Released under the [MIT License](LICENSE).
