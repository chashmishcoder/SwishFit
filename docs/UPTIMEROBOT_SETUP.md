# ⏱️ UptimeRobot Setup Checklist

Quick 5-minute setup guide for monitoring your SwishFit application.

## 📋 Pre-Setup Information

Have these URLs ready:
- **Backend:** https://swishfit-backend.onrender.com
- **Frontend:** https://swishfit.vercel.app
- **Health Endpoint:** https://swishfit-backend.onrender.com/api/health

---

## 🚀 Setup Steps

### Step 1: Create UptimeRobot Account
- [ ] Go to https://uptimerobot.com
- [ ] Click **"Sign Up Free"**
- [ ] Sign up with email or Google
- [ ] Verify your email address
- [ ] Login to dashboard

### Step 2: Add Backend Monitor
- [ ] Click **"+ Add New Monitor"** button
- [ ] Fill in details:
  ```
  Monitor Type: HTTP(s)
  Friendly Name: SwishFit Backend Health
  URL (or IP): https://swishfit-backend.onrender.com/api/health
  Monitoring Interval: Every 5 minutes
  Monitor Timeout: 30 seconds
  ```
- [ ] Click **"Create Monitor"**

### Step 3: Add Frontend Monitor
- [ ] Click **"+ Add New Monitor"** button again
- [ ] Fill in details:
  ```
  Monitor Type: HTTP(s)
  Friendly Name: SwishFit Frontend
  URL (or IP): https://swishfit.vercel.app
  Monitoring Interval: Every 5 minutes
  Monitor Timeout: 30 seconds
  ```
- [ ] Click **"Create Monitor"**

### Step 4: Configure Alert Contacts
- [ ] Go to **"My Settings"** (top right menu)
- [ ] Click **"Alert Contacts"**
- [ ] Add your email (should be auto-added)
- [ ] (Optional) Add phone number for SMS alerts
- [ ] (Optional) Add Slack webhook
- [ ] Save changes

### Step 5: Customize Alert Settings
- [ ] Go to **"My Settings"** → **"Alert Settings"**
- [ ] Configure:
  ```
  Alert when down for: 2 minutes
  Send alerts every: 60 minutes (until back up)
  Alert when back up: Yes
  ```
- [ ] Save settings

### Step 6: Verify Monitors are Active
- [ ] Go to dashboard
- [ ] Check both monitors show **"Up"** status (green)
- [ ] Wait 5 minutes for first check to complete
- [ ] Verify response times are shown

---

## ✅ Verification

### Test Your Monitors
- [ ] Backend monitor shows **"Up"** with response time
- [ ] Frontend monitor shows **"Up"** with response time
- [ ] Email alert contact is configured
- [ ] Test alert: Click monitor → **"More"** → **"Send Test Alert"**
- [ ] Verify you received test email

---

## 📊 What You'll Monitor

### Backend Health Monitor
**URL:** `https://swishfit-backend.onrender.com/api/health`

**What it checks:**
- ✅ Server is running
- ✅ MongoDB connection is active
- ✅ API responds within 30 seconds
- ✅ Returns 200 OK status

**Response time target:** < 2 seconds (cold start may be 10-30s)

### Frontend Monitor
**URL:** `https://swishfit.vercel.app`

**What it checks:**
- ✅ Frontend is accessible
- ✅ Vercel hosting is up
- ✅ SSL certificate is valid
- ✅ Page loads successfully

**Response time target:** < 1 second

---

## 🔔 Understanding Alerts

### You'll Get Emails When:

1. **Service Goes Down**
   - Email: "SwishFit Backend Health is DOWN"
   - Check Render dashboard for issues
   - May be due to: deployment, cold start, or actual error

2. **Service Comes Back Up**
   - Email: "SwishFit Backend Health is UP"
   - Confirms service recovered

3. **Slow Response Times**
   - If enabled: response time exceeds threshold
   - Action: Check logs for performance issues

### False Positives (Common on Free Tier)

**Render Free Tier Cold Starts:**
- Service sleeps after 15 minutes of inactivity
- First request wakes it up (takes 30-60 seconds)
- **This is NORMAL** - not a real downtime
- To reduce false alerts: Set "Alert when down for: 2 minutes"

---

## 📈 Dashboard Features

### Monitor Dashboard (Free Tier)
- **Uptime percentage:** Last 7, 30, 90 days
- **Response time graph:** See performance trends
- **Downtime history:** List of incidents
- **Custom ratio:** e.g., "99.5% uptime last month"

### Reports
- **Daily uptime:** Check each morning
- **Weekly summary:** Email report (configure in settings)
- **Monthly overview:** Review service reliability

---

## 🎯 Recommended Settings

### For Production Launch

```
Backend Monitor:
- Interval: 5 minutes (free tier)
- Timeout: 30 seconds (account for cold starts)
- Alert when down: 2 minutes (reduce false positives)
- Alert frequency: Every 60 minutes

Frontend Monitor:
- Interval: 5 minutes
- Timeout: 30 seconds
- Alert when down: 1 minute (Vercel shouldn't sleep)
- Alert frequency: Every 60 minutes
```

### After Upgrade to Paid Tier ($7/month Render)

```
Backend Monitor:
- Interval: 1 minute (faster detection)
- Timeout: 15 seconds (no cold starts)
- Alert when down: 1 minute
- Alert frequency: Every 30 minutes
```

---

## 🛠️ Advanced Features (Paid)

### Status Page (Public or Private)
- Share uptime status with users
- Show planned maintenance
- Build trust with transparency

### SMS Alerts
- Get text messages for critical downtime
- Faster response than email

### More Frequent Checks
- 1-minute intervals vs 5-minute
- Detect issues faster

---

## 🎯 Action Items

### Immediate (Today)
- [ ] Sign up for UptimeRobot
- [ ] Add backend health monitor
- [ ] Add frontend monitor
- [ ] Configure email alerts
- [ ] Test alert functionality

### This Week
- [ ] Monitor for 7 days to establish baseline
- [ ] Note average response times
- [ ] Check for any false positive patterns
- [ ] Adjust alert thresholds if needed

### Ongoing
- [ ] Check dashboard daily during first month
- [ ] Review weekly uptime reports
- [ ] Respond to downtime alerts within 1 hour
- [ ] Document incidents and resolutions

---

## 📞 When You Get an Alert

### 1. Verify the Issue
- [ ] Open the monitor URL in browser
- [ ] Check if it's actually down or a cold start

### 2. Check Render Dashboard
- [ ] Go to https://dashboard.render.com
- [ ] Check service status and logs
- [ ] Look for deployment or error messages

### 3. Check MongoDB Atlas
- [ ] Verify database is accessible
- [ ] Check connection limits

### 4. Take Action
- [ ] If cold start: Wait 60 seconds, should recover
- [ ] If real error: Check logs, restart if needed
- [ ] If prolonged: Post update to users

### 5. Document
- [ ] Note time of incident
- [ ] Record root cause
- [ ] Document resolution steps
- [ ] Update monitoring thresholds if needed

---

## ✅ Completion Checklist

Before considering monitoring "complete":

- [ ] UptimeRobot account created and verified
- [ ] Backend health monitor active (showing "Up")
- [ ] Frontend monitor active (showing "Up")
- [ ] Email alerts configured and tested
- [ ] Understand difference between cold start and real downtime
- [ ] Know how to access Render logs
- [ ] Have plan for responding to alerts
- [ ] Monitors have run successfully for 24 hours

---

## 🎉 Success!

Your monitoring is now live! You'll be notified of any issues, and you can track your application's uptime and performance.

**Free Tier Limits:**
- 50 monitors
- 5-minute checks
- Email alerts
- 60-day logs

**This is perfect for SwishFit's initial launch!** 🚀

---

## 📚 Additional Resources

- **UptimeRobot Docs:** https://uptimerobot.com/docs/
- **Render Monitoring:** https://render.com/docs/monitoring
- **Vercel Analytics:** https://vercel.com/docs/analytics

**Questions or issues? Check the full MONITORING.md guide!**
