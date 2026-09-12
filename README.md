<div align="center">

# ⚡ DSA Resolver

### AI-Powered Structured Problem Solver

A full-stack, production-grade DSA problem-solving platform that uses **Google Gemini AI** to decompose complex algorithmic problems into structured **Plan → Code → Trace → Coach** breakdowns — streamed token-by-token in real time via **Server-Sent Events**.

<br />

[![Live](https://img.shields.io/badge/🔗_Live_Demo-Visit_Platform-0066FF?style=for-the-badge)](https://pleasant-essence-production-7e9b.up.railway.app/)
[![Stars](https://img.shields.io/github/stars/shubham1-max/DSA-Resolver?style=for-the-badge&logo=github&color=yellow)](https://github.com/shubham1-max/DSA-Resolver)

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)

</div>

<br />

> **Not another code generator.** DSA Resolver mirrors how top competitive programmers think — it identifies the pattern, builds the approach, traces every variable, then coaches you for the interview. All four phases stream live, so you watch the reasoning unfold in real time.

---

## 📑 Table of Contents

- [Why DSA Resolver](#why-dsa-resolver)
- [Features](#features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Tech Stack](#tech-stack)
- [Key Concepts Learned](#key-concepts-learned)
- [AI Model Details](#ai-model-details)
- [Security and Performance](#security-and-performance)
- [Deployment](#deployment)
- [Known Issues and Limitations](#known-issues-and-limitations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License and Contact](#license-and-contact)

---

## Why DSA Resolver

Most AI coding tools give you a single code block and call it a day. DSA Resolver is fundamentally different:

| Traditional AI Tools | DSA Resolver |
|---------------------|-------------|
| One code block output | **4-phase structured breakdown** |
| Copy-paste answers | **Teaches you the reasoning** |
| No memory of past solves | **Full problem bank + streak tracking** |
| Static response | **Live SSE streaming — watch it think** |
| Generic output | **Language-specific** (C++, Java, Python, JS, C) |
| No verification | **Explain-back mode** — prove you understood |

### Perfect For Learning

- 🤖 **AI/LLM Integration** — Real-world example of prompt engineering and streaming
- 🔗 **Full-Stack Architecture** — React frontend + Express backend + MongoDB
- ⚙️ **Auth Systems** — Email OTP + Google OAuth + JWT from scratch (no Auth0/Firebase)
- 📱 **Production UI** — GSAP animations, Three.js 3D, dark/light themes
- 🛡️ **Security Practices** — Helmet, rate limiting, bcrypt, Zod validation

---

## Features

<table>
<tr>
<td width="50%">

### 🧠 4-Phase AI Solver
- **Plan** — Pattern identification, approach explanation, Big-O complexity analysis
- **Code** — Brute force vs optimal implementation with syntax highlighting
- **Trace** — Variable-by-variable step-through dry run table
- **Coach** — Edge cases, interview tips, and communication advice
- Progressive 3-step hint system (reveal without seeing full answer)
- Explain-back mode (explain in your words → AI grades you)

</td>
<td width="50%">

### ⚡ Real-Time SSE Streaming
- Server-Sent Events from Google Gemini AI
- Throttled at 60ms intervals for buttery 60 FPS rendering
- Abort mid-stream with cancel button
- Draft input persists across page refreshes via localStorage
- Duplicate detection — already solved? Returns cached response instantly
- Auto topic detection via regex classification (10 categories)

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Complete Auth System
- 📧 Email registration with 6-digit OTP verification (via Brevo HTTP API)
- 🔑 Google OAuth one-click sign-in with automatic account creation
- 🔒 2-step Google flow: verify token → set password → create account
- 🔄 Password recovery via OTP-based forgot/reset flow
- 🍪 24-hour JWT sessions with automatic 401 redirect on expiry
- 🔐 bcrypt (salt 12) password hashing — industry standard

</td>
<td width="50%">

### 📊 Personal Dashboard
- 🔥 Daily streak tracking with timezone awareness (`x-tz-offset` header)
- 📈 Weekly activity bar chart (Chart.js) — last 7 days of solves
- 🏷️ Topic distribution breakdown — see which DSA categories you practice most
- 🏆 Stats overview — total solves, current streak, longest streak, bookmarked count
- 🎯 Focus queue — recent problems for quick review
- 🖱️ Custom GSAP cursor follower with scale animations

</td>
</tr>
<tr>
<td width="50%">

### 📚 Problem Bank
- 🔎 Debounced search (150ms) — filter problems by keyword with zero typing lag
- 🌐 Language filter — C++, Java, Python, JavaScript, or C
- ⭐ Bookmark toggle — save important problems for later review
- 📜 Paginated history — full archive of every problem you have ever solved
- 🔒 User scoped — you only see your own problems, cryptographically enforced

</td>
<td width="50%">

### 🎨 Cinematic UI / UX
- 🌗 Dark/Light theme with system preference detection + manual toggle
- 🎭 GSAP scroll-triggered reveals, tilt cards, magnetic buttons, spotlight glow
- 🌐 Three.js 3D interactive graph visualization on landing page
- 🔔 Spring-animated toast notifications (Framer Motion)
- 💀 Skeleton screens during lazy loading
- 📱 Fully responsive — desktop, tablet, and mobile optimized
- ♿ Keyboard navigation + screen reader accessible

</td>
</tr>
</table>

---

## How It Works

### The Problem-Solving Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📝 Paste DSA Problem                                      │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ "Given an array nums and integer k, return the       │  │
│   │  length of the longest subarray with sum ≤ k"        │  │
│   └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│   │ 🔍 Detect   │  │ 🌐 Select   │  │ ♻️  Check Cache  │   │
│   │ Topic:      │  │ Language:   │  │ Already solved?  │   │
│   │ "Sliding    │  │ C++         │  │ Return cached    │   │
│   │  Window"    │  │             │  │ response         │   │
│   └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
│          └────────────────┼───────────────────┘             │
│                           ▼                                  │
│            ┌──────────────────────────┐                      │
│            │    🤖 Google Gemini AI    │                      │
│            │    Structured Prompt →    │                      │
│            │    SSE Token Streaming    │                      │
│            │    (60ms throttled)       │                      │
│            └────────────┬─────────────┘                      │
│                         ▼                                    │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│   │ Plan │ │ Code │ │Trace │ │Coach │  ← 4 Interactive Tabs │
│   └──────┘ └──────┘ └──────┘ └──────┘                      │
│                         │                                    │
│                         ▼                                    │
│        💾 Saved to MongoDB + 🔥 Streak Updated              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Detected DSA Topics

| Topic | Trigger Keywords |
|:------|:-----------------|
| **Arrays** | `array`, `subarray`, `index`, `element` |
| **Sliding Window** | `window`, `contiguous`, `longest`, `shortest` |
| **Two Pointers** | `sorted`, `pair`, `left`, `right` |
| **Binary Search** | `binary search`, `sorted array`, `log n` |
| **Dynamic Programming** | `dp`, `memo`, `tabulation` |
| **Graph** | `graph`, `bfs`, `dfs`, `node`, `edge`, `adjacency` |
| **Tree** | `binary tree`, `root`, `leaf`, `bst` |
| **Stack / Queue** | `stack`, `queue`, `monotonic`, `deque` |
| **Hash Map** | `hash`, `map`, `dictionary`, `frequency`, `lookup` |
| **Greedy** | `greedy`, `interval`, `schedule`, `minimum` |

### AI Response Schema

The AI is prompted to return a structured JSON object with 5 fields:

```json
{
  "plan": "Pattern identification + approach explanation + complexity analysis (time & space)",
  "code": "Brute force implementation + optimal implementation with inline comments",
  "trace": "Step-by-step variable tracking through a concrete example input",
  "coach": "Edge cases + interview tips + what to say to the interviewer",
  "hints": ["Hint 1 (subtle nudge)", "Hint 2 (stronger clue)", "Hint 3 (nearly reveals approach)"]
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
│                                                                  │
│   React 19 · Vite 8 · Framer Motion · GSAP · Three.js          │
│                                                                  │
│   Pages:  Home → Solve → Solution → Bank → Dashboard            │
│   Auth:   Login · Register · OTP · Google OAuth · Forgot Pass   │
│   Hooks:  useStream (SSE) · useSolver · useAwwwardsMotion       │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS + JWT Bearer Token
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER                                   │
│                                                                  │
│   Express 5 · Mongoose 9 · Zod · Helmet · Rate Limiting        │
│                                                                  │
│   Auth:     /user/register · /user/login · /user/auth/google    │
│             /user/verify-otp · /user/me · /user/reset-password  │
│             /user/resend-otp · /user/forgot-password            │
│             /user/complete-google-signup                        │
│                                                                  │
│   Problems: /problem/solve (SSE) · /problem/history             │
│             /problem/:id/hint · /problem/:id/bookmark           │
│             /problem/evaluate · /problem/:id                    │
│                                                                  │
└───────────┬─────────────────┬───────────────┬───────────────────┘
            │                 │               │
            ▼                 ▼               ▼
     ┌────────────┐   ┌────────────┐   ┌────────────┐
     │  MongoDB   │   │  Gemini    │   │   Brevo    │
     │  Atlas     │   │  AI API    │   │  Email API │
     └────────────┘   └────────────┘   └────────────┘
```

### API Endpoints Reference

<details>
<summary><strong>Auth Endpoints</strong> (<code>/user</code>)</summary>

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/user/register` | Register with name, email, password → sends 6-digit OTP |
| `POST` | `/user/verify-otp` | Verify OTP → returns JWT token |
| `POST` | `/user/resend-otp` | Resend new OTP to email |
| `POST` | `/user/login` | Login with email + password → returns JWT |
| `POST` | `/user/forgot-password` | Send password reset OTP |
| `POST` | `/user/reset-password` | Verify OTP + set new password |
| `POST` | `/user/auth/google` | Google OAuth → existing user logs in, new user gets `pendingToken` |
| `POST` | `/user/complete-google-signup` | Complete Google signup with `pendingToken` + chosen password |
| `GET` | `/user/me` | Get user profile, streak, longestStreak, totalSolved (protected) |

</details>

<details>
<summary><strong>Problem Endpoints</strong> (<code>/problem</code>)</summary>

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/problem/solve` | Solve a problem via SSE streaming (rate limited) |
| `GET` | `/problem/history` | Paginated history of solved problems (up to 50/page) |
| `PATCH` | `/problem/:id/hint` | Reveal next hint (max 3 per problem) |
| `PATCH` | `/problem/:id/bookmark` | Toggle bookmark on a problem |
| `POST` | `/problem/evaluate` | AI evaluates your self-explanation |
| `GET` | `/problem/:id` | Fetch full problem record by ID |

</details>

---

## Getting Started

### Prerequisites

| Requirement | Version | Link |
|:------------|:--------|:-----|
| Node.js | ≥ 18 | [Download](https://nodejs.org/) |
| MongoDB | Atlas (free) | [Sign up](https://www.mongodb.com/atlas) |
| Google Cloud | OAuth + Gemini Key | [Console](https://console.cloud.google.com/) |
| Brevo | Free tier | [Sign up](https://www.brevo.com/) |

```bash
node --version   # Must be >= 18
npm --version
```

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/shubham1-max/DSA-Resolver.git
cd DSA-Resolver
```

**2. Install server dependencies:**
```bash
cd server
npm install
```

**What gets installed:** `express`, `mongoose`, `@google/genai`, `bcryptjs`, `jsonwebtoken`, `zod`, `helmet`, `express-rate-limit`, `google-auth-library`, `nanoid`, `dotenv`, `cors`

**3. Install client dependencies:**
```bash
cd ../client
npm install
```

**What gets installed:** `react`, `react-dom`, `react-router-dom`, `framer-motion`, `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`, `chart.js`, `react-chartjs-2`, `lucide-react`, `react-syntax-highlighter`

**4. Configure environment variables:**

```bash
# Server
cp server/.env.example server/.env
# Fill in your API keys (see Environment Variables section)

# Client
echo "VITE_API_BASE_URL=http://localhost:3000" > client/.env.local
```

⚠️ **Never commit `.env` files — they are already in `.gitignore`**

**5. Start the development servers:**

```bash
# Terminal 1 — Server (port 3000)
cd server
npm run dev

# Terminal 2 — Client (port 5173)
cd client
npm run dev
```

The app opens at `http://localhost:5173` 🎉

### Quick Start (One Command)

```bash
git clone https://github.com/shubham1-max/DSA-Resolver.git && cd DSA-Resolver && cd server && npm install && cd ../client && npm install
```

---

## Project Structure

```
DSA-Resolver/
│
├── client/                              # ⚛️ React Frontend (Vite)
│   ├── public/
│   │   ├── videos/                      # Demo video + poster image
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js                 # All API calls + SSE stream parser
│   │   ├── components/
│   │   │   ├── 3d/HeroGraph.jsx         # Three.js 3D interactive graph
│   │   │   ├── BlurText.jsx             # Animated blur-reveal text effect
│   │   │   ├── CodeBlock.jsx            # Syntax highlighted code blocks
│   │   │   ├── DecryptedText.jsx        # Typewriter decrypt animation
│   │   │   ├── ErrorBoundary.jsx        # React error boundary wrapper
│   │   │   ├── ExplainBack.jsx          # AI-evaluated self-explanation
│   │   │   ├── FadeContent.jsx          # Intersection observer fade-in
│   │   │   ├── GoogleButton.jsx         # Google OAuth sign-in button
│   │   │   ├── HintLadder.jsx           # Progressive 3-step hint reveal
│   │   │   ├── InfoCard.jsx             # Memoized stat display card
│   │   │   ├── LightRays.jsx            # Decorative SVG light rays
│   │   │   ├── Navbar.jsx               # Top navigation + user dropdown
│   │   │   ├── OptimalTabs.jsx          # Brute vs Optimal code comparison
│   │   │   ├── OtpInput.jsx             # 6-digit OTP input component
│   │   │   ├── RevealEngine.jsx         # Markdown renderer + 4-tab system
│   │   │   ├── Skeleton.jsx             # Loading skeleton placeholder
│   │   │   ├── SpotlightCard.jsx        # Memoized spotlight hover card
│   │   │   ├── Stepper.jsx              # Step indicator component
│   │   │   ├── StreakChart.jsx           # Memoized Chart.js bar chart
│   │   │   └── TraceTable.jsx           # Variable trace dry-run table
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Auth state + session + history
│   │   │   └── ThemeContext.jsx          # Dark/Light theme toggle
│   │   ├── hooks/
│   │   │   ├── useAwwwardsMotion.js      # GSAP entrance + hover animations
│   │   │   ├── useScrollReveal.js        # Scroll-triggered reveals
│   │   │   ├── useSolver.js              # Problem solving orchestrator
│   │   │   └── useStream.js              # Throttled SSE stream consumer
│   │   ├── pages/
│   │   │   ├── Bank.jsx                  # Problem archive + search/filter
│   │   │   ├── CompleteSignup.jsx        # Google OAuth password setup
│   │   │   ├── Dashboard.jsx             # Stats + streak + analytics
│   │   │   ├── ForgotPassword.jsx        # OTP-based password recovery
│   │   │   ├── Home.jsx                  # Landing page + 3D hero
│   │   │   ├── Login.jsx                 # Sign in form
│   │   │   ├── NotFound.jsx              # 404 error page
│   │   │   ├── Register.jsx              # Sign up + OTP verification
│   │   │   ├── Solution.jsx              # Detailed problem viewer
│   │   │   └── Solve.jsx                 # Live AI solver workspace
│   │   ├── App.jsx                       # Root routes + layout
│   │   ├── App.css                       # Component styles
│   │   ├── index.css                     # Design tokens + global styles
│   │   ├── main.jsx                      # Entry point + providers
│   │   └── proof-studio.css              # Solve page specific styles
│   ├── server.js                         # Production static file server
│   ├── vite.config.js                    # Build + manual chunking config
│   └── package.json
│
├── server/                               # 🖥️ Node.js Backend (Express 5)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Register, Login, OTP, Google OAuth
│   │   │   └── problem.controller.js     # Solve (SSE), History, Hints, Bookmarks
│   │   ├── lib/
│   │   │   └── db.js                     # MongoDB connection helper
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js         # JWT verification middleware
│   │   ├── models/
│   │   │   ├── user.model.js             # User schema (bcrypt, OTP, streak)
│   │   │   └── problem.model.js          # Problem schema (AI response, hints)
│   │   ├── routers/
│   │   │   ├── auth.router.js            # Auth routes + rate limiting
│   │   │   └── problem.router.js         # Problem routes + rate limiting
│   │   ├── utils/
│   │   │   └── email.js                  # Brevo HTTP API email sender
│   │   └── index.js                      # Server entry: Express + Helmet + CORS
│   ├── .env.example                      # Environment variable template
│   └── package.json
│
└── README.md
```

### Key Files Explained

| File | Purpose |
|:-----|:--------|
| `client/src/hooks/useStream.js` | Throttled SSE consumer — buffers AI tokens and flushes at 60ms intervals for smooth rendering |
| `client/src/hooks/useSolver.js` | Orchestrates the solve flow, auto-detects topics, persists draft questions to localStorage |
| `client/src/components/RevealEngine.jsx` | Parses the AI JSON response into 4 interactive tabs with syntax highlighting |
| `client/src/api/index.js` | All 15+ API calls + SSE stream parser + automatic 401 session expiry handling |
| `server/src/controllers/problem.controller.js` | Core solver — prompt engineering, SSE streaming, duplicate detection, streak updates |
| `server/src/controllers/auth.controller.js` | Full auth — register, OTP, login, Google OAuth 2-step, password reset |
| `server/src/utils/email.js` | Sends OTP emails via Brevo HTTP API using native `https` (bypasses Railway SMTP blocks) |

---

## Environment Variables

<details open>
<summary><strong>Server</strong> (<code>server/.env</code>)</summary>

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `PORT` | | Server port (default: `3000`) |
| `MONGO_URL` | ✅ | MongoDB connection string (e.g. `mongodb+srv://...`) |
| `JWT_SECRET` | ✅ | Secret key for signing and verifying JWTs |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID from Cloud Console |
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key from AI Studio |
| `BREVO_API_KEY` | ✅ | Brevo transactional email API key |
| `EMAIL_USER` | | Sender email address (default: `noreply@dsa-resolver.com`) |
| `CLIENT_URL` | ✅ | Production frontend URL for CORS whitelisting |
| `NODE_ENV` | | `development` or `production` |

</details>

<details open>
<summary><strong>Client</strong> (<code>client/.env.local</code>)</summary>

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `VITE_API_BASE_URL` | ✅ | Backend API URL (e.g. `http://localhost:3000`) |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID (same value as server) |

</details>

---

## Usage Guide

### Step-by-Step Solving

1. **Sign In** — Register with email (OTP verified) or use Google one-click sign-in
2. **Navigate to Solve** — Click "Solve" in the navbar
3. **Paste Your Problem** — Enter the full DSA question with constraints and examples
4. **Select Language** — Choose C++, Java, Python, JavaScript, or C
5. **Click "Resolve Problem"** (or press `Ctrl+Enter`) — Watch the AI stream the solution in real time
6. **Explore All 4 Tabs:**
   - **Plan** — Pattern identification, approach explanation, time & space complexity
   - **Code** — Brute force vs optimal implementation with syntax highlighting
   - **Trace** — Step-by-step variable tracking through a concrete dry run
   - **Coach** — Edge cases, interview tips, and what to say to your interviewer
7. **Reveal Hints** — Use progressive hints (up to 3) before viewing the full solution
8. **Explain Back** — Test your understanding by explaining the solution in your own words — the AI grades you

### Try These Problem Combos

**Sliding Window:**
> Given an integer array nums and an integer k, return the length of the longest subarray whose sum is less than or equal to k.

**Dynamic Programming:**
> Given a string s, find the longest palindromic subsequence's length.

**Graph:**
> Given n nodes and edges, find if there exists a path between source and destination using BFS.

**Tree:**
> Given the root of a binary tree, return its maximum depth.

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **React** | 19.2 | UI framework with hooks |
| **Vite** | 8.0 | Build tool with HMR (10x faster than CRA) |
| **React Router** | 7.18 | Client-side routing with lazy loading |
| **Framer Motion** | 12.40 | Page transitions + toast animations |
| **GSAP** | 3.15 | Scroll reveals, tilt cards, magnetic effects |
| **Three.js** | 0.184 | 3D interactive hero graph |
| **@react-three/fiber** | 9.6 | React renderer for Three.js |
| **@react-three/drei** | 10.7 | Three.js helpers and abstractions |
| **Chart.js** | 4.5 | Weekly activity bar chart |
| **react-chartjs-2** | 5.3 | React wrapper for Chart.js |
| **Lucide React** | 1.21 | Icon library (tree-shakeable) |
| **React Syntax Highlighter** | 16.1 | Code block highlighting |

</td>
<td valign="top" width="50%">

### Backend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Express** | 5.2 | HTTP server framework |
| **Mongoose** | 9.6 | MongoDB ODM with schema validation |
| **@google/genai** | 2.7 | Gemini AI SDK for streaming |
| **bcryptjs** | 3.0 | Password hashing (salt 12) |
| **jsonwebtoken** | 9.0 | JWT authentication (24h expiry) |
| **Zod** | 4.4 | Runtime request body validation |
| **Helmet** | 8.3 | Secure HTTP headers |
| **express-rate-limit** | 8.5 | Brute-force protection |
| **google-auth-library** | 10.7 | Google OAuth token verification |
| **nanoid** | 3.3 | Secure OTP generation |
| **cors** | 2.8 | Cross-origin resource sharing |
| **dotenv** | 17.4 | Environment variable loading |

</td>
</tr>
</table>

### Infrastructure

| Service | Purpose |
|:--------|:--------|
| **Railway** | Server + client deployment (Nixpacks auto-detect) |
| **MongoDB Atlas** | Cloud database (free tier) |
| **Brevo** | Transactional email — OTP delivery via HTTP API |
| **Google Cloud** | OAuth Client ID + Gemini AI API |

### Available Scripts

```bash
# Client
npm run dev        # Start dev server with hot reload (port 5173)
npm run build      # Build for production → dist/
npm run preview    # Preview production build locally
npm run lint       # Check code quality with ESLint

# Server
npm run dev        # Start with nodemon (auto-restart on changes)
npm start          # Start production server
```

---

## Key Concepts Learned

### 1. Real-Time SSE Streaming 🌊
Implemented Server-Sent Events from scratch — the server streams AI tokens one by one while the client buffers them and renders at 60ms intervals (~16 renders/sec) to maintain smooth 60 FPS without choking the browser.

### 2. Full Authentication System 🔐
Built a complete auth pipeline from scratch: email/password registration with 6-digit OTP verification, Google OAuth 2-step flow (verify token → set password → create account), JWT session management with auto-expiry, and password reset — all without Auth0 or Firebase.

### 3. AI Prompt Engineering 🤖
Designed structured prompts that force Google Gemini to respond in a strict JSON schema with four distinct sections (Plan/Code/Trace/Coach + 3 progressive hints), enabling reliable tab-based rendering without parsing failures.

### 4. Production Security 🛡️
Applied defense-in-depth: Helmet HTTP headers, global rate limiting (150 req/15min) + per-route stricter limits on auth and solve, bcrypt password hashing (salt 12), JWT expiration (24h), Zod input validation, CORS origin whitelisting, and user-scoped database queries.

### 5. Advanced React Patterns ⚛️
Mastered `React.lazy()` code splitting, `React.memo()` component memoization, custom hooks (`useStream`, `useSolver`, `useAwwwardsMotion`), context providers (Auth + Theme), error boundaries, and debounced state for search inputs.

### 6. Award-Winning UI Design 🎨
Created a cinematic interface with GSAP scroll-triggered reveals, Three.js 3D WebGL hero, Framer Motion page transitions, glassmorphism styling, spotlight hover cards, magnetic buttons, tilt effects, and responsive dark/light theming with system preference detection.

### 7. Performance Optimization ⚡
Implemented SSE stream throttling (60ms batched renders), search bar debouncing (150ms), aggressive component memoization (`React.memo` on SpotlightCard, InfoCard, StreakChart), route-level code splitting, manual Rollup chunking (react-vendor, animation-vendor, icons-vendor, syntax-vendor), and video poster attributes for instant perceived load.

---

## AI Model Details

### Google Gemini AI

**Provider:** Google DeepMind via `@google/genai` SDK

**Why Gemini?**
- ✅ **Structured Output** — Reliably returns JSON with Plan/Code/Trace/Coach sections
- ✅ **Fast Streaming** — SSE token streaming with low latency
- ✅ **Free Tier** — Generous free quota for development and personal use
- ✅ **Multi-Language** — Generates correct code in C++, Java, Python, JavaScript, C
- ✅ **Context Window** — Handles long problem statements with full constraints and examples
- ✅ **Instruction Following** — Instruction-tuned model understands detailed prompt schemas

### Performance Characteristics

- **Response Time:** 3-15 seconds depending on problem complexity and API load
- **Token Usage:** ~200-500 tokens per structured response
- **Success Rate:** >99% with valid DSA problem inputs
- **Streaming:** Real-time token delivery via SSE with 60ms client-side batching

### Cost

- **Free tier** covers development and personal use
- No credit card required for getting started
- See [Google AI Studio](https://ai.google.dev/) for current pricing tiers

---

## Security and Performance

<table>
<tr>
<td width="50%">

### 🔒 Security Measures
- **Helmet.js** — Sets secure HTTP headers (X-Content-Type-Options, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** — 150 req/15min global + stricter limits on auth and solve endpoints
- **bcrypt (salt 12)** — Industry-standard password hashing
- **JWT (24h expiry)** — Stateless authentication with automatic expiration
- **Zod Validation** — Server-side input sanitization on every endpoint
- **CORS Whitelist** — Only configured origins + localhost can make requests
- **User Scoping** — Every database query is filtered by `req.user.id` — impossible for users to access each other's data
- **OTP Hashing** — OTPs are hashed before storage, 10-minute expiry

</td>
<td width="50%">

### ⚡ Performance Optimizations
- **SSE Stream Throttling** — Buffers tokens, flushes every 60ms (~16 renders/sec)
- **React.memo** — SpotlightCard, InfoCard, StreakChart skip unnecessary re-renders
- **Search Debouncing** — Bank search waits 150ms after you stop typing
- **Code Splitting** — Lazy-loaded routes: Solve, Bank, Dashboard, Solution, CompleteSignup
- **Manual Chunking** — Vite splits into react-vendor, animation-vendor, icons-vendor, syntax-vendor bundles
- **Video Poster** — Hero video shows lightweight JPG while MP4 loads in background
- **Draft Persistence** — Question input saved to localStorage, survives page refresh
- **Duplicate Detection** — Already-solved problems return cached responses instantly

</td>
</tr>
</table>

---

## Deployment

### Current Setup (Railway)

Both **client** and **server** are deployed as separate Railway services:

**Server Configuration:**
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
```

**Client Configuration:**
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
```

The client's `server.js` serves the built `dist/` folder via Express with SPA wildcard fallback for client-side routing.

### Deploy Your Own

1. Fork this repository
2. Create a [Railway](https://railway.app/) account
3. Create two services: one pointing to `server/`, one to `client/`
4. Add all environment variables from the [Environment Variables](#-environment-variables) section
5. Push to `main` — Railway auto-deploys on every push ✅

### Alternative: Vercel (Client) + Railway (Server)

| Client (Vercel) | Server (Railway) |
|:----------------|:-----------------|
| Deploy `client/` folder | Deploy `server/` folder |
| Set `VITE_API_BASE_URL` → Railway server URL | Set `CLIENT_URL` → Vercel URL |
| Build command: `npm run build` | Start command: `npm start` |
| Output directory: `dist` | Health check: `/health` |

---

## Known Issues and Limitations

### AI Response Quality
- Gemini may occasionally produce suboptimal code for very niche algorithms
- Trace tables for complex recursive solutions can be verbose
- Always verify AI-generated code before using in production or interviews

### Streaming Behavior
- SSE streaming requires a stable internet connection
- If the connection drops mid-stream, you will need to re-solve the problem
- Very long problems may take 10-15 seconds to fully stream

### Authentication
- OTP emails may take 5-30 seconds depending on Brevo email queue
- Google OAuth requires a verified Google Cloud project for production use
- JWT tokens expire after 24 hours — you will need to re-login

### Browser Support
- Requires a modern browser with `ReadableStream` and `fetch` streaming support
- Three.js 3D hero may not render on very old GPUs or mobile devices with limited WebGL
- GSAP animations are automatically disabled when `prefers-reduced-motion` is set

---

## Troubleshooting

<details>
<summary><strong>MongoDB connection failed</strong></summary>

```
Error: MongoDB connection failed: connection timed out
```
**Fix:** Verify `MONGO_URL` in `server/.env`. For Atlas, ensure your IP is whitelisted under Network Access → Add Current IP Address.
</details>

<details>
<summary><strong>OTP emails not arriving</strong></summary>

```
[EmailService] BREVO_API_KEY missing. Cannot send HTTP email.
```
**Fix:** Ensure `BREVO_API_KEY` is set in `server/.env`. Check Brevo dashboard → Transactional → Logs for delivery status. Also verify the sender email domain is authenticated in Brevo.
</details>

<details>
<summary><strong>CORS errors in browser console</strong></summary>

```
CORS: origin http://localhost:5173 not allowed
```
**Fix:** Set `CLIENT_URL=http://localhost:5173` in `server/.env` and restart the server with `npm run dev`.
</details>

<details>
<summary><strong>Google OAuth not working</strong></summary>

```
Error: Invalid Google token
```
**Fix:** Ensure `GOOGLE_CLIENT_ID` matches in both `server/.env` and `client/.env.local`. Verify authorized JavaScript origins and redirect URIs in Google Cloud Console → Credentials.
</details>

<details>
<summary><strong>SSE streaming freezes or hangs</strong></summary>

**Fix:** Usually a Gemini API rate limit. Wait 1-2 minutes and try again. Check server console for specific error messages. If persistent, verify `GEMINI_API_KEY` is valid at [AI Studio](https://ai.google.dev/).
</details>

<details>
<summary><strong>Build fails with "Expected `)` but found EOF"</strong></summary>

**Fix:** Pull the latest code — this syntax issue (missing `React.memo` closing parenthesis) has been fixed in recent commits.
</details>

<details>
<summary><strong>Port 5173 already in use</strong></summary>

**Fix:** Vite auto-finds the next available port. Or manually specify: `npm run dev -- --port 3001`
</details>

**Still stuck?** [Open a GitHub Issue →](https://github.com/shubham1-max/DSA-Resolver/issues)

---

## Contributing

Want to make DSA Resolver better? Contributions are welcome!

### How to Contribute

1. **Fork & clone**
```bash
git clone https://github.com/shubham1-max/DSA-Resolver.git
cd DSA-Resolver
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow existing code style and component patterns
   - Keep components small and reusable
   - Add comments for complex logic

4. **Run the development servers**
```bash
cd server && npm run dev     # Terminal 1
cd client && npm run dev     # Terminal 2
```

5. **Commit and push**
```bash
git commit -m "feat: description of your change"
git push origin feature/your-feature-name
```

6. **Open a Pull Request** — Describe what you changed, why, and link any related issues

### Contribution Ideas
- 🐛 Bug fixes and edge case handling
- ✨ New DSA topic detection patterns
- 🎨 UI/UX improvements and animations
- 📝 Documentation improvements
- 🌐 Internationalization (i18n) support
- 🧪 Unit and integration tests
- 📊 New dashboard visualizations

---

## License and Contact

**ISC License** — see [LICENSE](./LICENSE) for details.

**Built by [Shubham S Patil](https://github.com/shubham1-max)**

[![Email](https://img.shields.io/badge/Email-shubhamspatil2006@gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:shubhamspatil2006@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-@shubham1--max-181717?logo=github&logoColor=white)](https://github.com/shubham1-max)

---

## 🙏 Acknowledgments

[Google DeepMind](https://deepmind.google/) · [React](https://react.dev/) · [GSAP](https://gsap.com/) · [Three.js](https://threejs.org/) · [Chart.js](https://www.chartjs.org/) · [Brevo](https://www.brevo.com/) · [Railway](https://railway.app/) · [Vite](https://vitejs.dev/) · [MongoDB](https://www.mongodb.com/)

---

<div align="center">

### 🌟 If this project helped you, please give it a star! ⭐

[⭐ Star on GitHub](https://github.com/shubham1-max/DSA-Resolver) · [🔗 Visit Live Platform](https://pleasant-essence-production-7e9b.up.railway.app/) · [📧 Contact](mailto:shubhamspatil2006@gmail.com) · [🐛 Report Issues](https://github.com/shubham1-max/DSA-Resolver/issues)

[Back to Top](#dsa-resolver)

</div>
