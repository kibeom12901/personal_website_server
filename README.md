# Personal Website Server

Backend API for the personal portfolio website chat experience.

## Overview

This server powers the GPT-style chat on the portfolio site. It exposes a simple API that answers questions about my background, projects, skills, experience, and contact links using a constrained system prompt.

## Tech Stack

- Node.js
- Express
- OpenAI API
- CORS
- dotenv

## Project Structure

- `src/index.js` - server entry point
- `src/app.js` - Express app setup, routes, and chat logic
- `.env.example` - required environment variables
- `tests/` - backend tests

## API Endpoints

- `GET /`
  - basic server status
- `GET /health`
  - health check
- `POST /api/chat`
  - portfolio chat endpoint

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
OPENAI_API_KEY=your_openai_api_key
FRONTEND_ORIGIN=http://localhost:8000
PORT=3001
```

Notes:
- `OPENAI_API_KEY` is required
- `FRONTEND_ORIGIN` should match the frontend URL calling this server
- default port is `3001`

## Install

```bash
cd ~/Desktop/server
npm install
```

## Run Locally

```bash
cd ~/Desktop/server
npm start
```

The server will start at:

```text
http://localhost:3001
```

Chat endpoint:

```text
POST http://localhost:3001/api/chat
```

## Example Request

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What internship experience do you have?"}'
```

## Frontend Integration

This backend is meant to be used by the frontend portfolio repo:

- Frontend repo: `https://github.com/kibeom12901/personal_website`

When deployed, update the frontend chat fetch URL in the portfolio site so it points to the live backend instead of `localhost:3001`.

## Deployment Notes

This server cannot be hosted on GitHub Pages.
Deploy it on a backend platform such as:

- Render
- Railway
- Fly.io
- Vercel Functions

Keep `.env` private and never commit API keys.

## Scripts

```bash
npm start
npm test
```

## Behavior

The backend uses a constrained portfolio prompt and is designed to:

- answer only from known portfolio information
- avoid hallucinating
- keep responses concise
- return direct links for resume, GitHub, and LinkedIn when relevant

