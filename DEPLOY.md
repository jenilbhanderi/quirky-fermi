# Hylunian Backend — Deployment Guide

## Quick Start (Local)

```bash
# Install dependencies
npm install

# Start the server
npm run dev

# Server runs at http://localhost:3001
# Test it: open http://localhost:3001/api/health in your browser
```

---

## Deploy to Railway (Simplest Option)

Railway gives you a URL like `hylunian-backend.up.railway.app` in ~3 minutes, and supports custom domains.

### Step 1 — Create a Railway Account

Go to [railway.app](https://railway.app) and sign up (free tier gives $5/month credit).

### Step 2 — Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 3 — Push Your Code to GitHub

```bash
cd C:\Users\JENIL\Documents\antigravity\quirky-fermi

git add .
git commit -m "Hylunian backend API"
git remote add origin https://github.com/YOUR_USERNAME/hylunian-backend.git
git push -u origin main
```

### Step 4 — Deploy

```bash
# Login to Railway
railway login

# Create a new project
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=your-super-long-random-secret-change-this
railway variables set ADMIN_INVITE_CODE=your-secret-invite-code
railway variables set CORS_ORIGIN=https://yourdomain.com
railway variables set DB_PATH=/app/data/hylunian.db

# Deploy!
railway up
```

Railway will give you a public URL like `https://hylunian-backend-production.up.railway.app`.

### Step 5 — Add Your Custom Domain

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click your project → **Settings** → **Domains**
3. Click **"Custom Domain"** → type `api.yourdomain.com`
4. Railway will give you a **CNAME record** — add it to your DNS:

   | Type | Name | Value |
   |------|------|-------|
   | CNAME | api | `your-project.up.railway.app` |

5. Wait 5–10 minutes for DNS to propagate. Done!

### Step 6 — Update Your React Frontend

In your React app, point the API client to your domain:

```js
// In your .env or vite config:
VITE_API_URL=https://api.yourdomain.com/api
```

Or hardcode it in `src/api/client.js`:
```js
const API_BASE = 'https://api.yourdomain.com/api';
```

---

## Add SMTP for Real Emails

Once deployed, set the SMTP variables in Railway:

```bash
# Using Gmail App Password:
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-gmail-app-password
railway variables set SMTP_FROM=noreply@yourdomain.com
railway variables set APP_NAME=Hylunian
```

> **How to get a Gmail App Password:**
> 1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Enable 2-Factor Authentication
> 3. Go to "App passwords" → Generate one for "Mail"
> 4. Use that 16-character code as `SMTP_PASS`

---

## Architecture Diagram

```
┌─────────────────────┐         ┌──────────────────────────────┐
│                     │  HTTPS  │                              │
│  React Frontend     │────────▶│  Express Backend             │
│  (Vercel/Netlify)   │  API    │  (Railway)                   │
│                     │  calls  │                              │
│  yourdomain.com     │         │  api.yourdomain.com          │
│                     │         │                              │
└─────────────────────┘         │  ┌────────────────────────┐  │
                                │  │ SQLite (file on disk)  │  │
                                │  │ /app/data/hylunian.db  │  │
                                │  └────────────────────────┘  │
                                │                              │
                                │  ┌────────────────────────┐  │
                                │  │ Nodemailer → SMTP      │──│──▶ Email
                                │  └────────────────────────┘  │
                                └──────────────────────────────┘
```

---

## Summary of URLs

| What | URL |
|------|-----|
| Local backend | `http://localhost:3001` |
| Health check | `http://localhost:3001/api/health` |
| Railway URL | `https://your-project.up.railway.app` |
| Custom domain | `https://api.yourdomain.com` |
