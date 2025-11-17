# 🚀 VERCEL CONFIGURATION - QUICK START GUIDE

## ⚠️ CRITICAL: Why Login/Register Doesn't Work

Your frontend is deployed on Vercel successfully ✅  
But your **backend API is NOT deployed** ❌

The app tries to call `http://localhost:8000` which doesn't exist in production!

---

## 🎯 IMMEDIATE STEPS TO FIX

### Step 1: Deploy Your Backend API (5-10 minutes)

**Option A: Using Render.com (Recommended)**

1. Go to https://render.com and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/balajircs83/project-portfolio-usecases`
4. Configure:
   ```
   Name: knowledge-workspace-api
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Click **"Create Web Service"**
6. **COPY THE URL** - You'll get something like: `https://knowledge-workspace-api.onrender.com`

**Option B: Using Railway.app**

1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Add these settings:
   ```
   Root Directory: backend
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **COPY THE URL** from Railway dashboard

---

### Step 2: Configure Environment Variable in Vercel (2 minutes)

1. Go to: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings/environment-variables

2. Add this environment variable:
   ```
   Name:  VITE_API_BASE_URL
   Value: https://your-backend-url.onrender.com
   ```
   (Use the URL you copied from Step 1)

3. Select all environments: **Production**, **Preview**, **Development**

4. Click **"Save"**

---

### Step 3: Update Backend CORS (2 minutes)

Edit `backend/main.py` and update line 23-25:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app",
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push this change to GitHub. Your backend will auto-redeploy.

---

### Step 4: Redeploy Frontend on Vercel (1 minute)

From your terminal:

```bash
cd E:\mycode\knowledge-workspace
vercel --prod
```

OR from Vercel Dashboard:
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment → **"Redeploy"**

---

## ✅ VERIFICATION

After completing all steps:

1. Open your app: https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app
2. Open browser DevTools (F12) → Console tab
3. Click **Register** or **Login**
4. You should see API calls to your deployed backend (not localhost)
5. Registration/Login should work! 🎉

---

## 🔍 HOW TO DEBUG

### Check Backend is Running:
Visit: `https://your-backend-url.onrender.com/docs`  
You should see FastAPI Swagger documentation

### Check Frontend is Calling Correct URL:
1. Open your Vercel app
2. Press F12 → Network tab
3. Try to login
4. Check the request URL - it should be your backend URL, NOT localhost

### Check Environment Variable is Set:
1. Go to Vercel Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` is set correctly
3. If you just added it, you MUST redeploy for it to take effect

---

## 📋 CONFIGURATION FILES ADDED

| File | Purpose |
|------|---------|
| `vercel.json` | Enables SPA routing for React |
| `.env` | Local development settings |
| `.env.example` | Template for environment variables |
| `render.yaml` | Auto-configuration for Render deployment |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `VERCEL_CONFIG.md` | This quick start guide |

---

## 🎓 WHAT WAS CHANGED IN YOUR CODE

Only **ONE file** was modified to enable environment variable support:

**`services/api.ts`** - Line 3:
```typescript
// OLD: const API_BASE_URL = "http://localhost:8000";
// NEW: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```

This allows the app to use:
- **Production**: URL from Vercel environment variable
- **Local Dev**: Falls back to `http://localhost:8000`

Your business logic remains **100% unchanged**. ✅

---

## ⚡ QUICK TEST WITHOUT BACKEND DEPLOYMENT

Want to test locally first?

1. Keep your local backend running (`uvicorn main:app` in backend folder)
2. Install `localtunnel`: `npm install -g localtunnel`
3. Expose your backend: `lt --port 8000`
4. Copy the URL (e.g., `https://random-name.loca.lt`)
5. Set in Vercel env: `VITE_API_BASE_URL=https://random-name.loca.lt`
6. Redeploy Vercel

**Note**: This is temporary for testing only!

---

## 🎯 TLDR - 3 THINGS YOU MUST DO

1. **Deploy backend** to Render/Railway → Get URL
2. **Add `VITE_API_BASE_URL`** environment variable in Vercel with backend URL
3. **Redeploy** frontend on Vercel

That's it! 🚀

---

## 📞 COMMON ERRORS & SOLUTIONS

| Error | Solution |
|-------|----------|
| "Network Error" in browser console | Backend not deployed or URL wrong |
| "CORS error" | Update backend CORS to include Vercel URL |
| Still calling localhost | Forgot to redeploy after adding env var |
| 404 on backend | Backend crashed - check Render/Railway logs |
| Env var not working | Must start with `VITE_` prefix for Vite |

---

## 🎉 AFTER SUCCESSFUL DEPLOYMENT

Your app will work exactly like local:
- ✅ User registration
- ✅ User login
- ✅ Document creation
- ✅ Category management
- ✅ All features working end-to-end

The only difference: Using cloud backend instead of localhost! 🌐