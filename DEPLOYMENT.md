# Deployment Guide for Knowledge Workspace

## 🚀 Vercel Deployment Configuration

Your application consists of two parts:
1. **Frontend (React + Vite)** - Deployed on Vercel
2. **Backend (FastAPI)** - Needs to be deployed separately

---

## Step 1: Deploy Your Backend (FastAPI)

Your backend is currently only running locally. You need to deploy it to a cloud service. Here are recommended options:

### Option A: Deploy to Render.com (Recommended - Free Tier Available)

1. Go to [Render.com](https://render.com/) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `knowledge-workspace-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables (if needed):
   - `SECRET_KEY`: (generate a secure random string)
6. Click "Create Web Service"
7. Wait for deployment and copy your backend URL (e.g., `https://knowledge-workspace-backend.onrender.com`)

### Option B: Deploy to Railway.app

1. Go to [Railway.app](https://railway.app/) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Railway will auto-detect Python and install dependencies
6. Copy your backend URL from Railway dashboard

### Option C: Deploy to Python Anywhere or Heroku

Follow their respective Python deployment guides.

---

## Step 2: Update Backend CORS Settings

Once you have your Vercel frontend URL and backend URL, you need to update the CORS settings in your backend.

Edit `backend/main.py` and update the `allow_origins` list:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app",  # Add your Vercel URL here
        "https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app"  # Your current Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push this change to your repository and redeploy your backend.

---

## Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add the following environment variable:

   **Variable Name**: `VITE_API_BASE_URL`
   **Value**: Your backend URL (e.g., `https://knowledge-workspace-backend.onrender.com`)
   **Environment**: Select "Production", "Preview", and "Development"

5. Click "Save"

---

## Step 4: Redeploy Your Frontend

After adding the environment variable:

1. Go to the "Deployments" tab in Vercel
2. Click the three dots (•••) on your latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" and click "Redeploy"

Alternatively, from your terminal:

```bash
cd E:\mycode\knowledge-workspace
vercel --prod
```

---

## Step 5: Verify Deployment

1. Open your Vercel app URL: https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app
2. Try to register a new user
3. Try to login
4. Test creating documents and categories

---

## 🔧 Configuration Files Created

### `vercel.json`
- Enables SPA routing (all routes redirect to index.html)
- Sets required headers for CORS

### `.env` (Local Development)
- `VITE_API_BASE_URL=http://localhost:8000`
- Keeps your local development working

### `.env.example` (Template)
- Template for other developers

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Cause**: Backend is not accessible or CORS not configured

**Solution**:
1. Verify your backend is running: Open `https://your-backend-url.com/docs` in browser
2. Check Vercel environment variable is set correctly
3. Verify backend CORS includes your Vercel URL

### Issue: Login/Register not working

**Cause**: API calls timing out or backend database not initialized

**Solution**:
1. Check backend logs on Render/Railway
2. Ensure backend has write permissions for SQLite database
3. Consider using PostgreSQL for production instead of SQLite

### Issue: Environment variable not working

**Cause**: Vercel needs rebuild after adding env vars

**Solution**:
1. Always redeploy after adding environment variables
2. Clear build cache if needed
3. Check the variable name starts with `VITE_` (required for Vite)

---

## 📝 Important Notes

1. **Database**: Your backend uses SQLite which is file-based. On Render/Railway, the filesystem is ephemeral (resets on redeploy). For production, consider using:
   - PostgreSQL (recommended)
   - MySQL
   - MongoDB

2. **Security**: 
   - Never commit `.env` file to Git (it's already in .gitignore)
   - Use strong SECRET_KEY in production
   - Enable HTTPS only in production

3. **API URL Format**:
   - Must NOT end with a slash
   - Example: `https://api.example.com` ✅
   - Example: `https://api.example.com/` ❌

---

## 🎯 Quick Checklist

- [ ] Backend deployed to Render/Railway/other service
- [ ] Backend CORS updated with Vercel URL
- [ ] `VITE_API_BASE_URL` environment variable added in Vercel
- [ ] Frontend redeployed on Vercel
- [ ] Tested login/register functionality
- [ ] Tested document creation and management

---

## 📞 Need Help?

If you continue to face issues:

1. Check browser console (F12) for specific error messages
2. Check backend logs on your hosting service
3. Verify network requests in browser DevTools → Network tab
4. Ensure both backend and frontend are using HTTPS in production

---

## 🔄 Alternative: Quick Test with Mock Backend

If you want to test Vercel deployment quickly without deploying backend:

1. In Vercel environment variables, set:
   - `VITE_API_BASE_URL=http://localhost:8000`
2. Keep your local backend running
3. This will only work from your local network

**Note**: This is NOT a production solution, only for testing.