# AgriNova UI (Integrated Frontend)

This is the new React + Vite UI integrated with the existing AgriTech backend services.

## What is integrated

- Live **market prices** from `GET /api/v1/market/prices`
- Live **government schemes** from `GET /api/v1/schemes`
- Live **weather lookup** on crop monitoring from `GET /api/v1/current?location=...`
- Live **AI chat + image diagnosis** from `POST /api/chat`

## Project stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion

## Local setup

### 1) Start backend services

From project root (`AgriTech`):

```bash
# Flask backend (port 5000)
python app.py
```

In a separate terminal:

```bash
# Node chat service (port 3000)
node server.js
```

### 2) Start UI

```bash
cd agrinova-ui-main
npm install
npm run dev
```

UI runs on `http://localhost:8080`.

## Environment variables for UI

Copy `.env.example` to `.env` (inside `agrinova-ui-main`) and adjust if needed.

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` is used for Flask API calls
- `VITE_CHAT_API_BASE_URL` is used for chat/image analysis API calls

If left empty, development uses Vite proxy defaults:

- `/api/*` -> `http://localhost:5000`
- `/api/chat` -> `http://localhost:3000`

## Backend prerequisites

To make all UI features work end-to-end, ensure backend has:

- Valid `.env` values in `AgriTech/.env` (or parent `.env`) for:
  - `GEMINI_API_KEY` (for AI chat)
  - DB config used by Flask backend
- Database migrations/tables initialized for market/weather/schemes data
- CORS for deployment domains (dev proxy avoids CORS issues locally)

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```
