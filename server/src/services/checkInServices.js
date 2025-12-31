import CheckInModel from '../models/checkInModel.js';

// Service to get today's bookings with customer information
export const getTodayBookingsWithCustomers = async () => {
    const bookings = await CheckInModel.getTodayBookings();

    // Transform to flat structure with each customer as a separate row
    const flatBookings = bookings.map(row => ({
        bookingId: row.bookingId,
        roomId: row.roomId,
        roomNumber: row.roomId, // Add roomNumber field for UI
        roomStatus: row.roomStatus,
        roomType: row.roomType,
        checkInDate: row.checkInDate,
        checkOutDate: row.checkOutDate,
        totalPrice: row.totalPrice,
        citizenId: row.citizenId,
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        address: row.address,
        customerType: row.customerType
    }));

    return {
        success: true,
        count: flatBookings.length,
        data: flatBookings
    };
};

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

// Service to get available rooms
export const getAvailableRooms = async () => {
    const rooms = await CheckInModel.getAvailableRooms();

    return {
        success: true,
        count: rooms.length,
        data: rooms
    };
};

// Service to get maximum guests for a specific room
export const getRoomMaxGuests = async (roomId) => {
    const roomInfo = await CheckInModel.getRoomMaxGuests(roomId);

    if (!roomInfo) {
        return {
            success: false,
            message: 'Room not found',
            data: null
        };
    }

    return {
        success: true,
        data: {
            roomId: roomInfo.RoomID,
            roomType: roomInfo.RoomTypeName,
            maxGuests: roomInfo.MaxGuests,
            status: roomInfo.Status,
            price: roomInfo.Price
        }
    };
};

// Service to search today's reservations
export const searchTodayReservations = async (searchTerm) => {
    const bookings = await CheckInModel.searchTodayBookings(searchTerm);

    // Transform to flat structure with each customer as a separate row
    const flatBookings = bookings.map(row => ({
        bookingId: row.bookingId,
        roomId: row.roomId,
        roomNumber: row.roomId, // Add roomNumber field for UI
        roomStatus: row.roomStatus,
        roomType: row.roomType,
        checkInDate: row.checkInDate,
        checkOutDate: row.checkOutDate,
        totalPrice: row.totalPrice,
        citizenId: row.citizenId,
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        address: row.address,
        customerType: row.customerType
    }));

    return {
        success: true,
        count: flatBookings.length,
        data: flatBookings
    };
};