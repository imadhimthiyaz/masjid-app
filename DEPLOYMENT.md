# Deploy to Vercel (100% Free, No Backend)

This app deploys as a **fully static site** on Vercel. No backend, database, or external services.

## How it works

- **Public pages** (Home, Projects, Events, etc.) read from static JSON files in `client/public/data/`
- **Admin panel** is read-only in this mode – you cannot add/edit content from the UI
- To update content: edit the JSON files in `client/public/data/` and push to trigger a new deploy

## Deploy steps

### 1. Push to GitHub

Ensure your code is in a GitHub repository.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Import** your repository
3. Confirm settings:
   - **Root Directory:** `masjid-app`
   - **Build Command:** `npm run build:client`
   - **Output Directory:** `client/dist`
4. **Do not** add `VITE_API_URL` – leave it empty for static mode
5. Click **Deploy**

### 3. Update content

Edit these files in your repo and push:

| File | Content |
|------|---------|
| `client/public/data/projects.json` | Projects |
| `client/public/data/events.json` | Events |
| `client/public/data/announcements.json` | Announcements |
| `client/public/data/site.json` | Site name, hero, About, Contact, etc. |

For images: add files to `client/public/uploads/` and reference them as `/uploads/filename.jpg` in the JSON.

## Local development with backend

To run with the full backend (admin, uploads, live edits):

```bash
npm run dev
```

Then set `VITE_API_URL=http://localhost:3000` in `.env` if needed (the Vite proxy handles it by default).
