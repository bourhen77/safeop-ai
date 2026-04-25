# SafeOp AI — Web Application

## Project Overview
SafeOp AI is an intelligent anesthesia assistance system that uses AI to help anesthesia technicians monitor patients, automate documentation, and make real-time clinical decisions during surgery.

This web app serves as both a **presentation website** and an **interactive demo** for ESPRIM 2026.

## Tech Stack
- **Frontend**: React 18 + Vite + Material UI (MUI v5) — Material Design style
- **Backend**: Node.js + Express + Socket.io
- **LLM (primary)**: Ollama local — model `mistral` (sLLM, free, offline)
- **LLM (fallback)**: Anthropic Claude API (`claude-haiku-4-5-20251001`)
- **Real-time**: Socket.io WebSocket for vital signs simulation
- **Charts**: Recharts for vital parameter visualization

## Project Structure
```
safeop-ai/
├── CLAUDE.md
├── .gitignore
├── docs/
│   └── jury-questions.md       ← anticipated jury Q&A
├── backend/                    ← Express server (port 3001)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── routes/
│       │   └── chat.js
│       └── services/
│           ├── knowledge.js    ← RAG knowledge base
│           ├── llm.js          ← Ollama + Claude fallback
│           └── simulation.js   ← vital signs engine
└── frontend/                   ← React app (port 5173)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── theme.js            ← MUI dark medical theme
        ├── pages/
        │   ├── Home.jsx
        │   └── Demo.jsx
        └── components/
            ├── Navbar.jsx
            ├── home/
            │   ├── Hero.jsx
            │   ├── Problem.jsx
            │   ├── Solution.jsx
            │   ├── Intelligence.jsx
            │   ├── Objectives.jsx
            │   └── Footer.jsx
            └── demo/
                ├── VitalMonitor.jsx
                ├── ChatBot.jsx
                ├── ScenarioPanel.jsx
                └── AIDecisionPanel.jsx
```

## Setup & Run

### Prerequisites
- Node.js 18+
- Ollama installed: https://ollama.ai
- Pull the model: `ollama pull mistral`
- (Optional) Anthropic API key for cloud fallback

### Development
```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in:
```
OLLAMA_MODEL=mistral
OLLAMA_URL=http://localhost:11434
ANTHROPIC_API_KEY=          # optional — Claude fallback
PORT=3001
```

## LLM Architecture (RAG)
1. SafeOp AI knowledge base (`knowledge.js`) — chunked docs from project brief
2. User question → keyword search → retrieve top relevant chunks
3. Chunks injected as context into LLM system prompt
4. LLM (Ollama/Mistral) generates contextualized French response

**Supported models** (set `OLLAMA_MODEL`):
- `mistral` — default, 7B params, best quality
- `llama3.2` — 3B params, faster
- `phi3:mini` — Microsoft, very fast, good reasoning

## Demo Features
1. **Scenario selector** — Normal, Hypotension, Bradycardie, Chirurgie Pédiatrique
2. **Real-time vital signs** — HR, SpO2, BP (sys/dia), RR, Temperature — updates every second
3. **AI Decision panel** — event log with severity-coded alerts + AI recommendations
4. **ChatBot** — Ask anything about SafeOp AI, RAG-powered, Mistral response

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/chat | LLM chat with RAG context |
| GET | /api/health | Health check + Ollama status |
| WS | / | Socket.io for simulation data |

## Jury Q&A
See `docs/jury-questions.md` for all anticipated questions with model answers.
