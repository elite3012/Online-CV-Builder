# Deploy to Render

This repository includes a root-level [`render.yaml`](render.yaml) blueprint so the full stack can be deployed from one Render import.

## What gets deployed

- `cv-builder-frontend` as a static site
- `cv-builder-backend` as a Docker web service
- `cv-builder-ai-service` as a Docker web service
- `cv-builder-db` as a managed Postgres database

## Why the Render setup differs from local Docker

- On free Render plans, services are easier to manage when the frontend is deployed as a static site.
- The backend and AI service communicate over public service URLs.
- The backend still reads its database connection from the managed Postgres service.
- The AI service respects Render's assigned `PORT`.

## Deployment steps

1. Push the repository to GitHub.
2. Open the [Render Dashboard](https://dashboard.render.com/).
3. Choose `New` -> `Blueprint`.
4. Connect the GitHub repository for this project.
5. Confirm that Render detects [`render.yaml`](render.yaml).
6. Review the services and keep them in the same region.
7. Click `Apply`.
8. Wait for the first deploy to finish.

If you previously created the frontend as a Render web service, delete it first. Render cannot convert that service type into a static site in place.

## Recommended checks after deploy

1. Open the frontend URL.
2. Check the backend health endpoint: `/api/health`
3. Check the AI health endpoint: `/health`
4. Register a user.
5. Import or create a CV.
6. Run both ATS and semantic matching flows.
7. Export a file to confirm end-to-end behavior.

## Notes

- Free Render services may sleep after inactivity.
- The embedding model download can make the first semantic request slower.
- Trace files in the AI service should be treated as runtime diagnostics, not permanent storage.
- If Render ever fails to resolve a service URL automatically, set the relevant environment variables manually in the dashboard and redeploy.
