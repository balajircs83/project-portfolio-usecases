# ✅ VERCEL DEPLOYMENT - READY TO DEPLOY

## What's Done

Your existing backend code has been configured for Vercel deployment with **minimal changes**:

### Changes Made:
1. **`backend/database.py`** - Added Postgres support (still uses SQLite locally)
2. **`backend/main.py`** - Added Vercel CORS configuration
3. **`backend/requirements.txt`** - Added `psycopg2-binary` for Postgres
4. **`services/api.ts`** - Auto-detects environment (`/api` on Vercel, `localhost:8000` locally)
5. **`vercel.json`** - Routes `/api/*` to your existing backend

**Your backend business logic is untouched!** Same database, same code.

---

## 🚀 DEPLOY NOW - 3 SIMPLE STEPS

### STEP 1: Create Postgres Database on Vercel (3 minutes)

1. Open: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase

2. Click **"Storage"** tab (top navigation)

3. Click **"Create Database"** → Choose **"Postgres"**

4. Settings:
   - Name: `knowledge-workspace-db`
   - Region: Select closest to you
   - Plan: **Hobby (Free)**

5. Click **"Create"**

✅ Vercel automatically adds `POSTGRES_URL` to your environment variables.

---

### STEP 2: Add SECRET_KEY Environment Variable (2 minutes)

1. Go to: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings/environment-variables

2. Click **"Add New"**

3. Generate a secure key first:
   ```bash
   # Run this in Git Bash or terminal:
   openssl rand -hex 32
   ```
   
   Copy the output (a long random string like: `a8f5f167f44f4964e6c998dee827110c1234567890abcdef...`)

4. Add environment variable:
   ```
   Name:  SECRET_KEY
   Value: [paste the generated key here]
   Environments: ✓ Production  ✓ Preview  ✓ Development
   ```

5. Click **"Save"**

---

### STEP 3: Deploy to Vercel (1 minute)

Open PowerShell/Terminal in your project folder:

```powershell
cd E:\mycode\knowledge-workspace

# Deploy to production
vercel --prod
```

Wait for deployment to complete (1-2 minutes).

✅ **Done!** Your app is live with both frontend and backend on Vercel!

---

## ✅ Test Your Deployment

1. **Open your app:**
   https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app

2. **Check backend API:**
   https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app/api/docs
   
   You should see FastAPI Swagger documentation.

3. **Test the app:**
   - Register a new user
   - Login
   - Create a document
   - Everything should work!

4. **Check browser console (F12):**
   - Network tab should show API calls to `/api/...`
   - No CORS errors
   - No 500 errors

---

## 📊 How It Works

```
User Request → Vercel
   ↓
   ├─ /api/*          → Your backend (FastAPI from backend/main.py)
   │                     Uses Postgres database
   │
   └─ /* (everything) → Your frontend (React SPA)
                         Makes calls to /api endpoints
```

### Same Domain = No CORS Issues!
- Frontend: `your-app.vercel.app`
- Backend: `your-app.vercel.app/api`
- Same origin, no cross-domain problems

---

## 🔧 Local Development Still Works!

Nothing changed for local development:

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd E:\mycode\knowledge-workspace
npm run dev
```

- Local uses SQLite (database.db file)
- Local frontend calls `http://localhost:8000`
- Everything works as before!

---

## 🐛 Troubleshooting

### Problem: API returns 500 error

**Check Vercel Logs:**
1. Dashboard → Deployments → Click latest deployment
2. "Functions" tab → Look for errors
3. Common issue: Database connection failed

**Solution:** Make sure Postgres database is created and `POSTGRES_URL` exists.

---

### Problem: "SECRET_KEY not set" error

**Solution:**
1. Add `SECRET_KEY` environment variable in Vercel settings
2. Generate with: `openssl rand -hex 32`
3. Redeploy: `vercel --prod`

---

### Problem: Tables not found in database

**This is normal on first deploy!**

**Solution:** Tables are created automatically on first API call.
1. Just visit: `/api/docs`
2. Try to register a user
3. Tables will be created automatically

---

### Problem: Still calling localhost in production

**Solution:**
- Clear browser cache
- Check `.env` file is not deployed (it's in .gitignore)
- The app auto-detects: production uses `/api`, local uses `localhost:8000`

---

## 📋 Environment Variables Summary

Your Vercel project should have these environment variables:

| Variable | Value | Set By |
|----------|-------|--------|
| `POSTGRES_URL` | `postgresql://...` | Auto (Vercel Postgres) |
| `SECRET_KEY` | `[random 32-char hex]` | You (manual) |
| `ALGORITHM` | `HS256` | Optional (has default) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Optional (has default) |

---

## ✅ Deployment Checklist

- [x] Code configured for Vercel
- [x] Changes committed and pushed to GitHub
- [ ] Vercel Postgres database created
- [ ] SECRET_KEY environment variable added
- [ ] Deployed with `vercel --prod`
- [ ] Backend accessible at `/api/docs`
- [ ] Registration works
- [ ] Login works
- [ ] Documents can be created

---

## 🎉 What You Get

After deployment:
- ✅ Full-stack app on single domain
- ✅ No CORS issues
- ✅ Free SSL certificate (HTTPS)
- ✅ Automatic deployments from GitHub
- ✅ Postgres database (persistent data)
- ✅ Fast CDN for frontend
- ✅ Serverless backend (scales automatically)

---

## 💰 Cost

**Vercel Hobby Plan: FREE**
- 100 GB bandwidth/month
- 100 GB-Hours compute
- Postgres: 256 MB storage (free tier)

Perfect for development and small projects!

---

## 📞 Quick Reference

**Project URL:**
https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app

**API Documentation:**
https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app/api/docs

**Vercel Dashboard:**
https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase

**Settings:**
https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings

**Environment Variables:**
https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings/environment-variables

---

## 🚀 Ready to Deploy?

Follow the 3 steps above and you're done! Your app will be live in ~5 minutes.

**Need help?** Check `VERCEL_SETUP.md` for detailed troubleshooting.