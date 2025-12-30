import * as CheckInService from '../services/checkInServices.js';

// Controller to get today's bookings
export const getTodayBookings = async (req, res) => {
    try {
        const result = await CheckInService.getTodayBookingsWithCustomers();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting today bookings:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error when getting today bookings',
            error: error.message
        });
    }
};

// Controller to create booking
export const createBooking = async (req, res) => {
    try {
        const {
            roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
            customers
        } = req.body;

        // Basic validation
        if (!roomId || !checkInDate || !customers) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: roomId, checkInDate, customers'
            });
        }

        // Validate customers array
        if (!Array.isArray(customers) || customers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'customers must be a non-empty array'
            });
        }

        // Validate each customer has required citizenId
        for (let i = 0; i < customers.length; i++) {
            if (!customers[i].citizenId) {
                return res.status(400).json({
                    success: false,
                    message: `Customer at index ${i} is missing required field: citizenId`
                });
            }
        }

        // Prepare booking data
        const bookingData = {
            roomId,
            checkInDate,
            checkOutDate: checkOutDate || null,
            totalPrice: totalPrice || 0
        };

        // Prepare customers data with defaults
        const customersData = customers.map(customer => ({
            citizenId: customer.citizenId,
            customerTypeId: customer.customerTypeId || 1, // Default: Domestic
            fullName: customer.fullName,
            phoneNumber: customer.phoneNumber,
            address: customer.address
        }));

        // Call service to create booking
        const result = await CheckInService.createBookingWithValidation(bookingData, customersData);

        res.status(201).json(result);

    } catch (error) {
        console.error('Error creating booking:', error.message);
        
        // Handle different types of errors
        if (error.message.includes('cannot book') || 
            error.message.includes('does not exist') ||
            error.message.includes('At least one customer')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error when creating booking',
            error: error.message
        });
    }
};