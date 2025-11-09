# Quick Start Testing Guide - Tier 1 Features

## Prerequisites
- Backend running on `http://localhost:5001`
- Frontend running on `http://localhost:5173`
- Test user accounts (player and coach roles)

---

## 🏀 Feature 1: Workout Detail Page

### Test Steps:
1. Login as any user
2. Navigate to **Workouts** from dashboard
3. Click on any workout card
4. **Verify you see:**
   - ✓ Workout title and description
   - ✓ Coach name
   - ✓ Skill level, category, difficulty badges
   - ✓ Stats (exercises, duration, calories, sets)
   - ✓ Complete exercise list with details
   - ✓ **"Start Workout"** button (orange, prominent)
   - ✓ Back button

### As Coach/Admin:
5. Click a workout you created
6. **Verify you see:**
   - ✓ **Edit** button
   - ✓ **Delete** button
7. Click Delete → Should show confirmation modal
8. Cancel → Modal closes

### Expected Result:
- All workout information displays correctly
- Badges show appropriate colors
- Exercise list is readable and organized
- Edit/Delete only visible to authorized users

---

## 🎯 Feature 2: Workout Completion Flow (CRITICAL)

### Test Steps:
1. From Workout Detail page, click **"Start Workout"**
2. **Verify you see:**
   - ✓ Workout title in header
   - ✓ Timer showing 0:00
   - ✓ Progress bar at 0%
   - ✓ Current exercise (1 of X)
   - ✓ Exercise details (sets, reps, duration, rest)
   - ✓ Set tracking grid
   - ✓ Instructions list
   - ✓ Equipment list

### Complete a Workout:
3. Click **Start** button on timer
4. **Verify:** Timer starts counting
5. Click sets in the tracking grid to mark complete
6. **Verify:** 
   - ✓ Clicked sets turn green
   - ✓ Progress bar increases
   - ✓ Counter updates (X of Y sets)
7. Click **Next** to go to next exercise
8. Complete more sets
9. On last exercise, click **"Complete Workout"**

### Completion Modal:
10. **Verify modal shows:**
    - ✓ Duration summary
    - ✓ Completion percentage
    - ✓ Metrics form (calories, distance, heart rate)
    - ✓ Performance rating slider (1-10)
    - ✓ Notes textarea
11. Fill in some metrics (optional)
12. Adjust performance rating slider
13. Click **"Save & Finish"**

### Expected Result:
- ✓ Redirects to Progress Charts page
- ✓ Success message shows
- ✓ Workout appears in progress history
- ✓ Data saved in backend (verify in Progress Charts)

### Critical Check:
```bash
# Backend should show new progress entry
# Check MongoDB or backend logs
```

---

## ✏️ Feature 3: Workout Creation/Edit

### Test as Coach/Admin:

#### Create New Workout:
1. Navigate to **Workouts**
2. Click **"+ Create Workout"** button (top right)
3. **Verify form has:**
   - ✓ Title field
   - ✓ Description field
   - ✓ Category dropdown
   - ✓ Skill level dropdown
   - ✓ Difficulty dropdown
   - ✓ Target calories field
   - ✓ Public/Private checkbox
   - ✓ Notes field
   - ✓ Exercise builder section

#### Add Exercise Manually:
4. Fill in exercise details:
   - Exercise name: "Push-ups"
   - Sets: 3
   - Reps: 10
   - Rest: 60
5. Add instruction: "Keep back straight"
6. Add equipment: "None"
7. Click **"Add Exercise to Workout"**
8. **Verify:** Exercise appears in list below with badges

#### Test AI Generation:
9. Clear form or create new workout
10. Fill in description: "High intensity cardio workout for basketball players"
11. Select category: Cardio
12. Click **"✨ Generate with AI"**
13. **Verify:**
    - ✓ Button shows "Generating..."
    - ✓ After ~2-5 seconds, exercises populate
    - ✓ Multiple exercises added automatically
    - ✓ Success message shows

#### Manage Exercises:
14. Click **↑** on exercise 2 → Should move up
15. Click **↓** on exercise 1 → Should move down
16. Click **✕** on an exercise → Should remove

#### Save Workout:
17. Fill in title: "Test Workout"
18. Click **"Create Workout"**
19. **Verify:**
    - ✓ Success message
    - ✓ Redirects to workout detail page
    - ✓ New workout shows all details correctly

#### Edit Existing Workout:
20. From workout detail, click **"Edit"**
21. **Verify:** Form pre-filled with workout data
22. Change title
23. Click **"Update Workout"**
24. **Verify:** Changes saved

### Test as Player:
25. Login as player
26. Try to access `/workouts/create`
27. **Verify:** Shows "Access Denied" page

---

## 🔒 Feature 4: Password Change

### Test Steps:
1. Login as any user
2. Navigate to **Profile**
3. Click **"🔒 Change Password"** button (top right)
4. **Verify form has:**
   - ✓ Current password field (with eye icon)
   - ✓ New password field (with eye icon)
   - ✓ Confirm password field (with eye icon)
   - ✓ Password strength indicator
   - ✓ Requirements checklist
   - ✓ Security tips banner

### Test Validation:
5. Enter current password
6. Enter new password: "weak"
7. **Verify:**
   - ✓ Strength meter shows "Weak" (red)
   - ✓ Requirements unchecked
8. Update to: "Test123!"
9. **Verify:**
   - ✓ Strength meter updates to "Medium/Strong"
   - ✓ Requirements turn green
10. Enter different confirm password
11. **Verify:** Error "Passwords do not match"

### Test Visibility Toggle:
12. Click eye icon on any field
13. **Verify:** Password becomes visible
14. Click again → Hidden

### Complete Change:
15. Enter matching strong passwords
16. Click **"Update Password"**
17. **Verify:**
    - ✓ Success message shows
    - ✓ Auto-redirects to dashboard after 2 seconds
18. Logout
19. Login with NEW password
20. **Verify:** Can login successfully

### Test Wrong Current Password:
21. Go back to Change Password
22. Enter wrong current password
23. Try to submit
24. **Verify:** Error message from backend

---

## 🔗 Integration Tests

### Navigation Flow Test:
```
Dashboard → Workouts → Click Workout → Start Workout → 
Complete → Back to Progress → See Logged Workout
```

### Coach Content Creation Flow:
```
Dashboard → Workouts → Create Workout → 
Generate with AI → Edit Exercises → Save → 
View Detail → Start Workout → Complete
```

### Profile Security Flow:
```
Dashboard → Profile → Change Password → 
Update Successfully → Logout → Login with New Password
```

---

## 🐛 Common Issues to Check

### Workout Detail:
- [ ] 404 if workout doesn't exist
- [ ] Edit/Delete buttons only for authorized users
- [ ] Loading state shows before data loads
- [ ] Exercise list handles empty workouts

### Start Workout:
- [ ] Timer doesn't skip if user refreshes
- [ ] Sets stay checked when navigating exercises
- [ ] Modal doesn't close accidentally
- [ ] Validation on metrics form
- [ ] Success navigation to progress page

### Create Workout:
- [ ] Access denied for non-coaches
- [ ] AI generation handles API errors
- [ ] Exercise reordering doesn't break list
- [ ] Form validation on required fields
- [ ] Edit mode loads correct workout

### Password Change:
- [ ] Strength meter updates real-time
- [ ] Visibility toggles work independently
- [ ] Backend validates current password
- [ ] Success redirect works
- [ ] Can't use same password

---

## ✅ Success Criteria

All features should:
- ✅ Load without console errors
- ✅ Display correct data from API
- ✅ Show loading states during API calls
- ✅ Handle errors gracefully
- ✅ Validate user input
- ✅ Save data to backend
- ✅ Redirect appropriately
- ✅ Work on mobile (responsive)

---

## 📊 Backend Verification

After testing, verify in backend/database:
```bash
# Check if workouts created
db.workouts.find({ title: "Test Workout" })

# Check if progress logged
db.progress.find({ user: <userId> }).sort({ completedAt: -1 })

# Check if password changed
# Try logging in with new password
```

---

## 🚀 Quick Test Script

```bash
# 1. Start backend
cd backend && npm run dev

# 2. Start frontend
cd frontend && npm run dev

# 3. Open browser
open http://localhost:5173

# 4. Test in order:
#    - Login
#    - Workout Detail
#    - Start Workout (CRITICAL)
#    - Create Workout (as coach)
#    - Change Password
```

---

## 📝 Bug Report Template

If you find a bug:
```
Feature: [Workout Detail | Start Workout | Create Workout | Password Change]
Route: /path/to/page
User Role: [player | coach | admin]

Steps to Reproduce:
1. 
2. 
3. 

Expected Behavior:


Actual Behavior:


Console Errors:


Screenshots:
```

---

## ⏱️ Estimated Testing Time

- Feature 1 (Workout Detail): 15 minutes
- Feature 2 (Start Workout): 30 minutes ⚠️ CRITICAL
- Feature 3 (Create Workout): 30 minutes
- Feature 4 (Password Change): 15 minutes
- Integration Tests: 30 minutes

**Total: 2 hours**

---

**Happy Testing! 🎉**

Report any issues and we'll fix them before deployment.

