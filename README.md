# Jamiul Azhar Jumma Masjidh — Web Application

A modern, production-ready web application for **Jamiul Azhar Jumma Masjidh**, with a public website and a protected admin panel. Built with React (Vite), Tailwind CSS, Framer Motion, and an Express backend using **file-based JSON storage** (no database).

## Features

- **Public website**: Masjid info, projects, events, announcements, gallery, about, contact, donation progress, Imam message
- **Admin panel**: Token-based login; full CRUD for projects, events, and announcements; image and video uploads to `/public/uploads`
- **Design**: Glassmorphism (liquid glass) theme, emerald/teal/cyan gradient, dark mode, responsive layout, Framer Motion transitions
- **Architecture**: Modular, scalable, Tauri-ready structure

## Tech Stack

| Layer      | Stack |
|-----------|--------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React |
| Backend   | Node.js, Express |
| Storage   | JSON files in `server/data/` (no MySQL/MongoDB) |
| Uploads   | Multer; files stored in `client/public/uploads` |

## Project Structure

```
masjid-app/
├── client/                 # React (Vite) frontend
│   ├── public/
│   │   └── uploads/         # Uploaded images (created by server)
│   └── src/
│       ├── admin/           # Admin pages (login, dashboard, CRUD)
│       ├── components/      # Reusable UI (Navbar, Footer, GlassCard, Toast, etc.)
│       ├── hooks/           # useAuth, useApi
│       ├── layouts/         # PublicLayout, AdminLayout
│       ├── pages/           # Public pages (Home, Projects, Events, etc.)
│       ├── services/        # api.js (fetch + auth headers)
│       ├── App.jsx
│       └── index.css
├── server/
│   ├── data/                # JSON data files
│   │   ├── projects.json
│   │   ├── events.json
│   │   └── announcements.json
│   ├── routes/              # Express routes (auth, upload, projects, events, announcements)
│   ├── controllers/        # CRUD controllers
│   ├── middleware/          # requireAuth
│   ├── utils/               # jsonStore (read/write JSON)
│   └── server.js
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Install dependencies

From the `masjid-app` folder run **one** of the following (do this once before first `npm run dev`):

```bash
cd masjid-app
npm install
```

This installs root dependencies and runs `install:all` (client + server). Or explicitly:

```bash
npm run install:all
```

Or install client and server separately:

```bash
cd masjid-app/client && npm install
cd ../server && npm install
```

### 2. Environment variables

**Server** (`server/.env`):

```env
PORT=3000
ADMIN_PASSWORD=your_secure_password_here
```

Optional:

- `UPLOADS_PATH` — absolute or relative path to uploads directory (default: `../client/public/uploads`)

Copy from example:

```bash
cp server/.env.example server/.env
# Edit server/.env and set ADMIN_PASSWORD
```

**Client** (optional):

- `VITE_API_URL` — leave empty when using Vite proxy (default: `''`). For production, set to your API base URL.

### 3. Run development

**Option A — Start both at once (recommended):**

From the `masjid-app` folder, install root dependencies once, then run:

```bash
cd masjid-app
npm install
npm run dev
```

This starts the backend and frontend together. Server at `http://localhost:3000`, client at `http://localhost:5173`.

**Option B — Two terminals:**

**Terminal 1 — backend:**

```bash
cd masjid-app/server
npm run dev
```

**Terminal 2 — frontend:**

```bash
cd masjid-app/client
npm run dev
```

Server runs at `http://localhost:3000`. Client runs at `http://localhost:5173`. API and `/uploads` are proxied to the server.

### 4. Admin login

1. Open `http://localhost:5173/admin/login`
2. Enter the password set in `server/.env` as `ADMIN_PASSWORD`
3. After login you can manage Projects, Events, and Announcements from the admin panel

## API Reference

All write operations require `Authorization: Bearer <token>` (token from `/api/auth/login`).

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/api/auth/login`   | No  | Body: `{ "password": "..." }` → `{ "token": "..." }` |
| POST   | `/api/auth/logout`  | No  | Invalidates current token |
| GET    | `/api/projects`     | No  | List projects |
| POST   | `/api/projects`     | Yes | Create project |
| PUT    | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| GET    | `/api/events`       | No  | List events |
| POST   | `/api/events`       | Yes | Create event |
| PUT    | `/api/events/:id`   | Yes | Update event |
| DELETE | `/api/events/:id`   | Yes | Delete event |
| GET    | `/api/announcements`| No  | List announcements |
| POST   | `/api/announcements`| Yes | Create announcement |
| PUT    | `/api/announcements/:id` | Yes | Update announcement |
| DELETE | `/api/announcements/:id` | Yes | Delete announcement |
| GET    | `/api/site`         | No  | Get site settings (e.g. `heroImage`) |
| PUT    | `/api/site`         | Yes | Update site settings (body: `{ "heroImage": "/uploads/..." }`) |
| POST   | `/api/upload`       | Yes | Multipart file upload → `{ "url": "/uploads/..." }` |

## Production Build

**Client:**

```bash
cd client
npm run build
```

If `vite` is not found, run `npm install` again in `client`, or use `npx vite build`.

Static output is in `client/dist`. Serve with any static host and point API requests to your backend (e.g. via `VITE_API_URL` or same-origin proxy).

**Server:**

```bash
cd server
npm start
```

Ensure `ADMIN_PASSWORD` is strong and `UPLOADS_PATH` points to a writable directory that your static server can serve (e.g. copy `client/public/uploads` to your public asset path if needed).

## Images and media (all managed in admin)

- **Hero image**: Set in **Admin → Site images**. Upload a hero image for the homepage; it is stored in `client/public/uploads` and the URL is saved in `server/data/site.json`. If none is set, the hero shows a gradient only.
- **Projects and events**: Add images and videos in **Admin → Projects** and **Admin → Events** (upload or paste YouTube/Vimeo URL). All uploads go to `client/public/uploads` (max 80MB per file).
- **Gallery**: Shows images and videos from projects and events only (no separate uploads).

## Data Storage

- **No database.** All content is stored in:
  - `server/data/projects.json`
  - `server/data/events.json`
  - `server/data/announcements.json`
- Admin token is in-memory; it is lost on server restart (re-login required).
- Images are saved under `client/public/uploads` (or `UPLOADS_PATH`). Refer to them in content as `/uploads/filename.ext`.

## License

Proprietary. All rights reserved.
