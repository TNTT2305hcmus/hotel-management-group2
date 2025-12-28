import { fetchUnpaidCheckIns, searchUnpaidCheckIns } from "../services/checkInServices.js";

// GET /api/check-in/unpaid
export const getUnpaidCheckIns = async (req, res) => {
  try {
    const data = await fetchUnpaidCheckIns();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Get unpaid check-ins error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/check-in/unpaid/search?q=searchTerm
export const searchUnpaidCheckInsController = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === "") {
      return res.status(400).json({ 
        message: "Search term is required", 
        error: "Query parameter 'q' cannot be empty" 
      });
    }

    const data = await searchUnpaidCheckIns(q.trim());
    res.status(200).json({ data });
  } catch (error) {
    console.error("Search unpaid check-ins error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/check-in/today-reservations
export const getTodayReservations = async (req, res) => {
  try {
    const data = await CheckInModel.getTodayReservations();
    res.status(200).json({ success: true, data }); // Trả về format { success, data } chuẩn
  } catch (error) {
    console.error("Get today reservations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/check-in/today-reservations/search
export const searchTodayReservationsController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Query required" });

    const data = await CheckInModel.searchTodayReservations(q);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};