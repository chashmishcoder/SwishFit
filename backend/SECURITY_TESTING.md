# Security Middleware Implementation Guide

## Overview
Implemented comprehensive input sanitization to prevent NoSQL injection and XSS attacks.

## Packages Installed

### 1. express-mongo-sanitize
- **Purpose**: Prevents MongoDB Operator Injection
- **How it works**: Removes keys that start with `$` or contain `.` from user input
- **Protection**: Prevents attacks like `{ "$gt": "" }` in queries

### 2. xss-clean
- **Purpose**: Prevents Cross-Site Scripting (XSS) attacks
- **How it works**: Sanitizes user input by removing/escaping HTML tags and scripts
- **Protection**: Prevents injection of malicious scripts like `<script>alert('XSS')</script>`

## Implementation Location

**File**: `backend/src/server.js`

```javascript
// Import packages
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Apply middleware AFTER body parsers and BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // NoSQL injection prevention
app.use(xss()); // XSS attack prevention
```

## How to Test

### Test Endpoint (Development Only)
Test routes available at: `/api/test-security/*`

### 1. NoSQL Injection Test

**Attack Attempt**:
```bash
curl -X POST http://localhost:5000/api/test-security/test-nosql \
  -H "Content-Type: application/json" \
  -d '{
    "email": { "$ne": null },
    "password": { "$ne": null }
  }'
```

**Expected Result**:
```json
{
  "receivedBody": {
    "email": "",
    "password": ""
  }
}
```
✅ The `$ne` operator is removed, preventing NoSQL injection.

### 2. XSS Attack Test

**Attack Attempt**:
```bash
curl -X POST http://localhost:5000/api/test-security/test-xss \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>",
    "comment": "<img src=x onerror=alert(\"XSS\")>"
  }'
```

**Expected Result**:
```json
{
  "receivedBody": {
    "name": "&lt;script&gt;alert(\"XSS\")&lt;/script&gt;",
    "comment": "&lt;img src=x onerror=alert(\"XSS\")&gt;"
  }
}
```
✅ HTML tags are escaped, preventing XSS attacks.

### 3. Combined Security Test

**Attack Attempt**:
```bash
curl -X POST http://localhost:5000/api/test-security/test-combined \
  -H "Content-Type: application/json" \
  -d '{
    "user": { "$ne": null },
    "comment": "<script>alert(1)</script>",
    "search": { "$regex": ".*" }
  }'
```

**Expected Result**: All malicious payloads sanitized.

## Real-World Attack Prevention

### 1. Login Bypass Prevention

**Before Sanitization** (Vulnerable):
```javascript
// Attacker sends: { "email": { "$ne": null }, "password": { "$ne": null } }
User.findOne({ email: req.body.email, password: req.body.password })
// This would match ANY user where email and password exist!
```

**After Sanitization** (Secure):
```javascript
// Attacker sends: { "email": { "$ne": null }, "password": { "$ne": null } }
// mongoSanitize converts it to: { "email": "", "password": "" }
User.findOne({ email: "", password: "" })
// This will NOT match any user - attack prevented!
```

### 2. Comment XSS Prevention

**Before Sanitization** (Vulnerable):
```javascript
// User submits: { "comment": "<script>document.cookie</script>" }
// Stored in DB and rendered: <div>{comment}</div>
// Result: Script executes, steals cookies
```

**After Sanitization** (Secure):
```javascript
// User submits: { "comment": "<script>document.cookie</script>" }
// xss-clean converts to: "&lt;script&gt;document.cookie&lt;/script&gt;"
// Rendered as plain text, no script execution
```

## Additional Security Layers

The application already includes:

1. **Helmet.js**: Sets secure HTTP headers
2. **CORS**: Restricts cross-origin requests
3. **Rate Limiting**: Prevents brute force attacks
4. **JWT Authentication**: Secure token-based auth
5. **Input Validation**: Mongoose schema validation
6. **Password Hashing**: bcrypt for password storage

## Production Checklist

- [x] express-mongo-sanitize installed and configured
- [x] xss-clean installed and configured
- [x] Middleware applied in correct order (after body parsers, before routes)
- [x] Test endpoints created for verification
- [x] Test endpoints only available in development

## Testing in Postman

### Import Collection

Create a new collection with these requests:

1. **NoSQL Injection Test**
   - Method: POST
   - URL: `http://localhost:5000/api/test-security/test-nosql`
   - Body (raw JSON):
     ```json
     {
       "email": { "$ne": null },
       "password": { "$ne": null },
       "role": { "$in": ["admin", "coach"] }
     }
     ```

2. **XSS Test**
   - Method: POST
   - URL: `http://localhost:5000/api/test-security/test-xss`
   - Body (raw JSON):
     ```json
     {
       "name": "<script>alert('XSS')</script>",
       "bio": "<img src=x onerror=alert('XSS')>",
       "comment": "Normal text <b>bold</b> and <script>evil</script>"
     }
     ```

3. **Combined Test**
   - Method: POST
   - URL: `http://localhost:5000/api/test-security/test-combined`
   - Body (raw JSON):
     ```json
     {
       "user": { "$gt": "" },
       "comment": "<script>alert(document.cookie)</script>",
       "search": { "$regex": ".*" }
     }
     ```

## Expected Behavior

✅ **All MongoDB operators** (`$ne`, `$gt`, `$in`, `$regex`, etc.) are **removed** from request bodies
✅ **All HTML tags and scripts** are **escaped** (converted to `&lt;` and `&gt;`)
✅ **Query parameters** are also sanitized
✅ **No errors** thrown - sanitization is transparent

## Notes

- Middleware applies to **ALL routes** automatically
- Order matters: Must be after `express.json()` but before routes
- Test endpoints are **disabled in production** for security
- Both packages work together - one for NoSQL, one for XSS

## Next Steps

After testing:
1. Remove or disable test routes in production
2. Monitor logs for sanitization activity
3. Consider adding additional validation at the model level
4. Implement Content Security Policy (CSP) headers for frontend

---

**Status**: ✅ Implemented and ready for testing
**Last Updated**: November 10, 2025
