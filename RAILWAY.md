# Deploy Backend to Railway

Railway hosts your Express backend so the admin panel works with live data and uploads.

## Step 1: Push to GitHub

Make sure your code is in a GitHub repository.

## Step 2: Create Railway project

1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Configure the service (see Step 3)

## Step 3: Configure the service

1. Click on the deployed service
2. Go to **Settings** tab
3. Set **Root Directory** to `masjid-app` (the folder with package.json that has the `start` script)
4. **Build Command:** (leave empty – Railpack will run `npm install`)
5. **Start Command:** (leave empty – Railpack will use `npm start` from package.json)
6. **Watch Paths:** (optional) `masjid-app/server/**` to redeploy on server changes

## Step 4: Add environment variables

In **Variables** tab, add:

| Variable        | Value        | Required |
|----------------|--------------|----------|
| `ADMIN_PASSWORD` | Your admin login password | Yes |
| `PORT`         | (Railway sets this automatically) | No |

Do **not** set `UPLOADS_PATH` – the server will use its own `uploads` folder.

## Step 5: Get your API URL

1. Go to **Settings** → **Networking** → **Generate Domain**
2. Railway will give you a URL like `https://your-app-name.up.railway.app`
3. Copy this URL – you'll need it for Vercel

## Step 6: Connect Vercel to the backend

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add: **Name** `VITE_API_URL`, **Value** `https://your-app-name.up.railway.app`
3. Redeploy the Vercel site so it picks up the new variable

## Done

- **Frontend:** Vercel (your-site.vercel.app)
- **Backend:** Railway (your-app.up.railway.app)
- Admin panel now works with live data and uploads

## Important: Railway storage

On Railway’s free tier, the filesystem is **ephemeral** – uploads and data changes are lost when the service restarts or redeploys. For a small site this may be acceptable. For persistent storage, consider upgrading to use Railway Volumes.

## Local development

```bash
npm run dev
```

The client proxies to `localhost:3000`. Set `UPLOADS_PATH=../client/public/uploads` in `server/.env` so uploads appear in the frontend during development.
