# FarmPulse AI

FarmPulse AI is a React + FastAPI analytics platform for satellite crop stress monitoring.

## Local development

### Frontend
```bash
npm install
npm run dev:frontend
```

### Backend
```bash
python3 -m pip install fastapi uvicorn
python3 -m uvicorn backend.main:app --reload --port 8000
```

### Run both
```bash
npm run dev:all
```

## Build
```bash
npm run build
```

## Deploy (Vercel)
This repository is configured for Vite frontend deployment on Vercel.
