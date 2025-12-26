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
