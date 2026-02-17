# Complete Setup Guide - Mini E-Commerce API

## 📋 Quick Summary

Your application includes a **Mini E-Commerce API** with MongoDB and Firebase:

- **Auth:** User logs in via Google or email (Firebase). Backend saves/updates user in MongoDB and returns a **JWT**. The frontend stores this token and sends it for cart, orders, and admin product APIs.
- **Products:** Admin can add/update/delete products and manage stock. Everyone can list and view products.
- **Cart:** Customers add/remove items; stock is validated.
- **Orders:** Place order from cart (total calculated on backend, stock deducted in a transaction). Order status (pending, shipped, delivered) and optional payment simulation are supported. Repeated cancellations are limited to prevent misuse.

For full API details, database schema, and business rules, see **backend/README.md**.

---

## 🚀 Quick Start

### Step 1: Backend Setup (Do This First)

```bash
cd backend
npm install
```

### Step 2: MongoDB Setup

1. Go to https://www.mongodb.com/cloud/atlas (free tier available)
2. Create account and cluster
3. Create database user
4. Get connection string
5. Add MongoDB URI to `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shwapno_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server is running on http://localhost:5000
```

### Step 4: Frontend Configuration

Add to `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

---

## 📊 Backend Structure

```
backend/
├── server.js              # Main server
├── config/database.js     # MongoDB connection
├── middleware/
│   ├── auth.js            # JWT create, requireAuth, requireAdmin
│   └── validate.js        # Request validation
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
└── routes/
    ├── auth.js            # Login (returns JWT), user endpoints
    ├── products.js        # Product CRUD + stock (admin)
    ├── cart.js            # Cart add/remove (authenticated)
    └── orders.js          # Place order, list, status, cancel
```

---

## ✅ Frontend Files Updated

1. **authService.js** - Added `saveLoginToDatabase()` function
2. **AuthContext.jsx** - Now calls backend on login
3. **.env.example** - Added VITE_BACKEND_URL configuration

---

## 🔌 API Endpoints (summary)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Save login, returns **token** (store it for other APIs) |
| GET | `/api/auth/user/:uid` | Get user profile |
| GET | `/api/products` | List products |
| GET | `/api/cart` | Get cart (send `Authorization: Bearer <token>`) |
| POST | `/api/cart/items` | Add to cart |
| POST | `/api/orders` | Place order from cart |
| GET | `/health` | Health check |

Full list and details: **backend/README.md**.

---

## 🧪 Test the Integration

### 1. Make sure backend is running:
```
http://localhost:5000/
```

Should show API documentation.

### 2. Make sure frontend is running:
```
http://localhost:5173
```

### 3. Try logging in with Google

Check browser console for:
```
✅ Step 4: Google Sign-In Successful!
💾 Saving login to database...
✅ Login saved to database:
```

### 4. Use the token for cart/orders

After login, the backend returns a `token`. The frontend stores it and uses `getAuthHeaders()` from `authService.js` when calling cart or order APIs (e.g. `axios.get(url, { headers: getAuthHeaders() })`).

### 5. Check MongoDB

Go to MongoDB Atlas > Collections > Find user document.

---

## 📈 User Data Saved

Each login saves:
- ✅ User ID (Firebase UID)
- ✅ Email address
- ✅ Name
- ✅ Profile photo URL
- ✅ User role (customer/admin)
- ✅ Login count
- ✅ Last login time
- ✅ First login time
- ✅ Login history (IP, browser)

---

## 🛠️ Next Steps

1. **Admin user** - Set a user's `role` to `admin` in MongoDB to use product CRUD and order status APIs.
2. **Frontend pages** - Build product list, cart page, and checkout using the APIs (see backend/README.md).
3. **Deploy** - Deploy backend (e.g. Railway, Render) and set `VITE_BACKEND_URL` and `JWT_SECRET` in production.

---

## ⚠️ Common Issues & Solutions

### Issue: "MONGODB_URI is not defined"
**Solution:** Create/edit `backend/.env` with your MongoDB connection string

### Issue: "Failed to save login to database"
**Solution:** 
- Check if backend is running on port 5000
- Check `.env` has correct MONGODB_URI
- Check MongoDB Atlas IP whitelist

### Issue: CORS Error
**Solution:** Already configured in server.js, but if issues persist, update CORS origin

### Issue: "Cannot find module 'axios'"
**Solution:** 
```bash
cd frontend
npm install axios
```

---

## 📚 Useful Commands

```bash
# Backend Development
cd backend
npm run dev              # Start with auto-reload

# Frontend Development
cd frontend
npm run dev              # Start Vite dev server

# Install new packages
npm install package-name

# Build for production
npm run build
```

---

## 🎯 What to Do Now

1. ✅ Set up MongoDB Atlas (5 mins)
2. ✅ Update `backend/.env` with MongoDB URI (2 mins)
3. ✅ Install backend dependencies: `npm install` (3 mins)
4. ✅ Run backend: `npm run dev` (immediately)
5. ✅ Run frontend: `npm run dev` (immediately)
6. ✅ Test by logging in with Google
7. ✅ Check MongoDB Atlas to see saved user data

---

## 📞 Support

Refer to:
- `backend/README.md` for detailed API documentation
- `frontend/.env.example` for all env variables
- MongoDB documentation: https://docs.mongodb.com/

---

**Your app is now ready to track user logins in MongoDB! 🎉**
