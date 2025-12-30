import CheckInModel from '../models/checkInModel.js';

// Service to create booking with room status validation
export const createBookingWithValidation = async (bookingData, customersData) => {
    const { roomId } = bookingData;

    // 1. Check room status
    const roomStatus = await CheckInModel.checkRoomStatus(roomId);
    
    if (!roomStatus) {
        throw new Error('Room does not exist');
    }
    
    if (roomStatus.Status !== 'Available') {
        throw new Error(`Room ${roomId} is currently ${roomStatus.Status}, cannot book`);
    }

    // 2. Validate customers data
    if (!Array.isArray(customersData) || customersData.length === 0) {
        throw new Error('At least one customer is required');
    }

    // 3. Create booking
    const booking = await CheckInModel.createBooking(bookingData);

    // 4. Process each customer
    const processedCustomers = [];
    for (const customerData of customersData) {
        const { citizenId } = customerData;
        
        // Check and create customer if needed
        const customerExists = await CheckInModel.checkCustomerExists(citizenId);
        
        if (!customerExists) {
            await CheckInModel.createCustomer(customerData);
        }

        // Create booking detail for each customer
        await CheckInModel.createBookingDetail(booking.bookingId, citizenId);
        
        processedCustomers.push(customerData);
    }

    // 5. Update room status to Occupied
    await CheckInModel.updateRoomStatus(roomId, 'Occupied');

    return {
        success: true,
        message: 'Room booked successfully',
        data: {
            bookingId: booking.bookingId,
            roomId: roomId,
            roomStatus: 'Occupied',
            customers: processedCustomers,
            customerCount: processedCustomers.length,
            booking: bookingData
        }
    };
};