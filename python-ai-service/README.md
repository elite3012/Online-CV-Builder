---
title: CV Builder AI Service
emoji: "🧠"
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8000
short_description: Resume JD matching with embeddings, evidence, and traces.
license: mit
models:
  - sentence-transformers/all-MiniLM-L6-v2
preload_from_hub:
  - sentence-transformers/all-MiniLM-L6-v2
---

# CV Builder AI Service

This Space hosts the AI layer of the Online CV Builder project.

## Highlights

- Semantic resume-to-JD matching
- Switchable engines: TF-IDF and sentence-transformers
- Grounded evidence retrieval from resume content
- ATS readiness scoring
- JSON trace logging for observability

## API

- `GET /`
- `GET /health`
- `GET /engines`
- `POST /analyze`
- `GET /traces/{trace_id}`
