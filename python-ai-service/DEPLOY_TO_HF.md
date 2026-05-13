# Deploy to Hugging Face Spaces

This folder is ready to be used as the root of a Docker Space.

## What to upload

Upload the contents of `python-ai-service/` to a new Hugging Face Space configured with `sdk: docker`.

## Files to keep at the Space root

- `Dockerfile`
- `requirements.txt`
- `SPACE_README.md`
- `app/`
- `evals/`
- `traces/`

## Recommended setup

1. Create a new Space on Hugging Face.
2. Replace the generated `README.md` with the contents of `SPACE_README.md`.
3. Upload the rest of the files from this folder.
4. Optional runtime variables:
   - `EMBEDDING_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2`
   - `TRACE_DIR=/app/traces`

## Important limitation

The free Hugging Face path is best for the AI service demo only. The full product stack depends on multiple services and a database, so the one-command local `docker-compose.yml` setup is the better way to run the whole system.
