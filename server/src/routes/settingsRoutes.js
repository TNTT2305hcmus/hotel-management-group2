import express from 'express';
import { getSettings, updateSurcharge, resetSurcharge } from '../controllers/settingsController.js';

const router = express.Router();

// GET /api/settings - Get surcharge regulations and receptionist count
router.get('/', getSettings);

// PUT /api/settings/surcharge - Update surcharge regulations
router.put('/surcharge', updateSurcharge);

// POST /api/settings/surcharge/reset - Reset surcharge to default values
router.post('/surcharge/reset', resetSurcharge);

export default router;