import express from 'express';
import { 
    getSettings, updateSurcharge, resetSurcharge, 
    getAccounts, deleteAccount 
} from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/surcharge', updateSurcharge);
router.post('/surcharge/reset', resetSurcharge);

router.get('/accounts', getAccounts);
router.delete('/accounts/:username', deleteAccount);

export default router;