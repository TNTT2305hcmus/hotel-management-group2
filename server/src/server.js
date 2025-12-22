import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';

import { connectDB } from './config/database.js'; 
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

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
app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING - HOTEL MANAGEMENT API');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Room Routes
app.use('/api/rooms', roomRoutes);

// 4. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});