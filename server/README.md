# Portfolio API (Express + MongoDB)

REST backend that powers the Lovable Portfolio frontend.

## Setup

```bash
cd server
cp .env.example .env   # then edit values
npm install
npm run seed           # creates the initial admin user
npm run dev            # http://localhost:4000
```

## Deploy

Works on Render, Railway, Fly.io, Heroku, any Node 18+ host. Set the same
env vars from `.env.example` in the platform's dashboard. Use MongoDB Atlas
for the database.

## Connect the frontend

In the Lovable project, set the build secret `VITE_API_BASE_URL` to your
deployed API URL (e.g. `https://portfolio-api.onrender.com`).

## Endpoints

| Method | Path                       | Auth   |
|--------|----------------------------|--------|
| POST   | /api/auth/login            | public |
| GET    | /api/auth/me               | bearer |
| GET    | /api/experience            | public |
| POST   | /api/experience            | bearer |
| PUT    | /api/experience/:id        | bearer |
| DELETE | /api/experience/:id        | bearer |
| GET    | /api/projects              | public |
| POST/PUT/DELETE /api/projects[/:id] | bearer |
| GET    | /api/skills                | public |
| POST/PUT/DELETE /api/skills[/:id]   | bearer |
| GET    | /api/education             | public |
| POST/PUT/DELETE /api/education[/:id]| bearer |
| GET    | /api/messages              | bearer |
| POST   | /api/messages              | public |
| PUT    | /api/messages/:id          | bearer |
| DELETE | /api/messages/:id          | bearer |
| GET    | /api/settings              | public |
| PUT    | /api/settings              | bearer |
| POST   | /api/settings/visit        | public |
| GET    | /api/settings/visits/stats?days=30 | public |
| GET    | /health                    | public |