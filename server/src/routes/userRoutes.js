import express from 'express';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();
router.get('/:username', getUserProfile);

export default router;