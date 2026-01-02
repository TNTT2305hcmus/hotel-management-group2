import { createBookingService } from '../services/bookingServices.js';

export const createBooking = async (req, res) => {
    try {
        // Get data from Frontend request
        const { roomId, checkInDate, checkOutDate, guests } = req.body;

        // Basic Validation
        if (!roomId || !checkInDate || !guests || guests.length === 0) {
            return res.status(400).json({ 
                message: 'Missing required fields: Room ID, Check-in Date, or Guest List.' 
            });
        }

        // Call Service
        const result = await createBookingService({ 
            roomId, 
            checkInDate, 
            checkOutDate, 
            guests: customers 
        });

        res.status(201).json(result);

    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ 
            message: 'Server Error during booking creation', 
            error: error.message 
        });
    }
};