# Mini E-Commerce API

A backend API for a small online shopping platform. It handles user auth (with Firebase + MongoDB), products, cart, and orders. Role-based access: **Admin** manages products; **Customer** browses, adds to cart, and places orders. Order total is always calculated on the server, stock is deducted only after a successful order, and repeated cancellations are limited to reduce misuse.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (backend) + Firebase (frontend login; backend stores user and issues JWT)
- **Validation:** express-validator
- **Other:** dotenv, cors

---

## Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and set:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

- **MONGODB_URI:** MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
- **JWT_SECRET:** A long, random string used to sign JWTs. Use a strong value in production.

### 3. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:5000`. Root `GET /` returns a short list of endpoints.

### 4. Frontend (optional)

- Set `VITE_BACKEND_URL=http://localhost:5000` in the frontend `.env`.
- After login (Firebase), the backend returns a **token**. Store it (e.g. in localStorage) and send it in the **Authorization** header for protected routes:  
  `Authorization: Bearer <token>`.

---

## Database Schema / ER Overview

Collections and main fields:

- **User**  
  - `uid` (Firebase), `email`, `name`, `photoURL`, `role` (customer | admin), `isActive`, `loginHistory`, timestamps.

- **Product**  
  - `name`, `description`, `price`, `stock`, `category`, `imageURL`, `isActive`, timestamps.

- **Cart**  
  - `user` (ref User), `items[]` where each item has `product` (ref Product), `quantity`.

- **Order**  
  - `user` (ref User), `items[]` (embedded: `product`, `productName`, `quantity`, `priceAtOrder`, `subtotal`), `totalAmount`, `status`, `paymentStatus`, `cancelledAt`, `cancelledBy`, timestamps.

Relationships:

- One User has one Cart.
- Cart has many items; each item references one Product.
- One User has many Orders.
- Each Order has many embedded OrderItems; each item references one Product.

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │──1:1──│   Cart   │       │ Product  │
└────┬─────┘       └────┬─────┘       └────▲─────┘
     │                  │                   │
     │ 1:N              │ N (items)          │
     │                  └───────────────────┘
     │
     │                  ┌──────────┐
     └──────────1:N─────│  Order   │
                        └────┬─────┘
                             │
                             │ items[] (embedded)
                             └──────────────► Product
```

---

## API Endpoints Summary

### Auth (no JWT required for login)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/login | Body: uid, email, name, photoURL?, role?. Returns **token** + user. |
| GET    | /api/auth/user/:uid | Get user by Firebase UID. |
| GET    | /api/auth/users | Get all users. |

Protected routes below need header: `Authorization: Bearer <token>`.

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | /api/products | No | List products (optional `?active=false` to include inactive). |
| GET    | /api/products/:id | No | Get one product. |
| POST   | /api/products | Admin | Create product (name, price, stock required). |
| PUT    | /api/products/:id | Admin | Update product. |
| PATCH  | /api/products/:id/stock | Admin | Update stock only (no negative). |
| DELETE | /api/products/:id | Admin | Delete product. |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | /api/cart | Yes | Get current user's cart. |
| POST   | /api/cart/items | Yes | Add item: body `{ productId, quantity }`. |
| PUT    | /api/cart/items/:productId | Yes | Update quantity: body `{ quantity }`. |
| DELETE | /api/cart/items/:productId | Yes | Remove item from cart. |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | /api/orders | Yes | Place order from cart. Total calculated on server; stock deducted in a transaction. Optional body: `{ paymentSimulation: 'success' }`. |
| GET    | /api/orders | Yes | My orders; Admin: `?all=true` for all orders. |
| GET    | /api/orders/:id | Yes | Get one order (own or admin). |
| PATCH  | /api/orders/:id/status | Admin | Set status: pending, confirmed, shipped, delivered, cancelled. |
| POST   | /api/orders/:id/cancel | Yes | Customer cancels own order (pending/confirmed). Stock restored; cancellation limit applied. |
| POST   | /api/orders/:id/pay | Yes | Simulate payment (sets paymentStatus to paid). |

---

## Business Rules Implemented

- Customers cannot order more than available stock; validated when adding to cart and again when placing order.
- Order total is always calculated on the backend from current product prices at order time.
- Stock is never set below zero (validated on product update and stock update).
- Stock is deducted only after the order is successfully created (inside a MongoDB transaction).
- Place-order and cancel-order use transactions so that stock and order/cart data stay consistent.
- **Fraud prevention:** Customers are limited to a fixed number of order cancellations (e.g. 3) in the last 30 days; beyond that, cancel is rejected.

---

## Key Architectural Decisions

- **Auth:** Frontend uses Firebase for login; backend stores/updates user in MongoDB and issues a JWT. Protected API routes use this JWT only (no direct Firebase verification on each request), so the backend stays simple and stateless.
- **Order total:** Stored and computed on the server from `priceAtOrder` and quantity per item; client cannot override total.
- **Stock:** Updated only in server-side transactions (place order, cancel order) to avoid race conditions and negative inventory.
- **Order items:** Embedded in the Order document (product ref, productName, quantity, priceAtOrder, subtotal) so history is stable even if product is later changed or removed.
- **Roles:** Stored in User in MongoDB; JWT carries role so admin-only routes can be enforced with a single middleware after `requireAuth`.

---

## Assumptions

- One cart per user; cart is cleared when an order is placed from it.
- Product “delete” is a real delete (not soft delete); optional `isActive` is used to hide products without deleting them.
- Order status flow: pending → confirmed → shipped → delivered; cancelled can be set by customer (with limits) or admin.
- Payment is simulated (e.g. `paymentSimulation: 'success'` or POST pay endpoint); no real payment gateway.
- Admin users are created by setting `role: 'admin'` when registering or via database (e.g. in MongoDB).

---

## HTTP Status Codes

- `200` – Success (GET, PUT, PATCH, DELETE).
- `201` – Created (POST when resource is created).
- `400` – Bad request (validation, business rule violation).
- `401` – Unauthorized (missing or invalid token).
- `403` – Forbidden (e.g. not admin, or cancellation limit exceeded).
- `404` – Resource not found.
- `500` – Server error.

---

## Optional / Bonus Features Included

- **Payment simulation:** Optional `paymentSimulation: 'success'` on place order; separate `POST /api/orders/:id/pay` to mark order as paid.
- **Order status:** pending, confirmed, shipped, delivered, cancelled; admin updates via PATCH status.
- **Transactions:** Place order and cancel order use MongoDB sessions/transactions for consistency.

---

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── middleware/
│   ├── auth.js          # JWT create, requireAuth, requireAdmin
│   └── validate.js      # express-validator result handler
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── server.js
├── .env.example
└── README.md
```

---

For more detail on the frontend (Firebase + how to send the token), see the project’s main setup or frontend docs.
