import express from 'express';
import { 
    getOverviewReport, 
    getRevenueReport, 
    getDensityReport 
} from '../controllers/reportController.js';

const router = express.Router();

// GET /api/report/overview?month=12&year=2025
router.get('/overview', getOverviewReport);

// GET /api/report/revenue?month=12&year=2025
router.get('/revenue', getRevenueReport);

// GET /api/report/bookings?month=12&year=2025
router.get('/bookings', getDensityReport);

export default router;