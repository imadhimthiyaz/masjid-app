# Deployment

## Option A: Vercel + Railway (recommended – admin works)

- **Frontend** on Vercel
- **Backend** on Railway (admin panel, uploads, live data)

See **[RAILWAY.md](./RAILWAY.md)** for step‑by‑step instructions.

---

## Option B: Vercel only (static, no backend)

- **Public pages** read from static JSON in `client/public/data/`
- **Admin panel** is read-only – edit JSON and redeploy to change content

### Deploy steps

1. Push to GitHub
2. [vercel.com](https://vercel.com) → Import repo
3. Root: `masjid-app`, Build: `npm run build:client`, Output: `client/dist`
4. **Do not** add `VITE_API_URL`
5. Deploy

### Update content

Edit `client/public/data/*.json` and push. Add images to `client/public/uploads/`.

---

## Local development

```bash
npm run dev
```

Runs frontend and backend. Vite proxy handles API calls.
