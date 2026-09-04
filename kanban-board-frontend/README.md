# Kanban Board Frontend

Production-ready Next.js frontend for the Kanban Board API.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the running NestJS API URL. The frontend validates this value at startup.

## Scripts

- `npm run dev`: start the development server
- `npm run lint`: run ESLint
- `npm run test`: run Vitest component and utility tests
- `npm run test:e2e`: run Playwright browser tests
- `npm run build`: create a production build
- `npm start`: serve the production build

## Deployment

Deploy the `kanban-board-frontend` directory as a Next.js project on Vercel. Add `NEXT_PUBLIC_API_URL` in Vercel Project Settings for Preview and Production environments, then redeploy. Configure the API server CORS policy to allow the deployed frontend origin.

The checked-in `.env.production` file is a placeholder only. Replace its value through your deployment environment settings; do not commit credentials or private API keys.

## Architecture

- `src/app`: App Router pages and route boundaries
- `src/features`: domain features for auth, boards, members, columns, tasks, and search
- `src/components`: shared UI, loading, error, theme, and dialog primitives
- `src/lib`: Axios, query client, toast, and utility modules
- `src/test`: Vitest setup and component/behavior tests
- `e2e`: Playwright smoke tests

## Quality

The production gate is TypeScript, ESLint, Vitest, and `npm run build`. API failures are surfaced with friendly retry states and standardized Sonner notifications. Auth state is persisted in the client-side store and invalid sessions are cleared by the Axios interceptor.
