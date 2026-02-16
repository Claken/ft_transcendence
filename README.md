# 🧘‍♂️ FT_TRANSCENDENCE

A full-stack Pong platform built during the 42 school `ft_transcendence` project, with real-time gameplay, chat, direct messages, social features, and 42 OAuth authentication.

## 👩🏻‍🏫 What we have gained from this project

This project was a practical deep dive into:

- **Real-time architecture** with Socket.IO gateways for game sessions, chat, DM, and social notifications.
- **Full-stack TypeScript** development with a **React** frontend and a **NestJS** backend.
- **Authentication and session management** using 42 OAuth, Passport, and server-side sessions.
- **Relational data modeling** with PostgreSQL + TypeORM entities (users, matches, rooms, messages, friendships, invites, blocks, avatars).
- **Team-oriented product building**: integrating multiple domains (auth, game loop, social, chat UI/UX, persistence) in one coherent application.

## ✨ Main features

- **Pong in real-time** (Socket.IO game gateway, matchmaking/queue, invites, live state updates, endgame handling).
- **42 OAuth login** + guest mode behavior in frontend flows.
- **2FA flow** (setup/validation routes and UI).
- **Public/protected/private chat rooms** with room management and moderation tools.
- **Direct messages (DM)** between users.
- **Social features**: friend requests, friend list management, user search, leaderboard/profile views.
- **Account management**: profile settings, avatar upload, match history.

## 🧱 Tech stack

- **Frontend**: React 18, React Router, Axios, Socket.IO client, TypeScript.
- **Backend**: NestJS 9, TypeORM, PostgreSQL, Passport OAuth2, WebSockets (Socket.IO), class-validator.
- **Infra**: Docker, Docker Compose, Makefile automation.

## 🗂️ Project structure

```text
.
├── frontend/        # React client (pages, components, contexts, styles)
├── backend/         # NestJS API + gateways + TypeORM entities/services
├── docker-compose.yaml
├── Makefile
└── README.md
```

## 📦 Pre-requisites

Choose one of the following ways to run the project.

### Option A — Docker (recommended)

- Docker Engine + Docker Compose
- Make (optional, but convenient)

### Option B — Local Node.js runtime

- Node.js 16+ and npm
- PostgreSQL 15+

## ⚙️ Environment variables

Create a `.env` file at the repository root. The following variables are used by the backend and compose setup:

```env
# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=transcendence

# Backend
BACK_PORT=3001
SESSION_SECRET=change_me

# 42 OAuth
FORTYTWO_APP_AUTHORIZATION_URL=https://api.intra.42.fr/oauth/authorize
FORTYTWO_APP_TOKEN_URL=https://api.intra.42.fr/oauth/token
FORTYTWO_APP_UID=your_uid
FORTYTWO_APP_SECRET=your_secret
FORTYTWO_CALLBACK_URL=http://localhost:3001/auth/42/callback

# pgAdmin (used by dpage/pgadmin4 image)
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

> Notes:
> - The frontend calls the backend at `http://localhost:3001/`.
> - The backend CORS origin is set to `http://localhost:3000`.

## 🚀 Usage

### Run with Docker Compose

From the project root:

```bash
# With Makefile helper
make

# Or directly
docker-compose up --build -d
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- pgAdmin: http://localhost:5000
- PostgreSQL: localhost:5432

Stop and clean containers/volumes:

```bash
make clean
```

Deep clean (also removes images):

```bash
make fclean
```

### Run locally (without Docker)

1. Start PostgreSQL and create a database matching your `.env` values.
2. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Run backend (from `backend/`):

```bash
npm run start:dev
```

4. Run frontend (from `frontend/`):

```bash
npm start
```

## 🧪 Useful development commands

### Backend (`backend/`)

```bash
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run lint
```

### Frontend (`frontend/`)

```bash
npm start
npm run build
npm test
```

## 🔐 Authentication flow summary

- User starts login from frontend.
- Backend route `/auth/42/login` redirects to 42 OAuth.
- Callback `/auth/42/callback` authenticates/creates user and redirects to `/auth/42/verify2fa`.
- If 2FA is enabled, user is redirected to frontend `/twofa-validation`, otherwise to `/`.

## 🧭 Notes

- TypeORM is configured with `synchronize: true` for development convenience.
- The codebase uses multiple Socket.IO gateways for domain-specific real-time features (game, chat, DM, friend requests, block user).
- Root `backend/README.md` and `frontend/README.md` are still default framework templates; this README is the project-level source of truth.
