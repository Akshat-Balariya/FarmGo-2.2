# AgriTech (UI-First Repo)

This repository is now organized around the **new React UI** and the existing backend APIs.

## Active apps

- `agrinova-ui-main/` → New frontend (React + Vite + TypeScript)
- `backend/` + `app.py` → Existing Flask backend features/API
- `server.js` → AI chat/image analysis endpoint

## Removed from root

Old static root frontend pages (`*.html`, `*.css`, `*.js`) were removed so the repo stays focused on the new UI workflow.

## Run only UI

```bash
cd agrinova-ui-main
npm install
npm run dev
```

Open `http://localhost:8080`.

## Run with backend features

Terminal 1 (Flask backend):

```bash
cd AgriTech
source venv/bin/activate
FLASK_APP=app.py flask run --port 5000
```

Terminal 2 (AI chat backend):

```bash
cd AgriTech
node server.js
```

Terminal 3 (UI):

```bash
cd AgriTech/agrinova-ui-main
npm run dev
```

## Notes

- Vite proxy is configured to `127.0.0.1` targets to avoid macOS localhost/AirPlay port issues.
- If you want a stricter cleanup next, I can also remove the remaining legacy module folders that are no longer used by the UI.
