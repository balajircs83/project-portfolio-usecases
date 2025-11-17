# 🚀 VERCEL DEPLOYMENT - Simple Setup Guide

## Overview

Your app is now configured to run BOTH frontend and backend on Vercel using your **existing backend code**.

**Changes Made:**
- ✅ Updated `backend/database.py` - Now supports both SQLite (local) and Postgres (Vercel)
- ✅ Updated `backend/main.py` - Added Vercel CORS support
- ✅ Updated `backend/requirements.txt` - Added Postgres driver
- ✅ Updated `services/api.ts` - Auto-detects environment (uses `/api` on Vercel)
- ✅ Updated `vercel.json` - Routes `/api/*` requests to your backend

**Your existing backend code remains intact!** We only added configuration support.

---

## 📋 DEPLOYMENT STEPS

### Step 1: Set Up Postgres Database on Vercel (5 minutes)

Vercel serverless functions need a persistent database (SQLite won't work).

1. Go to your Vercel project: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase

2. Click **"Storage"** tab in the navigation

3. Click **"Create Database"** → Select **"Postgres"**

4. Configure:
   - **Name**: `knowledge-workspace-db`
   - **Region**: Choose closest to you (e.g., US East)
   - **Plan**: Hobby (Free tier is fine for testing)

5. Click **"Create"**

6. **Done!** Vercel automatically adds `POSTGRES_URL` environment variable to your project.

---

### Step 2: Add Environment Variables (2 minutes)

1. Go to: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings/environment-variables

2. Add these variables:

   **SECRET_KEY** (Required for JWT authentication)
   ```
   Name:  SECRET_KEY
   Value: [Generate using: openssl rand -hex 32]
   Environments: Production, Preview, Development (select all)
   ```

   To generate a secure key, run in terminal:
   ```bash
   openssl rand -hex 32
   ```
   Or use any secure random string generator.

   **ALGORITHM** (Optional - has default)
   ```
   Name:  ALGORITHM
   Value: HS256
   Environments: Production, Preview, Development
   ```

   **ACCESS_TOKEN_EXPIRE_MINUTES** (Optional - has default)
   ```
   Name:  ACCESS_TOKEN_EXPIRE_MINUTES
   Value: 30
   Environments: Production, Preview, Development
   ```

---

### Step 3: Deploy to Vercel (1 minute)

From your terminal:

```bash
cd E:\mycode\knowledge-workspace

# Commit the changes
git add .
git commit -m "Configure backend for Vercel deployment"
git push origin main

# Deploy to production
vercel --prod
```

**OR** Vercel will auto-deploy when you push to GitHub (if GitHub integration is enabled).

---

### Step 4: Test Your Deployment (2 minutes)

1. **Test Backend API:**
   ```
   Open: https://your-app.vercel.app/api/docs
   ```
   You should see FastAPI Swagger documentation.

2. **Test Frontend:**
   ```
   Open: https://your-app.vercel.app
   ```

3. **Test Full Flow:**
   - Register a new user
   - Login with the user
   - Create a document
   - Everything should work!

4. **Check Browser Console:**
   - Press F12 → Network tab
   - API calls should go to `/api/...` (same domain, no CORS errors)

---

## 🎯 How It Works

### API Routing
- Frontend requests: `fetch('/api/documents/')` → Routed to backend
- Vercel routes `/api/*` → Your `backend/main.py` FastAPI app
- Other routes → React frontend (SPA)

### Database
- **Local Development**: Uses SQLite (`database.db` file)
- **Vercel Production**: Uses Postgres (from `POSTGRES_URL` env var)
- **Auto-detection**: Checks environment variable, falls back to SQLite

### CORS
- No CORS issues! Frontend and backend on same domain
- All requests are same-origin: `your-app.vercel.app` → `your-app.vercel.app/api`

---

## 🔧 Local Development

Your local setup works exactly as before:

```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend  
cd E:\mycode\knowledge-workspace
npm run dev
```

Frontend automatically uses `http://localhost:8000` in development mode (from `.env` file).

---

## 🐛 Troubleshooting

### Issue: "Internal Server Error" on API calls

**Check Vercel Logs:**
1. Vercel Dashboard → Deployments
2. Click your latest deployment
3. Go to "Functions" tab
4. Look for errors

**Common causes:**
- Database not connected (check `POSTGRES_URL` is set)
- Missing `SECRET_KEY` environment variable
- Database tables not created (happens on first request)

### Issue: API calls still going to localhost

**Solution:**
- Make sure `.env` file is not committed (it's in `.gitignore`)
- In production, the app auto-detects and uses `/api`
- Clear browser cache and try again

### Issue: "Serverless Function has timed out"

**Cause:** Vercel free tier has 10-second timeout

**Solution:**
- Cold start might be slow
- Try the request again (subsequent requests are faster)
- Consider upgrading to Pro plan if needed (60s timeout)

### Issue: Database tables not created

**Solution:**
Tables are created automatically on first API call. Just make a request to any endpoint:
1. Visit: `https://your-app.vercel.app/api/docs`
2. Try the `/register` endpoint
3. Tables will be created automatically

---

## ✅ Deployment Checklist

- [ ] Vercel Postgres database created
- [ ] `SECRET_KEY` environment variable added (use secure random string)
- [ ] Code committed and pushed to GitHub
- [ ] Deployed with `vercel --prod`
- [ ] Backend API accessible at `/api/docs`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Document creation works
- [ ] No errors in Vercel logs

---

## 📊 What's Different from Local

| Feature | Local Development | Vercel Production |
|---------|------------------|-------------------|
| Frontend | `http://localhost:3000` | `https://your-app.vercel.app` |
| Backend | `http://localhost:8000` | `https://your-app.vercel.app/api` |
| Database | SQLite (file) | Postgres (cloud) |
| API URL | Separate domain | Same domain `/api` |
| CORS | Configured | Not needed (same-origin) |

---

## 💰 Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-Hours/month
- **Function Timeout**: 10 seconds
- **Postgres Database**: 256 MB storage (Hobby plan)

This is sufficient for development and low-traffic apps.

---

## 🎉 Success!

Once deployed, your app will work identically to local development:
- ✅ User authentication (register/login)
- ✅ Document management (create, read, update, delete)
- ✅ Category and subcategory management
- ✅ Full-stack functionality on a single domain

**Your production URL:**
https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app

---

## 📞 Need Help?

### View Logs
```bash
vercel logs
```

### Test Locally with Vercel Environment
```bash
vercel dev
```

### Check Environment Variables
```bash
vercel env ls
```

### Generate Secret Key
```bash
# Windows (Git Bash)
openssl rand -hex 32

# PowerShell
-join ((48..57) + (97..102) | Get-Random -Count 32 | % {[char]$_})
```

---

## 🔐 Security Reminder

- ✅ Never commit `.env` file (already in `.gitignore`)
- ✅ Use strong `SECRET_KEY` (minimum 32 random characters)
- ✅ Different `SECRET_KEY` for dev and production
- ✅ Keep Postgres credentials secure
- ✅ Vercel handles HTTPS automatically

---

**You're all set! Deploy and enjoy your full-stack app on Vercel!** 🚀