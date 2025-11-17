# 🚀 VERCEL MONOREPO DEPLOYMENT GUIDE

## ✅ Complete Setup - Frontend + Backend on Vercel

This guide will help you deploy both your React frontend and FastAPI backend on Vercel as a single project.

---

## 📋 What's Been Set Up

### Backend API (`/api` folder)
- ✅ FastAPI application adapted for Vercel serverless
- ✅ All endpoints (auth, documents, categories, subcategories)
- ✅ Postgres support for production database
- ✅ SQLite fallback for local development

### Frontend (root folder)
- ✅ Automatic API routing to `/api` endpoint
- ✅ Works with both local backend and Vercel deployment
- ✅ No code changes needed to switch environments

### Configuration
- ✅ `vercel.json` - Routes frontend and backend properly
- ✅ `api/index.py` - Main API handler for Vercel
- ✅ `api/requirements.txt` - Python dependencies

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Set Up Vercel Postgres Database (5 minutes)

Since Vercel serverless functions don't support SQLite (ephemeral filesystem), you need a persistent database.

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard:
   ```
   https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase
   ```

2. Click on **"Storage"** tab in the top navigation

3. Click **"Create Database"** → Select **"Postgres"**

4. Choose:
   - **Database Name**: `knowledge-workspace-db`
   - **Region**: Choose closest to your users
   - **Plan**: Hobby (Free) or Pro

5. Click **"Create"**

6. Vercel will automatically add these environment variables to your project:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - etc.

7. **Done!** Your backend will automatically use this database.

#### Option B: External Postgres (Alternative)

If you prefer external database:

1. Create a Postgres database on:
   - **Neon.tech** (Free tier, recommended)
   - **Supabase** (Free tier)
   - **ElephantSQL** (Free tier)
   - **Railway** (Free tier)

2. Get your connection string (format: `postgresql://user:password@host:port/database`)

3. Add to Vercel environment variables (see Step 2)

---

### Step 2: Configure Environment Variables (2 minutes)

1. Go to: https://vercel.com/balajis-projects-847eab8f/project-porfolio-usecase/settings/environment-variables

2. Add the following variables:

   **If using external Postgres (Option B above):**
   ```
   Name:  POSTGRES_URL
   Value: postgresql://user:password@host:port/database
   Environments: Production, Preview, Development
   ```

   **For JWT Authentication (Required):**
   ```
   Name:  SECRET_KEY
   Value: [Generate a secure random string - use: openssl rand -hex 32]
   Environments: Production, Preview, Development
   ```

   ```
   Name:  ALGORITHM
   Value: HS256
   Environments: Production, Preview, Development
   ```

   ```
   Name:  ACCESS_TOKEN_EXPIRE_MINUTES
   Value: 30
   Environments: Production, Preview, Development
   ```

3. **Optional - Frontend URL (for CORS):**
   ```
   Name:  FRONTEND_URL
   Value: https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app
   Environments: Production, Preview, Development
   ```

---

### Step 3: Deploy to Vercel (1 minute)

From your terminal:

```bash
cd E:\mycode\knowledge-workspace

# Make sure all files are committed
git add .
git commit -m "Configure Vercel monorepo deployment"
git push origin main

# Deploy to Vercel
vercel --prod
```

**OR** Vercel will auto-deploy when you push to GitHub (if connected).

---

### Step 4: Verify Deployment (2 minutes)

1. **Check Backend API:**
   Visit: `https://your-app.vercel.app/api`
   
   You should see:
   ```json
   {"status": "ok", "message": "Knowledge Workspace API"}
   ```

2. **Check API Documentation:**
   Visit: `https://your-app.vercel.app/api/docs`
   
   You should see FastAPI Swagger UI

3. **Test Frontend:**
   - Open: `https://your-app.vercel.app`
   - Try to register a new user
   - Try to login
   - Create a document

4. **Check Browser Console:**
   - Press F12 → Network tab
   - API calls should go to `/api/...` (same domain)
   - No CORS errors should appear

---

## 🔧 Local Development

Your local development still works exactly as before!

### Option 1: Use Local Backend (Current Setup)

```bash
# Terminal 1: Start backend
cd E:\mycode\knowledge-workspace\backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend
cd E:\mycode\knowledge-workspace
npm run dev
```

Frontend will use `http://localhost:8000` (from .env file)

### Option 2: Use Vercel Dev (Test Full Stack Locally)

```bash
cd E:\mycode\knowledge-workspace
vercel dev
```

This runs both frontend and backend locally, simulating Vercel environment.

---

## 🎯 Project Structure

```
knowledge-workspace/
├── api/                      # Backend (Vercel Serverless)
│   ├── index.py             # Main FastAPI app
│   ├── auth.py              # Authentication logic
│   ├── database.py          # Database connection
│   ├── models.py            # SQLModel models
│   └── requirements.txt     # Python dependencies
├── backend/                 # Original backend (for local dev)
│   └── ...                  # (kept for reference)
├── components/              # React components
├── pages/                   # React pages
├── services/
│   └── api.ts              # Frontend API client
├── vercel.json             # Vercel configuration
├── package.json            # Node dependencies
└── vite.config.ts          # Vite configuration
```

---

## 🔍 How It Works

### API Routing

1. **Frontend requests** go to same domain: `/api/endpoint`
2. **Vercel routes** `/api/*` to Python serverless function
3. **Other routes** go to React frontend (SPA)

### Database

- **Local**: SQLite (file-based, easy development)
- **Vercel**: Postgres (persistent, production-ready)
- **Auto-detection**: Checks `POSTGRES_URL` environment variable

### CORS

- No CORS issues! Frontend and backend are on the same domain
- All requests are same-origin

---

## 🐛 Troubleshooting

### Issue: "Internal Server Error" on `/api` endpoints

**Cause**: Database not configured or connection failed

**Solution**:
1. Check Vercel logs: Dashboard → Deployments → Click deployment → "Functions" tab
2. Verify `POSTGRES_URL` is set correctly
3. Check database is accessible from internet

### Issue: API calls still going to `localhost:8000`

**Cause**: `.env` file overriding production setting

**Solution**:
1. Remove or comment out `VITE_API_BASE_URL` in production
2. The app auto-detects: Production uses `/api`, Development uses `localhost:8000`

### Issue: "Serverless Function has timed out"

**Cause**: Cold start or slow database query

**Solution**:
1. Vercel free tier has 10s timeout
2. Optimize database queries
3. Consider upgrading to Pro plan (60s timeout)

### Issue: Database tables not created

**Solution**:
1. Tables are auto-created on first API call
2. Make a request to `/api` endpoint to trigger creation
3. Check Vercel logs for errors

### Issue: Authentication not working

**Cause**: `SECRET_KEY` not set or wrong

**Solution**:
1. Go to Environment Variables
2. Add `SECRET_KEY` with a secure random string
3. Redeploy: `vercel --prod`

---

## 📊 Vercel Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Function Execution | 100 GB-Hours |
| Serverless Function Duration | 10 seconds |
| Deployments | Unlimited |
| Postgres Database | 256 MB (Free tier) |

**For production**: Consider upgrading to Pro plan

---

## 🚀 Advanced Configuration

### Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

### Environment-Specific Settings

```javascript
// In your code
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### Database Migrations

For schema changes:

1. Update `api/models.py`
2. Use Alembic for migrations (recommended for production)
3. Or manually run SQL commands in Vercel Postgres dashboard

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Postgres database created (Vercel Storage or external)
- [ ] `POSTGRES_URL` environment variable set
- [ ] `SECRET_KEY` environment variable set (secure random string)
- [ ] All files committed to Git
- [ ] Pushed to GitHub/main branch
- [ ] Deployed via `vercel --prod`
- [ ] Tested `/api` health check endpoint
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested document CRUD operations
- [ ] Checked Vercel logs for errors

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Frontend loads at your Vercel URL  
✅ `/api` endpoint returns `{"status": "ok"}`  
✅ `/api/docs` shows Swagger documentation  
✅ User registration works  
✅ User login works  
✅ Documents can be created and managed  
✅ No CORS errors in browser console  
✅ No errors in Vercel logs  

---

## 📞 Getting Help

### Check Logs

Vercel Dashboard → Deployments → [Your Deployment] → "Functions" tab

### Useful Commands

```bash
# Deploy to production
vercel --prod

# Test locally with Vercel environment
vercel dev

# View deployment logs
vercel logs

# Check build logs
vercel inspect [deployment-url]
```

### Common Commands

```bash
# Generate secure secret key
openssl rand -hex 32

# Test API locally
curl http://localhost:3000/api

# Test API on Vercel
curl https://your-app.vercel.app/api
```

---

## 🎓 What Changed from Previous Setup

### Before (Separate Deployments)
- Frontend on Vercel
- Backend on Render/Railway/separate service
- CORS configuration needed
- Two URLs to manage
- Separate deployment processes

### After (Monorepo on Vercel)
- ✅ Frontend + Backend on Vercel
- ✅ No CORS issues (same domain)
- ✅ Single URL
- ✅ Single deployment
- ✅ Simplified configuration

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** (already in .gitignore)
2. **Use strong SECRET_KEY** (minimum 32 characters, random)
3. **Use Vercel environment variables** for secrets
4. **Enable HTTPS only** (Vercel does this by default)
5. **Rotate SECRET_KEY** regularly in production
6. **Use different SECRET_KEY** for development and production

---

## 💰 Cost Estimation

### Free Tier (Hobby Plan)
- Good for: Personal projects, prototypes, low traffic
- Limits: 100 GB bandwidth, 100 GB-Hours compute

### Pro Plan ($20/month)
- Good for: Production apps, higher traffic
- Benefits: 1 TB bandwidth, longer function timeout (60s)

### Database
- Vercel Postgres Free: 256 MB storage
- Vercel Postgres Pro: 10 GB storage ($10/month)

---

## 🎯 Next Steps

1. Deploy following the steps above
2. Test all functionality
3. Set up monitoring (Vercel Analytics)
4. Configure custom domain (optional)
5. Set up CI/CD with GitHub integration
6. Add database backups strategy

---

**🎉 Congratulations! Your full-stack app is now running entirely on Vercel!**

Your app URL: https://project-porfolio-usecase-km7uaz95j-balajis-projects-847eab8f.vercel.app