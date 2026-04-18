# 🧺 LaundryPro — Dry Cleaning Order Management System

A full-stack MERN application for managing dry cleaning orders with JWT authentication, real-time dashboard, and complete order lifecycle management.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://laundryf.vercel.app |
| Backend API | https://laundryb.onrender.com |

---

## ✨ Features

- 🔐 **JWT Authentication** — Login / Register with role-based access (Admin / Staff)
- 📊 **Dashboard** — Real-time stats: total orders, revenue, today's orders
- 📋 **Order Management** — Create, view, filter, and update orders
- 👕 **Auto Price Calculation** — Prices auto-calculated from garment type
- 🔄 **Status Tracking** — RECEIVED → PROCESSING → READY → DELIVERED
- 🔍 **Smart Filters** — Search by name/phone, filter by status or garment type
- 📱 **Responsive UI** — Dark theme, works on all screen sizes

---

## 🛠 Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcryptjs | Authentication |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Tech | Purpose |
|------|---------|
| React.js + Vite | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Context API | Auth state management |
| Plain CSS | Styling (dark theme) |

---

## 📁 Project Structure

```
laundry/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── orders.js
│   │   │   └── dashboard.js
│   │   └── constants/prices.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── Loader.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Orders.jsx
    │   │   ├── CreateOrder.jsx
    │   │   └── OrderDetail.jsx
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally
- Git

### 1. Clone the repo

```bash
git clone https://github.com/AryanGupta09/Laundryb.git
git clone https://github.com/AryanGupta09/laundryf.git
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/laundry-db
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=laundry_jwt_secret_key_2024
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:3000
```

---

## 🔑 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |
| GET | `/api/auth/me` | Get logged-in user |

### Orders (Protected 🔒)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get all orders (with filters) |
| GET | `/api/orders/:id` | Get single order by orderId |
| PATCH | `/api/orders/:id/status` | Update order status |

### Dashboard (Protected 🔒)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get stats & analytics |

### Query Filters for GET /api/orders
```
?status=READY        → filter by status
?search=Rahul        → search by name or phone
?garment=Saree       → filter by garment type
```

---

## 👕 Garment Prices

| Garment | Price |
|---------|-------|
| Shirt | ₹50 |
| Pants | ₹60 |
| Saree | ₹120 |
| Jacket | ₹150 |
| Kurta | ₹70 |
| Suit | ₹250 |

---

## 🔐 Auth Flow

```
Register → Login → JWT Token
    ↓
Token saved in localStorage
    ↓
Every API request → Authorization: Bearer <token>
    ↓
401 response → Auto logout → Redirect to /login
```

---

## 📦 Order Status Flow

```
RECEIVED → PROCESSING → READY → DELIVERED
```

---

## 🌍 Deployment

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Database | MongoDB Atlas | 512MB |
| Backend | Render | Yes (sleeps after 15min) |
| Frontend | Vercel | Unlimited |

### Deploy Backend (Render)
```
Root Directory : backend
Build Command  : npm install
Start Command  : npm start

Environment Variables:
  MONGO_URI    = mongodb+srv://...
  JWT_SECRET   = your_secret_key
  NODE_ENV     = production
  FRONTEND_URL = https://your-app.vercel.app
```

### Deploy Frontend (Vercel)
```
Root Directory   : frontend
Build Command    : npm run build
Output Directory : dist

Environment Variables:
  VITE_API_URL = https://your-backend.onrender.com/api
```

---

## 🧪 Testing with Postman

Import `backend/laundry-api.postman_collection.json` into Postman.

**Steps:**
1. Register a user → `POST /api/auth/register`
2. Login → `POST /api/auth/login` → copy the token
3. Add header to all requests: `Authorization: Bearer <token>`
4. Create orders, view dashboard, update status

---

## 👨‍💻 Developer

**Aryan Gupta**
- GitHub: [@AryanGupta09](https://github.com/AryanGupta09)

---

## 📄 License

MIT License — free to use and modify.
