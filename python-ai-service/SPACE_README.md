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

This Docker Space exposes the AI analysis layer of the Online CV Builder project.

## Endpoints

- `GET /health`
- `GET /engines`
- `POST /analyze`
- `GET /traces/{trace_id}`

## Notes

- The Space is intended for the AI service only, not the full multi-container product stack.
- Sentence-transformers is used when available; TF-IDF remains available as a lightweight fallback.
