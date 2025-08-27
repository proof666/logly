# Logly

Minimal app for logging actions/habits with Google Auth (Firebase), Firestore, charts, and PWA.

## Requirements

- Node 18+
- Firebase project (Web App + Google Authentication + Firestore)

## Setup

1. Copy `.env.example` to `.env.local` and fill your Firebase keys.
2. Install dependencies and start the dev server.

## Scripts

- `npm run dev` — dev server
- `npm run build` — build
- `npm run preview` — preview build
- `npm run typecheck` — type check

## Architecture (FSD)

- `src/app` — providers, router, themes
- `src/pages` — pages: home, logs, record, profile
- `src/widgets` — larger UI blocks (items list, chart)
- `src/features` — feature modules (extensible)
- `src/entities` — entities (types in `shared/types`)
- `src/shared` — utils, api (firebase), hooks, UI

## Environment variables

See `.env.example`.
