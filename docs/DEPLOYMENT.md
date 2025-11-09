# SwishFit Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Testing](#post-deployment-testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] MongoDB Atlas account (free tier)
- [ ] Render.com account (or Railway.app)
- [ ] Vercel.com account (or Netlify.com)
- [ ] GitHub account with repository pushed

### Required Tools
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Git installed
- [ ] Access to your Gemini API key

### Pre-Deployment Checklist
- [ ] All Phase 4 tasks completed
- [ ] Code committed and pushed to GitHub
- [ ] All tests passing locally
- [ ] No console errors in development
- [ ] Environment variables documented

---

## MongoDB Atlas Setup

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and sign up
3. Verify your email address

### Step 2: Create Cluster
1. Click "Build a Database"
2. Select **FREE** tier (M0 Sandbox - 512MB)
3. Choose cloud provider: **AWS**
4. Select region closest to your users (e.g., Mumbai for India)
5. Cluster name: `swishfit-production`
6. Click "Create"
7. Wait 1-3 minutes for cluster creation

### Step 3: Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `swishfit_admin` (or your choice)
5. Password: Click "Autogenerate Secure Password" and SAVE IT
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - ⚠️ This is needed for deployment platforms
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://swishfit_admin:<password>@swishfit-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before the `?`:
   ```
   mongodb+srv://swishfit_admin:yourpassword@swishfit-production.xxxxx.mongodb.net/swishfit?retryWrites=true&w=majority
   ```

### Step 6: Create Indexes
1. Click "Browse Collections"
2. If no collections exist, they'll be created automatically on first use
3. After first use, create indexes via MongoDB Compass or use the verification script:
   ```bash
   cd backend
   node scripts/verifyIndexes.js
   ```

### Step 7: Enable Automated Backups
1. Go to "Backup" tab
2. Automated backups are enabled by default on M0 (cloud provider snapshots)
3. For manual backups, click "Take Snapshot Now"

✅ **MongoDB Atlas Setup Complete!**

---

## Backend Deployment (Render)

### Step 1: Sign Up for Render
1. Go to [Render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click "New +" button → "Web Service"
2. Connect your GitHub repository
3. If not listed, click "Configure account" and grant access
4. Select `swishfit` repository
5. Click "Connect"

### Step 3: Configure Service
Fill in the following:

**Basic Settings:**
- Name: `swishfit-backend`
- Region: Choose closest to you (e.g., Singapore for Asia)
- Branch: `main` (or your default branch)
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**
- Select: `Free` (automatically sleeps after 15 min of inactivity)

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://swishfit_admin:yourpassword@swishfit-production.xxxxx.mongodb.net/swishfit?retryWrites=true&w=majority
JWT_SECRET=[Generate a secure 32+ character string]
JWT_EXPIRE=7d
GEMINI_API_KEY=[Your Gemini API key]
GEMINI_MODEL=gemini-pro
FRONTEND_URL=https://swishfit-frontend.vercel.app
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will start building and deploying
3. Watch the logs in real-time
4. First deployment takes 5-10 minutes
5. Once you see "🚀 Server running on port 5000", it's deployed!

### Step 6: Get Production URL
1. At the top of the page, copy your service URL:
   ```
   https://swishfit-backend.onrender.com
   ```
2. Save this URL - you'll need it for frontend configuration

### Step 7: Test Backend
Open in browser or use curl:
```bash
# Test health endpoint
curl https://swishfit-backend.onrender.com/api/health

# Expected response:
{
  "status": "OK",
  "database": "connected",
  "message": "SwishFit Backend Server is running!"
}
```

✅ **Backend Deployment Complete!**

---

## Frontend Deployment (Vercel)

### Step 1: Sign Up for Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. If not listed, configure GitHub App and grant access
4. Select `swishfit` repository
5. Click "Import"

### Step 3: Configure Project
Fill in the following:

**Framework Preset:**
- Automatically detects: `Vite`

**Root Directory:**
- Click "Edit" and select: `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variables
Click "Environment Variables" section

Add this variable:

```bash
VITE_API_URL=https://swishfit-backend.onrender.com/api
```

⚠️ **Important**: Use your actual backend URL from Render

### Step 5: Deploy
1. Click "Deploy"
2. Vercel will build and deploy
3. First deployment takes 2-5 minutes
4. Watch build logs
5. Once you see "Build Completed", it's deployed!

### Step 6: Get Production URL
1. After deployment, you'll see your production URL:
   ```
   https://swishfit-frontend.vercel.app
   ```
2. Save this URL

### Step 7: Update Backend CORS
1. Go back to Render
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` variable:
   ```bash
   FRONTEND_URL=https://swishfit-frontend.vercel.app
   ```
5. Click "Save Changes"
6. Service will automatically redeploy

### Step 8: Test Frontend
1. Open your Vercel URL in browser
2. You should see the SwishFit login page
3. Try registering a new account
4. Try logging in

✅ **Frontend Deployment Complete!**

---

## Post-Deployment Testing

### Functional Tests

#### 1. Authentication Flow
- [ ] Open frontend URL
- [ ] Click "Register"
- [ ] Fill in registration form
- [ ] Submit and verify success
- [ ] Logout
- [ ] Login with credentials
- [ ] Verify dashboard loads

#### 2. Player Features
- [ ] View Workout Library
- [ ] Click on a workout
- [ ] View workout details
- [ ] Log workout progress
- [ ] View Progress Charts
- [ ] Check Leaderboard
- [ ] Update Profile

#### 3. Coach Features (if applicable)
- [ ] Login as coach
- [ ] View Coach Portal
- [ ] Create new workout
- [ ] Generate AI workout
- [ ] Assign workout to player
- [ ] View player progress
- [ ] Provide feedback

#### 4. Error Handling
- [ ] Try invalid login
- [ ] Try accessing protected route without auth
- [ ] Try submitting invalid form data
- [ ] Check error messages display correctly

### Performance Tests

#### 1. Lighthouse Audit
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance", "Accessibility", "Best Practices", "SEO"
4. Click "Analyze page load"
5. Target scores:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >80

#### 2. Network Performance
1. Open DevTools → Network tab
2. Throttle to "Slow 3G"
3. Reload page
4. Check:
   - [ ] Page loads within 10 seconds
   - [ ] Loading spinners show appropriately
   - [ ] No timeout errors

### Security Tests

#### 1. JWT Expiration
- [ ] Login
- [ ] Wait for JWT to expire (or manually delete token)
- [ ] Try accessing protected route
- [ ] Should redirect to login

#### 2. Rate Limiting
- [ ] Make 10+ rapid API requests
- [ ] Should not get blocked (limit is 1000/15min)
- [ ] Try 11 failed login attempts
- [ ] Should get rate limited after 10 attempts

#### 3. CORS
- [ ] Try accessing API from unauthorized domain
- [ ] Should get CORS error

### Browser Compatibility

Test on:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (Mac/iOS)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

---

## Troubleshooting

### Common Issues

#### Issue: "CORS Error" in browser console

**Solution:**
1. Check `FRONTEND_URL` in Render backend environment variables
2. Ensure it matches your Vercel URL exactly (no trailing slash)
3. Redeploy backend after changing

#### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Check MongoDB Atlas connection string
2. Verify password has no special characters (if so, URL encode them)
3. Check Network Access allows 0.0.0.0/0
4. Verify database user exists and has correct permissions

#### Issue: "JWT Secret Not Found"

**Solution:**
1. Check environment variables in Render
2. Ensure `JWT_SECRET` is set
3. Redeploy service

#### Issue: "Frontend not updating after deployment"

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private window
3. Check Vercel deployment logs for errors
4. Verify environment variables are set

#### Issue: "429 Too Many Requests"

**Solution:**
1. This is the rate limiter working
2. Wait 15 minutes for limit to reset
3. Or adjust rate limits in `backend/src/middleware/rateLimiter.js`

#### Issue: "Render service keeps sleeping (free tier)"

**Note:** This is expected behavior for free tier
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid tier ($7/month) for always-on service

#### Issue: "Build fails on Vercel"

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure `VITE_API_URL` is set in environment variables
4. Try rebuilding locally: `npm run build`

### Getting Help

1. **Check Logs:**
   - Render: Click on service → "Logs" tab
   - Vercel: Click on deployment → "Function Logs"
   - MongoDB Atlas: "Metrics" tab

2. **Documentation:**
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)

3. **Community Support:**
   - Stack Overflow
   - GitHub Discussions
   - Discord/Slack communities

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code committed and pushed to GitHub
- [ ] Tests passing locally
- [ ] Environment variables documented
- [ ] Production config files created

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Indexes will be created automatically

### Backend (Render)
- [ ] Service created
- [ ] Repository connected
- [ ] Build and start commands configured
- [ ] All environment variables added
- [ ] Deployed successfully
- [ ] Health endpoint tested

### Frontend (Vercel)
- [ ] Project imported
- [ ] Root directory set to `frontend`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Deployed successfully
- [ ] Site loads correctly

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend can communicate with backend
- [ ] Authentication works
- [ ] All features tested
- [ ] Performance audit passed
- [ ] URLs documented
- [ ] Monitoring set up (next task)

---

## Production URLs

Once deployed, save these URLs:

```
Frontend: https://swishfit-frontend.vercel.app
Backend:  https://swishfit-backend.onrender.com
API:      https://swishfit-backend.onrender.com/api
Health:   https://swishfit-backend.onrender.com/api/health
```

---

**🎉 Congratulations! Your app is now live in production!**

Next Step: Set up monitoring and logging (Task 8)
