import { axiosClient } from "../api/axiosClient";

/**
 * Check-in Service - Client API
 * Based on API-CHECKIN.md documentation
 */

// ============================================
// 1. GET UNPAID CHECK-INS
// GET /check-in/unpaid
// ============================================
/**
 * Get list of all unpaid check-ins (bookings where PaymentDate IS NULL)
 * @returns {Promise<{success: boolean, data: Array<{fullName: string, roomNumber: string}>, message?: string}>}
 */
export const fetchUnpaidCheckInsAPI = async () => {
    try {
        const response = await axiosClient.get('/api/check-in/unpaid');
        return {
            success: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("API Error (Unpaid Check-ins):", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Failed to load unpaid check-ins"
        };
    }
};

// ============================================
// 2. SEARCH UNPAID CHECK-INS
// GET /check-in/unpaid/search?q={searchTerm}
// ============================================
/**
 * Search unpaid check-ins by customer name or room number
 * @param {string} searchTerm - Search term (customer name or room number)
 * @returns {Promise<{success: boolean, data: Array<{fullName: string, roomNumber: string}>, message?: string}>}
 */
export const searchUnpaidCheckInsAPI = async (searchTerm) => {
    try {
        if (!searchTerm || searchTerm.trim() === "") {
            return {
                success: false,
                data: [],
                message: "Search term is required"
            };
        }

        const response = await axiosClient.get('/api/check-in/unpaid/search', {
            params: { q: searchTerm.trim() }
        });
        return {
            success: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("API Error (Search Unpaid Check-ins):", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Search failed"
        };
    }
};

// ============================================
// 3. CREATE BOOKING
// POST /api/check-in/booking
// ============================================
/**
 * Create a new booking transaction
 * Automatically handles: creating/updating customer info, calculating total price,
 * creating booking details, and updating room status to 'Occupied'
 * 
 * @param {Object} bookingData - Booking information
 * @param {number} bookingData.roomId - Room ID
 * @param {string} bookingData.checkInDate - Check-in date (YYYY-MM-DD HH:mm:ss)
 * @param {string} bookingData.checkOutDate - Check-out date (YYYY-MM-DD HH:mm:ss)
 * @param {number} [bookingData.totalPrice] - Total price (optional)
 * @param {Array<Object>} bookingData.customers - List of customers
 * @param {string} bookingData.customers[].fullName - Customer's full name
 * @param {string} bookingData.customers[].citizenId - Customer's citizen ID
 * @param {number} [bookingData.customers[].customerTypeId] - Customer type ID (1: Domestic, 2: Foreign)
 * @param {string} [bookingData.customers[].phoneNumber] - Customer's phone number (optional)
 * @param {string} [bookingData.customers[].address] - Customer's address (optional)
 * 
 * @returns {Promise<{success: boolean, data?: {bookingId: number, roomStatus: string, customerCount: number}, message?: string}>}
 */
export const createBookingAPI = async (bookingData) => {
    try {
        const { roomId, checkInDate, checkOutDate, totalPrice, customers } = bookingData;

        // Validate required fields
        if (roomId === undefined || roomId === null || roomId === '') {
            return {
                success: false,
                message: "Missing required field: roomId"
            };
        }
        if (!checkInDate) {
            return {
                success: false,
                message: "Missing required field: checkInDate"
            };
        }
        if (!customers || !Array.isArray(customers) || customers.length === 0) {
            return {
                success: false,
                message: "customers must be a non-empty array"
            };
        }

        // Validate each customer has required fields
        for (let i = 0; i < customers.length; i++) {
            if (!customers[i].citizenId) {
                return {
                    success: false,
                    message: `Customer at index ${i} is missing required field: citizenId`
                };
            }
        }

        // Format request body according to API spec
        const requestBody = {
            roomId: Number(roomId),
            checkInDate,
            checkOutDate,
            totalPrice: totalPrice || 0,
            customers: customers.map(customer => ({
                fullName: customer.fullName || '',
                citizenId: customer.citizenId,
                customerTypeId: customer.customerTypeId || 1,
                phoneNumber: customer.phoneNumber || customer.phone || '',
                address: customer.address || ''
            }))
        };

        const response = await axiosClient.post('/api/check-in/booking', requestBody);

        return {
            success: true,
            data: {
                bookingId: response.data?.data?.bookingId,
                roomStatus: response.data?.data?.roomStatus,
                customerCount: response.data?.data?.customerCount
            }
        };
    } catch (error) {
        console.error("API Error (Create Booking):", error);
        console.error("Error Response:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create booking"
        };
    }
};

// ============================================
// ADDITIONAL HELPER APIs (Not in API-CHECKIN.md but needed for UI)
// ============================================

/**
 * Get list of available rooms for check-in
 * GET /api/check-in/rooms/available
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export const fetchAvailableRoomsAPI = async () => {
    try {
        const response = await axiosClient.get('/api/check-in/rooms/available');
        return { success: true, data: response.data?.data || [] };
    } catch (error) {
        console.error("API Error (Available Rooms):", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Failed to load available rooms"
        };
    }
};

/**
 * Get room details including maxGuests by room ID
 * GET /api/check-in/room/:maphong
 * @param {number} maphong - Room ID
 * @returns {Promise<{success: boolean, data: Object|null, message?: string}>}
 */
export const fetchRoomMaxGuestsAPI = async (maphong) => {
    try {
        if (!maphong) {
            return {
                success: false,
                data: null,
                message: "Room ID is required"
            };
        }
        const response = await axiosClient.get(`/api/check-in/room/${maphong}`);
        return { success: true, data: response.data?.data };
    } catch (error) {
        console.error("API Error (Room Max Guests):", error);
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Failed to load room details"
        };
    }
};

/**
 * Get today's reservations (for Today's Reservation table)
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export const fetchTodayReservationsAPI = async () => {
    try {
        const response = await axiosClient.get('/api/check-in/today-reservations');
        return {
            success: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("API Error (Today Reservations):", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Failed to load today's reservations"
        };
    }
};

/**
 * Search today's reservations by guest name or room number
 * @param {string} searchTerm - Search term
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export const searchTodayReservationsAPI = async (searchTerm) => {
    try {
        const response = await axiosClient.get('/api/check-in/today-reservations/search', {
            params: { q: searchTerm }
        });
        return {
            success: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("API Error (Search Today Reservations):", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Search failed"
        };
    }
};

/**
 * Check-in from an existing reservation
 * @param {number} bookingId - Booking ID
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
export const checkInFromReservationAPI = async (bookingId) => {
    try {
        const response = await axiosClient.post('/api/check-in/from-reservation', { bookingId });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("API Error (Check-in from Reservation):", error);
        return {
            success: false,
            message: error.response?.data?.message || "Check-in failed"
        };
    }
};

// ============================================
// LEGACY ALIASES (for backward compatibility)
// ============================================
export const createCheckInAPI = createBookingAPI;
export const fetchRoomForCheckInAPI = fetchRoomMaxGuestsAPI;
