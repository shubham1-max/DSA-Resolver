<div align="center">

# ⚡ DSA Resolver — AI-Powered Problem Solver

A full‑stack, production‑grade DSA problem‑solving platform that uses **Google Gemini AI** to break down complex algorithmic problems into structured plans, optimized code, dry‑run traces, and coaching tips — all streamed in real time via **Server‑Sent Events (SSE)**.

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E?logo=railway)](https://railway.app/)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen)]()

### 🔗 [Visit the Live Platform →](https://pleasant-essence-production-7e9b.up.railway.app/)

</div>

---

## 📑 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Technologies Used](#technologies-used)
- [Key Concepts Learned](#key-concepts-learned)
- [AI Model Details](#ai-model-details)
- [Security & Performance](#security--performance)
- [Deployment](#deployment)
- [Known Issues & Limitations](#known-issues--limitations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About the Project

**DSA Resolver** is a structured reasoning engine for Data Structures & Algorithms. Instead of a one‑shot answer, it breaks every problem into four phases: **Plan → Code → Trace → Coach**, mirroring how competitive programmers think.

The platform features a polished UI with GSAP animations, 3D WebGL elements, glassmorphism, and dark/light theme support — designed to feel like a premium developer tool.

### Key Highlights

- 🧠 Structured reasoning: Plan, Code, Trace, Coach
- ⚡ Real‑time SSE streaming of AI responses
- 🔐 Full authentication: Email/OTP + Google OAuth
- 📊 Personal dashboard: streaks, topic distribution, weekly activity
- 📚 Problem bank with bookmarks and history
- 🌗 Dark/light theme with system preference detection
- 🎬 Cinematic animations and responsive design
- 🛡️ Production security: Helmet, rate limiting, bcrypt, JWT, Zod

---

## ✨ Features

### Solver Engine
- AI‑powered 4‑tab solution: Plan, Code (brute + optimal), Trace, Coach
- Live SSE streaming (tokens streamed and rendered in near real time)
- Auto topic detection (regex‑based classification)
- Multi‑language support: C++, Java, Python, JavaScript, C
- Draft persistence via localStorage
- Progressive hint system (up to 3 hints)
- Explain‑Back mode for self‑evaluation with AI feedback

### Authentication
- Email + OTP registration (Brevo)
- Google OAuth sign‑in
- OTP password recovery
- JWT sessions (24‑hour expiry)

### Dashboard & Analytics
- Daily streak tracking (timezone aware)
- Weekly activity chart
- Topic distribution and stats overview

### Problem Bank
- Debounced search and language filters
- Bookmarks and paginated history

### UI / UX
- Dark/light theme toggle
- GSAP animations and Three.js 3D hero
- Toast notifications and skeleton screens

---

## 🤖 How It Works

### Problem‑Solving Pipeline

User pastes a problem
         ↓
Topic detection + language selection
         ↓
Duplicate check (cached responses returned instantly)
         ↓
Google Gemini AI (SSE streaming, JSON schema)
         ↓
4‑tab output: Plan, Code, Trace, Coach
         ↓
Save to MongoDB and update streaks

### Auto‑Detected DSA Topics

- Arrays
- Sliding Window
- Two Pointers
- Binary Search
- Dynamic Programming
- Graphs
- Trees
- Stack / Queue
- Hash Map
- Greedy

---

## 🏗️ Architecture

Client (React) ⇄ Server (Express) ⇄ MongoDB Atlas
                            ⇄ Google Gemini AI
                            ⇄ Brevo (email)

The client streams SSE responses and renders the four sections with syntax highlighting. The server handles auth, problem solving (prompt engineering + SSE), persistence, and OTP/email delivery.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas or local MongoDB
- Google Cloud (OAuth + Gemini API key)
- Brevo account for transactional emails

### Installation

1. Clone the repo:
```bash
git clone https://github.com/shubham1-max/DSA-Resolver.git
cd DSA-Resolver
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Configure environment variables:
```bash
cp server/.env.example server/.env
# Fill the values in server/.env

# Create client .env.local
echo "VITE_API_BASE_URL=http://localhost:3000" > client/.env.local
```

5. Start development servers:

Terminal 1 — Server:
```bash
cd server
npm run dev
```

Terminal 2 — Client:
```bash
cd client
npm run dev
```

Open the app at http://localhost:5173.

Quick install (one liner):
```bash
git clone https://github.com/shubham1-max/DSA-Resolver.git && cd DSA-Resolver && cd server && npm install && cd ../client && npm install
```

---

## 🗂️ Project Structure

Top level overview:

- client/ — React frontend (Vite)
  - src/
    - api/ — API calls + SSE stream parser
    - components/ — UI components (CodeBlock, RevealEngine, HintLadder, etc.)
    - context/ — Auth & Theme contexts
    - hooks/ — useStream, useSolver, animations, etc.
    - pages/ — Home, Solve, Solution, Bank, Dashboard, Auth pages
    - main.jsx, App.jsx
  - server.js — production static server
  - vite.config.js

- server/ — Express backend
  - src/
    - controllers/ — auth.controller.js, problem.controller.js
    - lib/ — db.js
    - middlewares/ — auth middleware
    - models/ — user and problem schemas
    - routers/ — auth & problem routers
    - utils/ — email.js (Brevo)
    - index.js — server entry point
  - .env.example

---

## 🔐 Environment Variables

Server (server/.env)
- PORT (default: 3000)
- MONGO_URL (required)
- JWT_SECRET (required)
- GOOGLE_CLIENT_ID (required)
- GEMINI_API_KEY (required)
- BREVO_API_KEY (required)
- EMAIL_USER (optional, default: noreply@dsa-resolver.com)
- CLIENT_URL (required)
- NODE_ENV (development|production)

Client (client/.env.local)
- VITE_API_BASE_URL (required)
- VITE_GOOGLE_CLIENT_ID (required)

⚠️ Never commit .env files — they are ignored via .gitignore.

---

## 🎮 Usage Guide

1. Sign in (email + OTP or Google OAuth)
2. Go to Solve
3. Paste the problem (include constraints & examples)
4. Select language
5. Click "Resolve Problem" and watch the SSE stream
6. Explore Plan, Code, Trace, Coach tabs
7. Reveal hints (up to 3) if needed
8. Use Explain‑Back to test understanding

Example problems: sliding window, longest palindromic subsequence, BFS path existence.

---

## 💻 Technologies Used

Frontend: React 19, Vite 8, React Router, Framer Motion, GSAP, Three.js, Chart.js, React Syntax Highlighter

Backend: Express 5, Mongoose, @google/genai (Gemini SDK), bcryptjs, jsonwebtoken, Zod, Helmet, express-rate-limit, google-auth-library, nanoid

Infrastructure: Railway, MongoDB Atlas, Brevo, Google Cloud

---

## 📚 Key Concepts Learned

- SSE streaming and throttling
- Full auth pipeline (OTP + Google OAuth + JWT)
- Prompt engineering for structured AI output
- Security best practices (Helmet, rate limiting, Zod, bcrypt)
- Advanced React patterns and performance optimizations

---

## 🤖 AI Model Details

Provider: Google Gemini AI via @google/genai

Why Gemini:
- Structured JSON output (Plan, Code, Trace, Coach)
- Streaming support
- Multi‑language code generation
- Large context window for long problem statements

Response schema (example):
```json
{
  "plan": "...",
  "code": "...",
  "trace": "...",
  "coach": "...",
  "hints": ["Hint 1", "Hint 2", "Hint 3"]
}
```

---

## 🛡️ Security & Performance

Security:
- Helmet for headers
- Rate limiting (global and route-level)
- bcrypt (salt 12) for passwords
- JWT tokens (24h expiry)
- Zod for validation
- CORS origin whitelisting
- User‑scoped DB queries

Performance:
- SSE token buffering and flush interval (e.g., ~60ms)
- React.memo for heavy components
- Debounced search
- Code splitting and manual chunking
- Draft persistence in localStorage

---

## 🚀 Deployment

Deployed on Railway (client & server as separate services). The client is served as a static build with an Express server fallback for SPA routing.

To deploy your own:
1. Fork the repo
2. Create Railway services (server and client)
3. Set environment variables
4. Push to trigger deployments

Alternative: Client on Vercel + Server on Railway

---

## ⚠️ Known Issues & Limitations

- Gemini may sometimes produce suboptimal code for rare/complex algorithms — always review AI output.
- SSE streaming requires a stable connection; reconnect if interrupted.
- OTP delivery depends on Brevo queue — can take a few seconds.
- Google OAuth requires a verified Cloud project for production.
- JWTs expire after 24 hours (re-login required).

---

## 🔧 Troubleshooting

- Server fails to start: Check MONGO_URL and Atlas IP whitelist.
- OTP not arriving: Verify BREVO_API_KEY in server/.env and Brevo logs.
- CORS errors: Set CLIENT_URL to the frontend origin in server/.env.
- Google OAuth errors: Ensure GOOGLE_CLIENT_ID matches in server and client env.
- SSE freezes: Check Gemini API rate limits and server logs.

Helpful links:
- Google Gemini Docs: https://ai.google.dev/docs
- React: https://react.dev
- Mongoose: https://mongoosejs.com/docs/
- Report issues: https://github.com/shubham1-max/DSA-Resolver/issues

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: git checkout -b feature/your-feature
3. Make changes, test client & server
4. Commit and push
5. Open a Pull Request with a clear description

Contribution ideas: bugs, tests, new DSA patterns, UI/UX improvements, i18n.

---

## 📝 License

This project is licensed under the ISC License — see the [LICENSE](./LICENSE) file.

---

## 📧 Contact & Support

Built by Shubham S Patil

- Email: shubhamspatil2006@gmail.com
- GitHub: [@shubham1-max](https://github.com/shubham1-max)
- Report issues: https://github.com/shubham1-max/DSA-Resolver/issues

---

If you'd like, I can:
- Open a PR with this updated README if you provide the repo and branch details, or
- Generate a smaller changelog summarizing edits I made.
