---
title: CV Builder AI Service
emoji: "🧠"
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8000
short_description: Resume JD matching with embeddings, evidence, import parsing, and traces.
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
- `POST /import-cv`
- `GET /traces/{trace_id}`

## Notes

- This Space is meant for the AI service only, not the full multi-container product stack.
- Sentence-transformers is used when available, while TF-IDF remains available as a lightweight fallback.
- The import endpoint parses text-based resume files into structured resume sections for the main application.
