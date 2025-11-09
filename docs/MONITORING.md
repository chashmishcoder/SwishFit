# 🔍 Monitoring & Logging Guide

## Overview

SwishFit uses a comprehensive monitoring and logging system to track application health, performance, and errors in production.

## 📊 Logging System (Winston)

### Log Levels

- **error**: Error messages and exceptions
- **warn**: Warning messages (slow queries, deprecated features)
- **info**: General informational messages (requests, auth events)
- **debug**: Detailed debugging information (development only)

### Log Files (Production)

Located in `backend/logs/`:

| File | Purpose | Retention | Max Size |
|------|---------|-----------|----------|
| `error.log` | Errors only | 14 days | 20MB |
| `combined.log` | All log levels | 14 days | 20MB |
| `access.log` | HTTP requests | 7 days | 20MB |

### Log Format

```json
{
  "timestamp": "2025-11-10 12:00:00",
  "level": "info",
  "message": "HTTP Request",
  "method": "POST",
  "url": "/api/auth/login",
  "status": 200,
  "responseTime": "145ms",
  "ip": "192.168.1.1",
  "userId": "507f1f77bcf86cd799439011"
}
```

## 🎯 What Gets Logged

### 1. HTTP Requests
- Method, URL, status code
- Response time
- User IP and User Agent
- Authenticated user ID

### 2. Authentication Events
- Login attempts (success/failure)
- Registration
- Password changes
- Token generation/validation

### 3. Database Operations
- Query execution time
- Operation type (find, insert, update, delete)
- Slow query warnings (>500ms)

### 4. External API Calls
- Gemini AI requests
- Duration and success status

### 5. Errors
- Application errors with stack traces
- Request context (method, URL, user)
- Uncaught exceptions
- Unhandled promise rejections

### 6. Performance Monitoring
- Slow requests (>1 second)
- Very slow requests (>5 seconds)
- Memory usage
- Database connection health

## 🚀 Using the Logger

### Basic Logging

```javascript
const logger = require('./utils/logger');

logger.info('User registered', { userId: user._id, email: user.email });
logger.warn('Slow query detected', { query: 'findUsers', duration: '550ms' });
logger.error('Authentication failed', { error: err.message });
```

### Request Logging

```javascript
// Automatically logged by middleware
// Logs: method, URL, status, response time, user
```

### Error Logging

```javascript
logger.logError(error, req);
```

### Authentication Logging

```javascript
logger.logAuthentication(userId, 'login', true, { ip: req.ip });
```

### Database Operation Logging

```javascript
const startTime = Date.now();
const users = await User.find({ role: 'player' });
logger.logDatabaseOperation('User.find', Date.now() - startTime);
```

### API Call Logging

```javascript
const startTime = Date.now();
const response = await geminiService.generateWorkout(data);
logger.logAPICall('Gemini AI', '/generateWorkout', Date.now() - startTime, true);
```

## 📈 UptimeRobot Setup (Free Monitoring)

### Step 1: Create Account

1. Go to: https://uptimerobot.com
2. Click **"Sign Up Free"**
3. Verify your email

### Step 2: Add Backend Monitor

1. Click **"+ Add New Monitor"**
2. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** SwishFit Backend
   - **URL:** `https://swishfit-backend.onrender.com/api/health`
   - **Monitoring Interval:** 5 minutes (free tier)
   - **Alert Contacts:** Your email
3. Click **"Create Monitor"**

### Step 3: Add Frontend Monitor

1. Click **"+ Add New Monitor"**
2. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** SwishFit Frontend
   - **URL:** `https://swishfit.vercel.app`
   - **Monitoring Interval:** 5 minutes
   - **Alert Contacts:** Your email
3. Click **"Create Monitor"**

### Step 4: Configure Alerts

1. Go to **"My Settings"** → **"Alert Contacts"**
2. Add email, SMS, or Slack webhook
3. Set alert thresholds:
   - Alert when down for: 2 minutes
   - Alert when back up

### What UptimeRobot Monitors

- **Uptime percentage** (99.9% target)
- **Response time** (track performance trends)
- **Downtime incidents** (with timestamps)
- **SSL certificate expiry**

### Alert Types

- **Email alerts:** Instant notifications on downtime
- **Status page:** Public or private status page
- **Monthly reports:** Uptime summary

## 🔔 Render Dashboard Monitoring

### Access Logs

1. Go to: https://dashboard.render.com
2. Select **swishfit-backend** service
3. Click **"Logs"** tab
4. View real-time logs and errors

### Metrics Dashboard

1. In service dashboard, view:
   - **CPU usage**
   - **Memory usage**
   - **Bandwidth**
   - **Request count**
2. Set up alerts for high resource usage

### Event History

- Deploy events
- Service starts/stops
- Configuration changes
- Error spikes

## 📊 Vercel Analytics (Optional)

### Enable Analytics

1. Go to: https://vercel.com/dashboard
2. Select **swishfit** project
3. Click **"Analytics"** tab
4. Enable **"Web Analytics"** (free)

### Metrics Tracked

- **Page views**
- **Unique visitors**
- **Page load time**
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)

## 🛡️ Error Tracking (Optional - Sentry)

### Setup Sentry (Optional)

1. Sign up: https://sentry.io
2. Create new project: **Node.js** (backend) and **React** (frontend)
3. Install Sentry:

```bash
# Backend
cd backend
npm install @sentry/node

# Frontend
cd frontend
npm install @sentry/react
```

4. Add to `.env`:

```bash
SENTRY_DSN=your_sentry_dsn_here
```

5. Initialize in `server.js`:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🎯 Monitoring Checklist

### Daily Checks
- [ ] Check UptimeRobot for downtime incidents
- [ ] Review error.log for new errors
- [ ] Monitor response times in Render dashboard

### Weekly Checks
- [ ] Review combined.log for patterns
- [ ] Check memory and CPU usage trends
- [ ] Verify database performance (slow queries)
- [ ] Review authentication failures

### Monthly Checks
- [ ] Generate uptime report from UptimeRobot
- [ ] Review and rotate log files if needed
- [ ] Update monitoring thresholds based on trends
- [ ] Audit error rates and resolution times

## 📝 Troubleshooting Logs

### View Logs Locally (If Downloaded)

```bash
# Error logs only
tail -f backend/logs/error.log

# All logs
tail -f backend/logs/combined.log

# Last 100 lines
tail -n 100 backend/logs/combined.log

# Search for specific error
grep "MongoDB" backend/logs/error.log
```

### View Logs on Render

```bash
# Use Render CLI (optional)
render logs swishfit-backend

# Or via dashboard:
# https://dashboard.render.com → swishfit-backend → Logs
```

### Common Log Patterns to Watch

1. **Repeated Authentication Failures**
   - May indicate brute force attack
   - Action: Review IP addresses, consider temporary ban

2. **Slow Database Queries**
   - May indicate missing indexes
   - Action: Review query patterns, add indexes

3. **Memory Usage Growth**
   - May indicate memory leak
   - Action: Review code for unclosed connections

4. **High Error Rate**
   - May indicate bug or service outage
   - Action: Investigate error messages, check dependencies

## 🎨 Log Analysis Tips

### Find Most Common Errors

```bash
grep "error" combined.log | sort | uniq -c | sort -nr | head -10
```

### Find Slowest Endpoints

```bash
grep "responseTime" combined.log | sort -t'"' -k4 -nr | head -10
```

### Count Requests by Endpoint

```bash
grep "HTTP Request" combined.log | grep -o '"url":"[^"]*"' | sort | uniq -c | sort -nr
```

## 📞 Alert Response Plan

### When Backend is Down

1. Check Render dashboard for service status
2. Review recent logs for errors
3. Verify MongoDB Atlas connection
4. Check environment variables
5. Restart service if needed
6. Post incident report

### When Response Time is Slow

1. Check Render CPU/Memory usage
2. Review slow query logs
3. Check MongoDB Atlas performance
4. Verify Gemini AI response times
5. Optimize slow endpoints
6. Consider upgrading tier if needed

### When Errors Spike

1. Check error.log for root cause
2. Review recent deployments
3. Check external service status (MongoDB, Gemini)
4. Roll back deployment if needed
5. Fix bug and redeploy
6. Monitor for resolution

## 🎯 Success Metrics

### Target Metrics

- **Uptime:** 99.9% (allows ~43 minutes downtime/month)
- **Response Time:** 
  - P50 < 200ms
  - P95 < 500ms
  - P99 < 1000ms
- **Error Rate:** < 0.1% of requests
- **Database Queries:** < 100ms average

### How to Track

- UptimeRobot: Uptime percentage
- Logs: Response times and error rates
- Render Dashboard: Resource usage
- MongoDB Atlas: Query performance

---

## 🚀 Next Steps

1. ✅ Winston logger configured
2. ✅ Monitoring middleware active
3. ⏳ Set up UptimeRobot monitors
4. ⏳ Configure alert contacts
5. ⏳ Review logs daily for first week
6. ⏳ (Optional) Set up Sentry for advanced error tracking

**Your monitoring system is now ready for production!** 🎉
