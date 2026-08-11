
const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGO_URL;
const connectDB = require("../src/lib/db");
const userRouter = require("./routers/auth.router");
const problemRouter = require("./routers/problem.router");
const cors = require("cors");
const app = express();

// Connection with DB
connectDB(URL).then(() => {
  console.log("mongoDB connected!");
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});

// Security headers
app.use(helmet());

// Body parsing
app.use(express.json());

// CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any localhost or 127.0.0.1 origin in development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Allow the configured CLIENT_URL (production)
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Global rate limiter — 150 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/user', userRouter);
app.use('/problem', problemRouter);

// Global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[Error] ${err.name}: ${err.message}`);
  }
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err.message);
  process.exit(1);
});