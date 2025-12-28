import express from "express";
import { getUnpaidCheckIns, 
        searchUnpaidCheckInsController,
        getTodayReservations, 
        searchTodayReservationsController
} from "../controllers/checkInController.js";

const router = express.Router();

router.get("/today-reservations", getTodayReservations);
router.get("/today-reservations/search", searchTodayReservationsController);

// Get list of unpaid check-ins (PaymentDate = NULL)
router.get("/unpaid", getUnpaidCheckIns);

// Search unpaid check-ins by customer name or room name
router.get("/unpaid/search", searchUnpaidCheckInsController);

export default router;
