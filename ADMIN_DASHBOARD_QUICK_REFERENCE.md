# Admin Dashboard - Quick Reference Guide

## 🚀 Quick Start

### Access Admin Dashboard
1. Login with admin credentials
2. Click "🛡️ Admin Panel" in header OR
3. Click "Admin Dashboard" card on dashboard
4. URL: `http://localhost:5173/admin/dashboard`

---

## 📋 Admin Dashboard Tabs

### 1️⃣ Overview
**Quick Stats:**
- Total Users (players + coaches)
- Total Workouts
- Active Users
- System Health

**Quick Actions:**
- Update Rankings
- Reset Weekly Points
- Reset Monthly Points

**Top Performers:**
- Top 5 users by points
- Workout count & completion rate

---

### 2️⃣ Users
**Search:** Type name or email  
**Filter:** All / Players / Coaches / Admins  

**User Table Columns:**
- Name & Email
- Role (badge)
- Skill Level
- Status (Active/Inactive)
- Actions (View)

**View User:** Click "View" → See details in modal

---

### 3️⃣ Workouts
**Workout List:**
- Title & Description
- Category badge
- Difficulty badge
- Exercise count

**Actions:**
- Delete workout (with confirmation)

---

### 4️⃣ Leaderboard
**Display:**
- Top 20 performers
- Rank badges (🥇🥈🥉)
- Workout stats
- Total points

**Rank Colors:**
- Gold: #1
- Silver: #2
- Bronze: #3
- Gray: 4+

---

### 5️⃣ Analytics
**Metrics Cards:**
- Total Workouts Completed
- Avg Completion Rate
- Active Today

**Charts:**
- Category Distribution (bar chart)
- 7-Day Activity Trend (bar chart)

---

## 🎯 Common Tasks

### Update Leaderboard Rankings
1. Go to Overview tab
2. Click "Update Rankings"
3. Confirm action
4. ✅ Rankings recalculated

### Delete a Workout
1. Go to Workouts tab
2. Find workout
3. Click "Delete"
4. Confirm deletion
5. ✅ Workout removed

### Search for a User
1. Go to Users tab
2. Type name/email in search
3. ✅ Table filters instantly

### View User Details
1. Go to Users tab
2. Click "View" on user
3. See modal with details
4. Click "Close"

### Reset Weekly/Monthly Points
1. Go to Overview tab
2. Click "Reset Weekly" or "Reset Monthly"
3. Confirm action
4. ✅ Points reset for all users

---

## 🔐 Admin Permissions

### What Admins CAN Do:
✅ View all users  
✅ View user details  
✅ View all workouts  
✅ Delete workouts  
✅ Update rankings  
✅ Reset weekly/monthly points  
✅ View leaderboard  
✅ View analytics  
✅ Assign coaches (future)  

### What Admins CANNOT Do (Yet):
❌ Edit user roles inline  
❌ Bulk operations  
❌ Export data  
❌ Create users from admin panel  
❌ Send emails to users  

---

## 🎨 Visual Guide

### Color Codes

**Role Badges:**
- 🟣 Purple = Admin
- 🔵 Blue = Coach
- 🟢 Green = Player

**Status Badges:**
- 🟢 Green = Active
- 🔴 Red = Inactive

**Category Badges:**
- 🔵 Blue = Category
- 🟣 Purple = Difficulty
- 🩶 Gray = Count

**Rank Badges:**
- 🟡 Gold = #1
- 🩶 Silver = #2
- 🟠 Bronze = #3
- 🩶 Gray = 4+

---

## ⌨️ Keyboard Shortcuts

### Navigation:
- `Tab` - Navigate through elements
- `Enter` - Click focused button
- `Esc` - Close modal

### Search:
- Click search box or `Tab` to it
- Type to filter (instant)
- `Backspace` to clear

---

## 🐛 Troubleshooting

### "Failed to load dashboard data"
**Cause:** Backend not running  
**Fix:** Start backend server on port 5001

### "Redirected to dashboard"
**Cause:** Not logged in as admin  
**Fix:** Login with admin credentials

### Empty stats showing 0
**Cause:** No data in database  
**Fix:** Add test users, workouts, progress

### Charts not loading
**Cause:** Analytics tab not initialized  
**Fix:** Click Analytics tab to load data

### Search not working
**Cause:** JavaScript error  
**Fix:** Check browser console for errors

---

## 📞 Quick Help

### Need to...

**See all users?**
→ Users tab

**Delete a workout?**
→ Workouts tab → Delete button

**Update rankings?**
→ Overview tab → Update Rankings

**View top performers?**
→ Overview tab (bottom) OR Leaderboard tab

**See system analytics?**
→ Analytics tab

**Find a specific user?**
→ Users tab → Search by name/email

**Reset points?**
→ Overview tab → Reset Weekly/Monthly

---

## 🔄 Data Refresh

### Auto-Refresh:
❌ No auto-refresh (manual only)

### Manual Refresh:
1. Reload page (browser refresh)
2. Or switch tabs and come back

### After Actions:
✅ Data refreshes automatically after:
- Delete workout
- Update rankings
- Reset points

---

## 📱 Mobile Access

### Supported:
✅ View dashboard  
✅ View users  
✅ View workouts  
✅ View leaderboard  
✅ View analytics  

### Optimized:
✅ Touch-friendly buttons  
✅ Scrollable tables  
✅ Stacked cards  
✅ Responsive charts  

### Tips:
- Landscape mode for tables
- Pinch to zoom charts
- Swipe tables horizontally

---

## ⚡ Pro Tips

1. **Use Search:** Faster than scrolling through users
2. **Filter by Role:** Narrow down user list quickly
3. **Check Overview First:** Quick system snapshot
4. **Analytics Tab:** Best for insights and trends
5. **Confirmation Dialogs:** Read before clicking OK!

---

## 🎓 Learning Resources

**Full Documentation:**
- `ADMIN_DASHBOARD_COMPLETE.md` - Complete guide
- `ADMIN_DASHBOARD_TESTING_GUIDE.md` - Testing scenarios
- `TIER2_COMPLETE_SUMMARY.md` - Project overview

**Code Files:**
- `frontend/src/pages/AdminDashboard.jsx` - UI component
- `frontend/src/services/adminService.js` - API calls

---

## 📊 Quick Stats Reference

### Users Tab
- **Search:** Real-time filtering
- **Filter:** Role-based (4 options)
- **Display:** All users table
- **Actions:** View details

### Workouts Tab
- **Display:** All workouts
- **Actions:** Delete
- **Info:** Category, difficulty, exercises

### Leaderboard Tab
- **Display:** Top 20 users
- **Sort:** By total points
- **Info:** Rank, workouts, completion, points

### Analytics Tab
- **Metrics:** 3 key stats
- **Charts:** 2 visualizations
- **Load:** On-demand (first visit)

---

## 🎯 Success Indicators

✅ **Dashboard is working if you see:**
- 4 stat cards with numbers
- Quick action buttons
- Top performers list
- All 5 tabs clickable
- Data in tables

❌ **Dashboard has issues if you see:**
- Red error banner
- All zeros in stats
- Empty tables
- Broken charts
- Console errors

---

## 🔧 Support

### Getting Help
1. Check this guide first
2. Check full documentation
3. Check browser console
4. Check backend server logs
5. Contact development team

### Reporting Issues
Include:
- What you were trying to do
- What happened (error message)
- Browser and device
- Screenshot (if helpful)

---

**Last Updated:** November 9, 2025  
**Version:** 1.0  
**Status:** Production Ready (pending testing)

