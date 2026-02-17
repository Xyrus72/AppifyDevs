# Mini E-Commerce API – Project Overview

This repository contains a **Mini E-Commerce API** (backend) and an optional frontend that uses **Firebase** for login and **MongoDB** (via the backend) for users, products, cart, and orders.

## What’s inside

- **backend/** – Node.js + Express API with MongoDB (Mongoose), JWT auth, products, cart, and orders.
- **frontend/** – React app with Firebase auth; login is synced to the backend and a JWT is stored for API calls.

## Quick start

1. **Backend**
   - `cd backend`
   - Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`
   - `npm install` then `npm run dev`
2. **Frontend** (optional)
   - Set `VITE_BACKEND_URL=http://localhost:5000` in `frontend/.env`
   - `npm install` then `npm run dev`

## Full documentation

All submission-required details are in **[backend/README.md](backend/README.md)**:

- **Setup instructions** – step-by-step
- **Tech stack** – Node, Express, MongoDB, JWT, Firebase (frontend)
- **Database schema / ER** – User, Product, Cart, Order (with diagram)
- **Key architectural decisions** – auth flow, order total, stock, transactions
- **Assumptions** – cart per user, order status flow, payment simulation, admin role

See also **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for environment variables and a short API summary.
