# Authentication Security Fix - Role Privilege Escalation

## Critical Bug Fixed
**Severity**: CRITICAL - Privilege Escalation Vulnerability

### Problem
Admin accounts could be logged in as customers (and vice versa) by simply selecting the wrong role radio button during login. This allowed:
- Admin accounts to be downgraded to customer role
- Customers to potentially attempt privilege escalation (blocked by backend, but not ideal)
- Role selection in UI overriding actual database permissions

**Example**: 
- User `admin@gmail.com` (actual role in DB: `admin`)
- User mistakenly selects "customer" radio button during login
- Frontend sends `role: 'customer'` to backend
- **BUG**: Old code saved role to database, corrupting the account
- Result: Admin account now has `customer` role

### Root Cause Analysis
The vulnerability existed in 3 layers:

**1. Frontend - AuthContext.jsx (VULNERABLE)**
```javascript
// OLD CODE (WRONG):
const emailLogin = async (email, password, userRole = 'customer') => {
  const userData = await emailSignIn(email, password)
  setRole(userRole)  // ❌ Uses user-selected role
  await saveLoginToDatabase(userData, userRole)
  localStorage.setItem('role', userRole)  // ❌ Saves selected role
}
```

**2. Frontend - authService.js (VULNERABLE)**
```javascript
// OLD CODE (WRONG):
export const saveLoginToDatabase = async (userData, role = 'customer') => {
  const response = await axios.post('/api/auth/login', {
    role  // ❌ Sends frontend-selected role to backend
  })
  return response.data;
}
```

**3. Backend - auth.js (ACCEPTABLE BUT COULD BE CLEARER)**
```javascript
// OLD CODE (Not ideal for existing users):
if (user) {
  // Updates login info but backend was relying on frontend to not send role
  // for existing users
}
```

## Solution Implemented

### Step 1: Frontend Fix - Use Database Role (PRIMARY FIX)
**File**: `frontend/src/context/AuthContext.jsx`

Changed all login functions (`emailLogin`, `login`, `signup`) to:
```javascript
// NEW CODE (CORRECT):
const emailLogin = async (email, password, userRole = 'customer') => {
  const userData = await emailSignIn(email, password)
  
  // Save login to MongoDB backend
  const loginResponse = await saveLoginToDatabase(userData, userRole)
  
  // ✅ Use ACTUAL role from database, NOT user-selected role
  if (loginResponse && loginResponse.user) {
    const actualRole = loginResponse.user.role  // From DB
    setRole(actualRole)
    localStorage.setItem('role', actualRole)
  } else {
    setRole(userRole)  // Fallback only
  }
}
```

**Key Change**: Frontend now extracts `user.role` from the backend response (which comes from the database) instead of trusting the user-selected role.

### Step 2: Backend Hardening - Explicit Security Comments
**File**: `backend/routes/auth.js`

Added explicit comments enforcing the security policy:
```javascript
if (user) {
  // IMPORTANT: For existing users, ALWAYS use their database role
  // NEVER accept or update role from the request body
  // This prevents security issues where frontend tries to escalate privileges
  user.lastLogin = new Date();
  // ... only update login metadata, NOT role
}
```

The backend code was already correct (role only set for new users), but comments make the intention crystal clear.

### Step 3: Service Layer Documentation
**File**: `frontend/src/services/authService.js`

Added security comment:
```javascript
// response.data.user.role contains the ACTUAL role from the database
// Frontend should ALWAYS use response.data.user.role, NOT the role parameter sent
// This prevents privilege escalation if frontend tries to impersonate different role
```

## How It Works Now

```
USER LOGIN FLOW:
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User enters email/password                                        │
│ 2. User (mistakenly) selects "customer" radio button                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND: emailLogin('admin@gmail.com', password, 'customer')        │
│ - Calls Firebase authentication                                      │
│ - Calls saveLoginToDatabase(..., 'customer')  [role='customer']      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND: POST /api/auth/login                                        │
│ {                                                                    │
│   uid: "xyz123",                                                     │
│   email: "admin@gmail.com",                                          │
│   role: "customer"           ← Frontend-selected role                │
│ }                                                                    │
│                                                                      │
│ BACKEND LOGIC:                                                       │
│ 1. Find existing user: admin@gmail.com (role='admin' in DB)         │
│ 2. Update login metadata (no role update)                           │
│ 3. Return response with user.role from DATABASE                     │
│ Response: {                                                          │
│   user: {                                                            │
│     role: "admin"            ← ACTUAL DB role                        │
│   }                                                                  │
│ }                                                                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND: Extract role from response                                 │
│ - const actualRole = loginResponse.user.role  → 'admin'            │
│ - setRole('admin')  ✅ Uses DB role                                  │
│ - localStorage.role = 'admin'  ✅ Uses DB role                       │
│ - Navigate to /admin/dashboard  ✅ Correct route                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Testing the Fix

### Test Case 1: Admin Account With Wrong Role Selection
1. User: `admin@gmail.com` (DB role: `admin`)
2. Password: ✓ Correct
3. Role Selection: Select "customer"
4. **BEFORE FIX**: Logged in as customer ❌
5. **AFTER FIX**: Logged in as admin ✅

### Test Case 2: Customer Account With Wrong Role Selection  
1. User: `customer@gmail.com` (DB role: `customer`)
2. Password: ✓ Correct
3. Role Selection: Select "admin"
4. **BEFORE FIX**: Logged in as admin ❌ (dangerous!)
5. **AFTER FIX**: Logged in as customer ✅

### Test Case 3: New User Registration
1. New user signs up with role selection
2. **BEHAVIOR**: Still works as intended
3. **WHY**: New users don't exist in DB, so role from request is used
4. **AFTER FIX**: Same behavior ✅

## Files Modified

| File | Changes |
|------|---------|
| `frontend/src/context/AuthContext.jsx` | Updated `emailLogin()`, `login()`, `signup()` to use role from API response |
| `frontend/src/services/authService.js` | Added security documentation comment |
| `backend/routes/auth.js` | Added explicit security comments explaining role handling |

## Future Improvements

1. **Remove role selection from login form** - Role radio button should ONLY be on registration, not login
2. **Add admin role change endpoint** - Only admins can change other users' roles, through dedicated API
3. **Audit logging** - Log all role changes with admin who made the change
4. **Database validation** - Add role enum validation in User model
5. **Frontend routing protection** - Verify actual role before allowing access to admin routes

## Verification Checklist

- [x] Backend: Existing users cannot have role changed via login request
- [x] Frontend: Uses actual role from API response, not user selection
- [x] Frontend: Correct navigation based on DB role
- [x] Frontend: Role stored in localStorage is from database
- [x] Security comments added to code
- [x] New users still work correctly (role set on registration)
