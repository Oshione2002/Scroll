# PDF AI Search

This monorepo contains a full-stack application that lets users upload PDFs and ask questions answered from those documents with citations.

## Setup

1. Copy `.env.example` to `.env` and fill in `OPENAI_API_KEY`.
2. Run `npm install` to install all dependencies.
3. Run `npm run dev` to start both the frontend and backend in development mode.

## Scripts

- `npm run dev` – start Vite and the Express server concurrently.
- `npm run build` – build frontend and backend.
- `npm test` – run unit tests for both workspaces.

## Deploy

1. Build the project with `npm run build`.
2. Push to a Git repository connected to Vercel or Render.
3. Configure `OPENAI_API_KEY` in the platform environment variables and deploy.
