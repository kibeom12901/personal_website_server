# Personal Website Server

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)

**Backend API powering the GPT-style chat on [Brian Kim's portfolio](https://github.com/kibeom12901/personal_website). Answers questions about Brian's background, projects, skills, and experience using a constrained system prompt.**

[Frontend Repo](https://github.com/kibeom12901/personal_website) · [Live Site](https://kibeom12901.github.io)

</div>

---

## Overview

This is a lightweight Node.js/Express server that sits behind the portfolio chat bar. Every message the visitor types is sent here, wrapped in a Brian-specific system prompt, and passed to the OpenAI API. The response comes back as clean, concise text — no hallucinations, no off-topic answers.

Key design decisions:
- **Constrained prompt** — the model can only answer from Brian's known information. If it doesn't know, it says so and points to the resume or GitHub.
- **Resource short-circuit** — requests for LinkedIn, GitHub, or the resume return a pre-built reply instantly, without hitting the OpenAI API.
- **Separated concerns** — `index.js` handles startup only; all app logic lives in `app.js` and is fully unit-testable with a stubbed OpenAI client.

---

## Architecture

<img width="1440" height="1016" alt="image" src="https://github.com/user-attachments/assets/794ac368-7ba1-4cf4-983a-d7f9551265a8" />


---

## Project structure
```
personal_website_server/
├── src/
│   ├── index.js        ← server entry point (port binding only)
│   └── app.js          ← Express app, routes, chat logic, system prompt
├── tests/
│   └── app.test.js     ← unit tests (Node built-in test runner)
├── .env.example        ← required environment variable template
├── package.json
└── README.md
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Server status + available endpoints |
| `GET` | `/health` | Health check — returns `{ ok: true }` |
| `POST` | `/api/chat` | Portfolio chat — accepts `{ message }`, returns `{ reply }` |

### Request / response
```
POST /api/chat
Content-Type: application/json

{ "message": "What internship experience do you have?" }
```
```json
{ "reply": "Brian interned at KETI as a System Engineer, working on the ST-P3 autonomous driving framework..." }
```

### Error responses

| Status | Cause |
|--------|-------|
| `400` | Missing or non-string `message` field |
| `500` | OpenAI API error or unhandled exception |

---

## Environment variables

Create a `.env` file from the provided template:
```bash
cp .env.example .env
```
```env
OPENAI_API_KEY=your_openai_api_key    # required
FRONTEND_ORIGIN=http://localhost:8000  # required — must match the calling frontend URL
PORT=3001                              # optional — defaults to 3001
```

> `FRONTEND_ORIGIN` is used to configure CORS. In production, set this to your deployed GitHub Pages URL (e.g. `https://kibeom12901.github.io`). Never commit `.env` — it is git-ignored.

---

## Local development

### Prerequisites

- Node.js 18+
- An OpenAI API key

### Setup
```bash
git clone https://github.com/kibeom12901/personal_website_server
cd personal_website_server
npm install
cp .env.example .env   # then add your OPENAI_API_KEY
npm start
```

Server runs at:
```
http://localhost:3001
```

### Test it
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What internship experience do you have?"}'
```

<!-- ═══════════════════════════════════════════════════════════════
  PUT IMAGE HERE (optional)
  Terminal screenshot showing the server starting + a curl response
  Upload to GitHub and paste URL here
════════════════════════════════════════════════════════════════ -->

---

## Tests

Uses Node.js's built-in test runner — no extra dependencies.
```bash
npm test
```

Covers:
- `healthHandler` — returns `{ ok: true }`
- `chatHandler` — validates missing `message`
- `chatHandler` — returns model output and passes correct payload to OpenAI
- `chatHandler` — returns `500` on OpenAI API errors

<!-- ═══════════════════════════════════════════════════════════════
  PUT IMAGE HERE (optional)
  Screenshot of npm test output showing all 4 tests passing
  Upload to GitHub and paste URL here
════════════════════════════════════════════════════════════════ -->

---

## Deployment

This server cannot be hosted on GitHub Pages (static only). Deploy to any Node.js-compatible platform:

| Platform | Notes |
|----------|-------|
| [Render](https://render.com) | Free tier available, easy GitHub integration |
| [Railway](https://railway.app) | Simple deploys, generous free tier |
| [Fly.io](https://fly.io) | Docker-based, good for low-latency |
| [Vercel Functions](https://vercel.com) | Serverless — requires minor refactor |

**After deploying:**
1. Set `OPENAI_API_KEY` and `FRONTEND_ORIGIN` as environment variables on the platform.
2. Update the fetch URL in the frontend's `script.js` to point to your live backend instead of `localhost:3001`.

---


## Frontend integration

This backend is built for the frontend portfolio:

**[github.com/kibeom12901/personal_website](https://github.com/kibeom12901/personal_website)**

The frontend sends `POST /api/chat` from the chat bar present on every page and renders the reply with a typewriter effect. In development, `script.js` points to `http://localhost:3001`. In production, it points to the deployed backend URL.

---

## About Brian

EE student at Tufts University. Interned at KETI (autonomous driving) and Stochastic (full-stack React). Currently serving in the Republic of Korea Army — open to roles from July 2026.

[LinkedIn](https://www.linkedin.com/in/brian-kim-2b3b40262/) · [GitHub](https://github.com/kibeom12901) · [Email](mailto:Kimkibeom1290@gmail.com)
