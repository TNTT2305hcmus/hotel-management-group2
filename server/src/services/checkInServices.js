import CheckInModel from "../models/checkInModel.js";

// Get list of unpaid check-ins (PaymentDate = NULL)
export const fetchUnpaidCheckIns = async () => {
  const rows = await CheckInModel.findUnpaidCheckIns();
  return rows;
};

// Search unpaid check-ins by customer name or room name
export const searchUnpaidCheckIns = async (searchTerm) => {
  const rows = await CheckInModel.searchUnpaidCheckIns(searchTerm);
  return rows;
};
