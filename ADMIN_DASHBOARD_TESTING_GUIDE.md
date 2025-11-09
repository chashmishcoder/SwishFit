# Admin Dashboard Testing Guide

## Prerequisites
✅ Backend server running on port 5001  
✅ Frontend server running on port 5173  
✅ Admin user account created  
✅ Test data: Multiple users, workouts, and progress entries  

---

## Test Scenario 1: Admin Access Control

### Test 1.1: Admin User Access
**Steps:**
1. Login with admin credentials
2. Navigate to dashboard
3. Look for "🛡️ Admin Panel" in header navigation
4. Look for "Admin Dashboard" card in quick access section

**Expected Results:**
✅ Admin Panel link visible in header  
✅ Admin Dashboard card visible below Coach Portal card  
✅ Both links work and navigate to `/admin/dashboard`

### Test 1.2: Non-Admin Access Blocked
**Steps:**
1. Login with player or coach credentials
2. Try to access `/admin/dashboard` directly in URL

**Expected Results:**
✅ Automatically redirected to `/dashboard`  
✅ No Admin Panel link in header  
✅ No Admin Dashboard card visible  

---

## Test Scenario 2: Dashboard Overview Tab

### Test 2.1: Stats Cards Display
**Steps:**
1. Login as admin
2. Navigate to Admin Dashboard
3. Verify overview tab is active by default

**Expected Results:**
✅ 4 stats cards displayed:
- Total Users (with players/coaches breakdown)
- Total Workouts
- Active Users
- System Health (shows "Good")

### Test 2.2: Quick Actions
**Steps:**
1. Click "Update Rankings" button
2. Confirm action in alert
3. Click "Reset Weekly" button
4. Confirm action in dialog
5. Click "Reset Monthly" button
6. Confirm action in dialog

**Expected Results:**
✅ Update Rankings: Success message, leaderboard updates  
✅ Reset Weekly: Confirmation required, success message  
✅ Reset Monthly: Confirmation required, success message  
✅ Loading state shows during operations  

### Test 2.3: Top Performers Section
**Steps:**
1. Scroll to "Top Performers" section
2. Verify top 5 users displayed

**Expected Results:**
✅ Shows rank (#1, #2, etc.)  
✅ Shows user name  
✅ Shows workout count  
✅ Shows total points  
✅ Shows completion rate  

---

## Test Scenario 3: User Management Tab

### Test 3.1: User Table Display
**Steps:**
1. Click "Users" tab
2. Verify user table displays

**Expected Results:**
✅ Table shows all users (players + coaches)  
✅ Columns: User (name/email), Role, Skill Level, Status, Actions  
✅ Role badges color-coded (admin=purple, coach=blue, player=green)  
✅ Status badges (Active=green, Inactive=red)  

### Test 3.2: Search Functionality
**Steps:**
1. Type user name in search box
2. Type user email in search box
3. Clear search box

**Expected Results:**
✅ Table filters as you type  
✅ Shows only matching users  
✅ Search works for both name and email  
✅ Clearing search shows all users again  

### Test 3.3: Role Filter
**Steps:**
1. Select "Players" from filter dropdown
2. Select "Coaches" from filter dropdown
3. Select "Admins" from filter dropdown
4. Select "All Roles"

**Expected Results:**
✅ Only players shown when "Players" selected  
✅ Only coaches shown when "Coaches" selected  
✅ Only admins shown when "Admins" selected  
✅ All users shown when "All Roles" selected  

### Test 3.4: View User Details
**Steps:**
1. Click "View" button on any user
2. Verify modal opens
3. Click "Close" button

**Expected Results:**
✅ Modal opens with user details:
- Name
- Email
- Role
- Skill Level
- Phone Number
- Member Since date
✅ Modal closes when "Close" clicked  
✅ Modal closes when clicking outside (if implemented)  

---

## Test Scenario 4: Workout Management Tab

### Test 4.1: Workout List Display
**Steps:**
1. Click "Workouts" tab
2. Verify workout list displays

**Expected Results:**
✅ All workouts displayed in card format  
✅ Each card shows:
- Title
- Description
- Category badge
- Difficulty badge
- Exercise count badge
✅ "Delete" button on each card  

### Test 4.2: Delete Workout
**Steps:**
1. Click "Delete" on any workout
2. Click "Cancel" in confirmation dialog
3. Click "Delete" again
4. Click "OK" in confirmation dialog

**Expected Results:**
✅ Confirmation dialog appears  
✅ Cancel: No action taken, workout still visible  
✅ OK: Workout deleted, removed from list  
✅ Workout count updates  

---

## Test Scenario 5: Leaderboard Tab

### Test 5.1: Global Rankings Display
**Steps:**
1. Click "Leaderboard" tab
2. Verify rankings display

**Expected Results:**
✅ Top 20 users displayed  
✅ Rank badges (gold for #1, silver for #2, bronze for #3)  
✅ Each entry shows:
- Rank number
- User name
- Workout count
- Completion rate
- Total points
✅ Sorted by total points (highest first)  

### Test 5.2: Visual Rankings
**Steps:**
1. Compare rank 1, 2, and 3 badges
2. Check other ranks

**Expected Results:**
✅ Rank 1: Gold/yellow badge  
✅ Rank 2: Silver/gray badge  
✅ Rank 3: Bronze/orange badge  
✅ Other ranks: Gray badge  

---

## Test Scenario 6: Analytics Tab

### Test 6.1: Load Analytics
**Steps:**
1. Click "Analytics" tab
2. Wait for data to load

**Expected Results:**
✅ Loading state displayed first  
✅ 3 gradient metric cards show:
- Total Workouts Completed
- Avg Completion Rate
- Active Today
✅ All values populated correctly  

### Test 6.2: Category Distribution Chart
**Steps:**
1. Scroll to "Workout Categories Distribution"
2. Verify bar chart displays

**Expected Results:**
✅ Bar chart shows all workout categories  
✅ Bar widths proportional to counts  
✅ Category names on left  
✅ Count numbers on right side of bars  
✅ Basketball orange color for bars  

### Test 6.3: Activity Trend Chart
**Steps:**
1. Scroll to "Activity Trend (Last 7 Days)"
2. Verify bar chart displays

**Expected Results:**
✅ 7 vertical bars (one per day)  
✅ Date labels below each bar  
✅ Count numbers below date labels  
✅ Bar heights proportional to activity  
✅ Basketball orange color for bars  

---

## Test Scenario 7: Responsive Design

### Test 7.1: Mobile View (< 768px)
**Steps:**
1. Resize browser to mobile width
2. Navigate through all tabs

**Expected Results:**
✅ Stats cards stack vertically (single column)  
✅ Tab navigation scrollable  
✅ Tables horizontally scrollable  
✅ Cards full width  
✅ Search/filter stack vertically  

### Test 7.2: Tablet View (768px - 1024px)
**Steps:**
1. Resize browser to tablet width
2. Navigate through all tabs

**Expected Results:**
✅ Stats cards in 2 columns  
✅ Quick action cards in 2 columns  
✅ Tables fit width with some scrolling  

### Test 7.3: Desktop View (> 1024px)
**Steps:**
1. Resize browser to desktop width
2. Navigate through all tabs

**Expected Results:**
✅ Stats cards in 4 columns  
✅ Quick action cards in 3 columns  
✅ Tables fit width without scrolling  
✅ Modal centered with max width  

---

## Test Scenario 8: Error Handling

### Test 8.1: API Errors
**Steps:**
1. Stop backend server
2. Reload admin dashboard
3. Try any action (delete, update rankings, etc.)

**Expected Results:**
✅ Error message displayed in red banner  
✅ "Failed to load dashboard data" or similar error  
✅ Loading state ends  
✅ Actions show error alerts  

### Test 8.2: Network Errors
**Steps:**
1. Disconnect internet (or simulate in DevTools)
2. Try admin operations

**Expected Results:**
✅ Error messages displayed  
✅ No crashes or white screens  
✅ Graceful degradation  

---

## Test Scenario 9: Performance

### Test 9.1: Initial Load Time
**Steps:**
1. Open browser DevTools → Network tab
2. Navigate to admin dashboard
3. Measure time to interactive

**Expected Results:**
✅ 4 parallel API calls on load  
✅ All data loads within 2-3 seconds  
✅ Loading state shows during fetch  

### Test 9.2: Tab Switching
**Steps:**
1. Switch between tabs rapidly
2. Measure response time

**Expected Results:**
✅ Instant tab switching (< 100ms)  
✅ No loading state (cached data)  
✅ Analytics tab loads on first visit only  

### Test 9.3: Search Performance
**Steps:**
1. Go to Users tab
2. Type in search box rapidly
3. Clear search

**Expected Results:**
✅ Instant filtering (client-side)  
✅ No API calls during search  
✅ No lag or stuttering  

---

## Test Scenario 10: Security

### Test 10.1: Role Verification
**Steps:**
1. Login as player
2. Try to access `/admin/dashboard` in URL bar
3. Logout
4. Try to access `/admin/dashboard` while logged out

**Expected Results:**
✅ Player: Redirected to `/dashboard`  
✅ Logged out: Redirected to `/login`  
✅ No data exposed to non-admin users  

### Test 10.2: Backend Authorization
**Steps:**
1. Open browser DevTools → Console
2. Try to call admin APIs directly:
```javascript
fetch('http://localhost:5001/api/leaderboard/update-rankings', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <non-admin-token>' }
})
```

**Expected Results:**
✅ 403 Forbidden error  
✅ Backend rejects non-admin requests  
✅ Authorization checked on server side  

---

## Regression Testing

### After Any Code Changes
1. ✅ Run all test scenarios above
2. ✅ Verify no existing functionality broken
3. ✅ Check console for errors
4. ✅ Test on multiple browsers (Chrome, Firefox, Safari)
5. ✅ Test on different devices (mobile, tablet, desktop)

---

## Known Issues & Limitations

### Current Limitations
1. **Activity Trend Data:** Currently uses mock data (ready for real API integration)
2. **User Role Update:** View only (no inline editing yet)
3. **Bulk Operations:** Not implemented (single operations only)
4. **Export Functionality:** Not implemented (future enhancement)

### Future Testing Needs
1. Real-time activity data integration
2. Bulk user operations
3. Advanced filtering and sorting
4. CSV/PDF export functionality
5. Audit trail viewing

---

## Bug Report Template

If you find a bug, report it with:

```markdown
**Bug Title:** [Brief description]

**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Browser/Device:**
[Chrome 118, iPhone 14, etc.]

**Console Errors:**
[Any errors from browser console]
```

---

## Test Completion Checklist

### Functionality ✅
- [ ] Admin access control works
- [ ] Overview tab displays correctly
- [ ] Quick actions work (rankings, resets)
- [ ] User management works (search, filter, view)
- [ ] Workout management works (list, delete)
- [ ] Leaderboard displays correctly
- [ ] Analytics loads and displays charts

### UI/UX ✅
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Loading states work
- [ ] Error states display
- [ ] Modals work correctly
- [ ] Transitions smooth

### Security ✅
- [ ] Non-admin users blocked
- [ ] Backend authorization works
- [ ] Confirmations for destructive actions

### Performance ✅
- [ ] Initial load < 3 seconds
- [ ] Tab switching instant
- [ ] Search/filter instant
- [ ] No memory leaks

---

**Happy Testing! 🧪**

Report any issues found during testing so they can be addressed before production deployment.
