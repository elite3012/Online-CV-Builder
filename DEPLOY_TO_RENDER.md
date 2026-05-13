# Deploy Online CV Builder to Render

This repository now includes a root-level [render.yaml](/D:/MainProject/Online-CV-Builder/render.yaml) Blueprint so you can deploy the full stack in one import.

## What gets deployed

- `cv-builder-frontend`: React app as a Render Static Site
- `cv-builder-backend`: Spring Boot API as a public web service
- `cv-builder-ai-service`: FastAPI semantic analysis service as a public web service
- `cv-builder-db`: Render Postgres

## Why the Render setup is different from local Docker

- On Render free tier, free web services can send private network traffic but cannot receive it.
- Because of that limitation, the frontend must be a Static Site and both backend and AI service are contacted through their public Render URLs.
- The backend still connects to Render Postgres through its internal database connection string.
- The backend converts Render's Postgres connection string into Spring JDBC format at container startup.
- The AI container binds to the `PORT` variable assigned by Render.

## Deploy steps

1. Push the latest repo state to GitHub.
2. Open [Render Dashboard](https://dashboard.render.com/).
3. Choose `New` -> `Blueprint`.
4. Connect the GitHub repository that contains this project.
5. Confirm that Render detects [render.yaml](/D:/MainProject/Online-CV-Builder/render.yaml).
6. Review the four resources and keep them in the same region.
7. Click `Apply`.
8. Wait for the first deploy to finish.

If you already created `cv-builder-frontend` as a web service in an earlier attempt, delete that service first. Render cannot convert an existing web service into a static site in place.

## Recommended checks after deploy

1. Open the frontend service URL.
2. Open the backend health endpoint: `/api/health`
3. Open the AI health endpoint: `/health`
4. Register a user, create a CV, and run both:
   - ATS Readiness
   - Semantic Match with `Sentence Transformers`

## Notes

- Free Render services may sleep after inactivity.
- The AI service downloads the embedding model on first cold start, so the first semantic request can be slower.
- Trace files are written inside the AI container. On free instances, treat them as runtime diagnostics, not permanent storage.
- If Render ever fails to resolve `RENDER_EXTERNAL_URL` through the Blueprint for another service, set `BACKEND_PUBLIC_URL` on the static site and `AI_SERVICE_URL` on the backend manually in the dashboard, then redeploy.
