import express from 'express';
import cors from 'cors';
import orderRoutes from './src/routes/orders.js';
import dashboardRoutes from './src/routes/dashboard.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

// ── CORS ────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ── Middleware ──────────────────────────────────────────
app.use(express.json());

// ── Root route ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Laundry API running', version: '1.0.0' });
});

// ── API Routes ──────────────────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found` });
});

// ── Global Error Handler (must be last) ─────────────────
app.use(errorHandler);

export default app;
