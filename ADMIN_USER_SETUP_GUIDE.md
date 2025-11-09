# Creating an Admin User - Quick Guide

## Problem
The login page shows demo credentials for Player and Coach, but no Admin credentials were available.

## Solution
A script has been created to easily set up an admin user in your database.

---

## Steps to Create Admin User

### Option 1: Using the Script (Recommended)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the admin user creation script:**
   ```bash
   node createAdminUser.js
   ```

3. **Admin credentials will be created:**
   - Email: `admin@swishfit.com`
   - Password: `Admin123!`
   - Role: `admin`

4. **Login at the frontend:**
   - Go to: http://localhost:5173/login
   - Use the admin credentials shown above

---

### Option 2: Manual Registration (Alternative)

If you prefer to register manually:

1. **Go to Register page:**
   - Visit: http://localhost:5173/register

2. **Fill in the registration form:**
   - Name: Your name
   - Email: Your email
   - Password: Your password
   - Phone: Your phone number
   - Skill Level: Any level
   - Role: Select "Admin"

3. **Submit the form**

4. **Login with your credentials**

---

### Option 3: Using MongoDB Directly

If you have direct access to MongoDB:

1. **Connect to your MongoDB database**

2. **Find the user you want to make admin:**
   ```javascript
   db.users.findOne({ email: "your.email@example.com" })
   ```

3. **Update the user's role to admin:**
   ```javascript
   db.users.updateOne(
     { email: "your.email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

4. **Verify the update:**
   ```javascript
   db.users.findOne({ email: "your.email@example.com" })
   ```

---

## Verification

After creating the admin user, verify access:

1. **Login:**
   - Go to login page
   - Use admin credentials
   - Click "Sign In"

2. **Check Dashboard:**
   - You should see "🛡️ Admin Panel" link in header
   - You should see "Admin Dashboard" card

3. **Access Admin Dashboard:**
   - Click on "Admin Panel" link OR
   - Click on "Admin Dashboard" card
   - URL should be: `/admin/dashboard`

4. **Verify Admin Features:**
   - Overview tab with stats
   - Users tab
   - Workouts tab
   - Leaderboard tab
   - Analytics tab

---

## Troubleshooting

### "Admin user already exists"
**Solution:** The admin user is already in the database. Just use the credentials to login.

### "Cannot connect to MongoDB"
**Solution:** 
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- Verify network connection

### "Permission denied"
**Solution:** Make sure you're in the backend directory when running the script.

### "User created but can't login"
**Solution:**
- Verify the user was created: Check MongoDB
- Try the exact credentials: `admin@swishfit.com` / `Admin123!`
- Clear browser cache and cookies
- Check backend server is running

### "Redirected to dashboard instead of admin dashboard"
**Solution:**
- The role might not be set correctly
- Verify role in database: `db.users.findOne({ email: "admin@swishfit.com" })`
- Role should be exactly: `"admin"` (lowercase)

---

## Default Admin Credentials

After running the script, you can use:

```
Email:    admin@swishfit.com
Password: Admin123!
Role:     admin
```

**⚠️ IMPORTANT SECURITY NOTE:**
- Change the default password after first login!
- Use the "Change Password" feature in the profile/settings
- Never share admin credentials
- Use strong, unique passwords in production

---

## Script Details

The `createAdminUser.js` script:
- ✅ Checks if admin user already exists
- ✅ Creates admin user with secure password hashing
- ✅ Sets proper role and permissions
- ✅ Provides clear console output
- ✅ Handles errors gracefully

---

## Testing Admin Access

After creating the admin user:

1. **Login Page:**
   ```
   http://localhost:5173/login
   ```

2. **Admin Dashboard:**
   ```
   http://localhost:5173/admin/dashboard
   ```

3. **Test Admin Features:**
   - View all users
   - Search and filter users
   - View user details
   - Delete workouts
   - Update rankings
   - Reset weekly/monthly points
   - View analytics

---

## Next Steps

1. ✅ Create admin user (using script or manual registration)
2. ✅ Login with admin credentials
3. ✅ Verify admin dashboard access
4. ✅ Change default password (if using script credentials)
5. ✅ Test all admin features
6. ✅ Create additional test data if needed

---

## For Production

**Before deploying to production:**

1. **Remove demo credentials from login page**
2. **Use environment variables for admin email**
3. **Enforce strong password policy**
4. **Enable 2FA for admin accounts**
5. **Set up proper logging and monitoring**
6. **Regular security audits**

---

**Updated:** November 9, 2025  
**Status:** ✅ Admin user creation script ready
