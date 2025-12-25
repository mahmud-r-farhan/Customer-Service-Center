# Architecture Overview

This document explains the architecture of Customer Service Center (CSC) v2 — a real-time customer queue and consultation system.

- Backend: Node.js + Express + MongoDB (Mongoose)
  - REST API serves authentication and client management endpoints.
  - JWT tokens are issued and delivered via secure HttpOnly cookies for improved security.
  - Input validation using `express-validator` and rate limiting with `express-rate-limit` protect endpoints.
  - WebSockets via `ws` provide real-time broadcasts for queue and consultation updates.
  - Mongoose schemas include indexes for frequently queried fields (email, token, status + createdAt).

- Frontend: React (Vite) + Redux Toolkit + Tailwind + Framer Motion
  - Auth uses cookie-based sessions: frontend uses `axios` with `withCredentials: true`.
  - Real-time updates subscribe to WebSocket events and update Redux state.
  - UI components adopt accessible patterns and responsive layouts.

- Deployment & Containers
  - Backend and frontend each support Docker builds; `docker-compose.yml` orchestrates services.
  - Environment variables are used to configure secrets and origin URLs.

Security changes in this release
- Removed storing passwords or tokens in `localStorage`.
- Authentication now uses server-signed JWTs stored in HttpOnly cookies.
- Input validation and rate limiting added to prevent abuse and injection.
- DB indexes added for performance on common queries.

Multi-agent and concurrency notes
- Client documents include `status` and `agent` fields to support multiple agents.
- Future improvements: optimistic locking, reservation TTLs for assigned consultations, agent availability service.

For developers: recommended next steps
- Configure `JWT_SECRET` and `MONGODB_URI` in your `.env`.
- Run `npm install` in the root to get new backend dependencies.
- Start backend, then `cd frontend && npm install && npm run dev`.

This architecture intentionally separates session (cookie) from application data to improve security while keeping the API RESTful and WebSocket-driven for live updates.