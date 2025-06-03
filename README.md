# Capstone Project Showcase

*A full-stack template for students to **publish, vote, and get feedback** on their capstone projects.*

---

## ✨ Key features

| Area                        | What it does                                                                                      | Why it matters                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **FastAPI backend**         | JWT-secured REST API, Postgres (SQLAlchemy), and file uploads served from `/uploads/*`.           | Keeps your data safe while staying easy to extend.                                 |
| **Authentication**          | `/signup`, `/token`, `/users/me` endpoints with hashed passwords (bcrypt) & 60-min access tokens. | Zero-friction account creation for classmates; no “admin” DB tinkering needed.     |
| **Project hub**             | Create, list, and retrieve projects; attach screenshots, CI badges, videos, and any asset bundle. | Every team’s work lives in one place—ready for demos, grading, or hiring managers. |
| **Teams & roles**           | `User ↔ TeamMember ↔ Team ↔ Project` relationships plus votes & feedback tables.                  | Models common boot-camp workflows such as peer voting or instructor feedback.      |
| **CORS-ready**              | Open origins by default (lock down in prod).                                                      | Works out-of-the-box with any front-end—React, Vue, Svelte, you name it.           |
| **Docker & `.env` support** | One-command spin-up for local dev or Render/\*Heroku deploys.                                     | Stop the “works-on-my-machine” drama.                                              |

---

## 🏗️ Repo layout

```
CapstoneProjectShowcase/
├── backend/            # FastAPI app
│   ├── main.py         # API routes & auth
│   ├── models.py       # SQLAlchemy ORM
│   ├── schemas.py      # Pydantic DTOs
│   ├── database.py     # Session + engine
│   ├── crud.py         # reusable DB helpers
│   └── requirements.txt
├── frontend/           # Vite + React + Tailwind UI
│   └── src/…           # components, hooks, pages
└── README.md           # (this file)
```

---

## ⚡ Quick start (local)

### 1. Clone & configure

```bash
git clone https://github.com/<your-org>/CapstoneProjectShowcase.git
cd CapstoneProjectShowcase
```

Create **`backend/.env`**:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/showcase
SECRET_KEY=please_change_me
```

### 2. Spin up Postgres

```bash
docker run --name showcase-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 3. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend

```bash
cd ../frontend
npm install            # or pnpm / yarn
npm run dev            # default http://localhost:5173
```

> **Tip:** set `VITE_API_URL=http://localhost:8000` in `frontend/.env` for clean cross-origin calls.

---

## 🔑 Auth flow

1. **Signup**
   `POST /signup` → `{name,email,password}`
   returns new `User` record.

2. **Login**
   `POST /token` (OAuth2 form) → `{access_token,token_type}`.

3. **Protected calls**
   Add header `Authorization: Bearer <token>` (valid × 60 min).

---

## 📦 Project endpoints

| Method   | Path             | Body params (multipart)                                                                                                       | Notes                                          |
| -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **POST** | `/projects`      | `title, summary, description, building, tags, difficulty, repo_url, branch, …` + optional `thumbnail`, `assets[]`, `ci_badge` | Auth required; saves files under `/uploads/*`. |
| **GET**  | `/projects`      | –                                                                                                                             | List all projects.                             |
| **GET**  | `/projects/{id}` | –                                                                                                                             | Single project by ID.                          |

> The **frontend** consumes these routes to display a searchable gallery with votes & feedback (components located under `frontend/src/`).

---

## 🗄️ Database schema (simplified)

```mermaid
erDiagram
  USERS ||--o{ VOTES       : has
  USERS ||--o{ TEAM_MEMBERS: part_of
  TEAMS ||--o{ TEAM_MEMBERS: owns
  TEAMS ||--o{ PROJECTS    : presents
  PROJECTS ||--o{ FEEDBACKS: receives
  PROJECTS ||--o{ VOTES    : earns
```

See `backend/models.py` for full field list.

---

## 🧪 Running tests (optional)

```bash
cd backend
pytest
```

*(Write your tests under `backend/tests/`.)*

---

## 🚀 Deploying to Render / Fly.io / etc.

1. Add environment variables (`DATABASE_URL`, `SECRET_KEY`).
2. Point the platform to `uvicorn backend.main:app --port $PORT --host 0.0.0.0`.
3. (Optional) Build the React site and serve static files via an Nginx sidecar or Netlify.

---

## 🙌 Contributing

Found a bug or have an idea? Open an issue or PR:

1. Fork the repo.
2. Create a branch: `git checkout -b feat/amazing-idea`.
3. Commit + push.
4. Open a pull request—describe **why** & **how**.

---

## 📄 License

MIT © 2025 Naveed Maqbool. Feel free to remix, but keep the credits.
