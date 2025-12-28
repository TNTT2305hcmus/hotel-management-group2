import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from './routes/userRoutes.js';
// Load environment variables at the very beginning
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Routes
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING - HOTEL MANAGEMENT API");
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Room Routes
app.use("/api/rooms", roomRoutes);

//Setting Routes
app.use("/api/settings", settingsRoutes);

// Check-in Routes
app.use("/api/check-in", checkInRoutes);

//Booking Routes
app.use("/api/bookings", bookingRoutes);

// User Profile
app.use('/api/users', userRoutes);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
