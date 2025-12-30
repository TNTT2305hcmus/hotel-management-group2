# CHECK-IN API DOCUMENTATION

This document describes the Check-in API endpoints for the Hotel Management System.

## Base URL
```
http://localhost:5000/api/check-in
```

## Authentication
All endpoints require Bearer token authentication.

---

## Endpoints

### 1. Get Today's Bookings

**Endpoint:** `GET /today`  
**Description:** Get all bookings with customer information for today  
**Authentication:** Required

#### Success Response (200 OK)
```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "bookingId": 6,
            "roomId": 101,
            "roomStatus": "Occupied",
            "roomType": "Single Room",
            "checkInDate": "2025-12-30T07:00:00.000Z",
            "checkOutDate": "2025-12-31T04:00:00.000Z",
            "totalPrice": 500000,
            "customers": [
                {
                    "citizenId": "123456789000",
                    "fullName": "Nguyễn Văn A",
                    "phoneNumber": "0901234567",
                    "address": "123 Lê Lợi, Q1, TP.HCM",
                    "customerType": "Domestic"
                }
            ]
        },
        {
            "bookingId": 7,
            "roomId": 102,
            "roomStatus": "Occupied",
            "roomType": "Single Room",
            "checkInDate": "2025-12-30T08:00:00.000Z",
            "checkOutDate": "2026-01-02T04:00:00.000Z",
            "totalPrice": 1000000,
            "customers": [
                {
                    "citizenId": "111222333444",
                    "fullName": "Nguyễn Văn B",
                    "phoneNumber": "0901111111",
                    "address": "456 Trần Hưng Đạo, Q1, TP.HCM",
                    "customerType": "Domestic"
                },
                {
                    "citizenId": "555666777888",
                    "fullName": "Trần Thị C",
                    "phoneNumber": "0902222222",
                    "address": "789 Lý Tự Trọng, Q1, TP.HCM",
                    "customerType": "Domestic"
                },
                {
                    "citizenId": "999000111222",
                    "fullName": "John Smith",
                    "phoneNumber": "0903333333",
                    "address": "123 Main St, New York, USA",
                    "customerType": "Foreign"
                }
            ]
        }
    ]
}
```

#### Error Response (500 Internal Server Error)
```json
{
    "success": false,
    "message": "Server error when getting today bookings",
    "error": "Database connection failed"
}
```

---

### 2. Create Booking

**Endpoint:** `POST /booking`  
**Description:** Create a new booking with room status validation  
**Authentication:** Required

#### Request Body
```json
{
    "roomId": 101,
    "checkInDate": "2025-12-30 14:00:00",
    "checkOutDate": "2025-12-31 11:00:00",
    "totalPrice": 500000,
    "customers": [
        {
            "citizenId": "123456789000",
            "customerTypeId": 1,
            "fullName": "Nguyễn Văn A",
            "phoneNumber": "0901234567",
            "address": "123 Lê Lợi, Q1, TP.HCM"
        },
        {
            "citizenId": "111222333444",
            "customerTypeId": 2,
            "fullName": "John Smith",
            "phoneNumber": "0901111111",
            "address": "456 Main Street, New York, USA"
        }
    ]
}
```

#### Required Fields
- `roomId` (integer): Room ID to book
- `checkInDate` (string): Check-in date in YYYY-MM-DD HH:mm:ss format
- `customers` (array): Array of customer objects (minimum 1)
- `customers[].citizenId` (string): Customer's citizen ID

#### Optional Fields
- `checkOutDate` (string): Check-out date
- `totalPrice` (number): Total booking price (default: 0)
- `customers[].customerTypeId` (integer): Customer type (default: 1 - Domestic)
- `customers[].fullName` (string): Customer's full name
- `customers[].phoneNumber` (string): Customer's phone number
- `customers[].address` (string): Customer's address

#### Success Response (201 Created)
```json
{
    "success": true,
    "message": "Room booked successfully",
    "data": {
        "bookingId": 6,
        "roomId": 101,
        "roomStatus": "Occupied",
        "customers": [
            {
                "citizenId": "123456789000",
                "customerTypeId": 1,
                "fullName": "Nguyễn Văn A",
                "phoneNumber": "0901234567",
                "address": "123 Lê Lợi, Q1, TP.HCM"
            },
            {
                "citizenId": "111222333444",
                "customerTypeId": 2,
                "fullName": "John Smith",
                "phoneNumber": "0901111111",
                "address": "456 Main Street, New York, USA"
            }
        ],
        "customerCount": 2,
        "booking": {
            "roomId": 101,
            "checkInDate": "2025-12-30 14:00:00",
            "checkOutDate": "2025-12-31 11:00:00",
            "totalPrice": 500000
        }
    }
}
```

#### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
    "success": false,
    "message": "Missing required fields: roomId, checkInDate, customers"
}
```

**400 Bad Request - Invalid Customers Array**
```json
{
    "success": false,
    "message": "customers must be a non-empty array"
}
```

**400 Bad Request - Missing Customer CitizenID**
```json
{
    "success": false,
    "message": "Customer at index 0 is missing required field: citizenId"
}
```

**400 Bad Request - No Customers**
```json
{
    "success": false,
    "message": "At least one customer is required"
}
```

**400 Bad Request - Room Not Available**
```json
{
    "success": false,
    "message": "Room 103 is currently Occupied, cannot book"
}
```

**400 Bad Request - Room Does Not Exist**
```json
{
    "success": false,
    "message": "Room does not exist"
}
```

**500 Internal Server Error**
```json
{
    "success": false,
    "message": "Server error when creating booking",
    "error": "Database connection failed"
}
```

---

## Business Logic

### Booking Creation Process
1. **Room Status Validation**: Check if room exists and has 'Available' status
2. **Customers Validation**: Validate customers array (minimum 1 customer required)
3. **Booking Creation**: Insert new booking record
4. **Customer Processing**: For each customer:
   - Check if customer exists, create new one if needed
   - Create booking detail linking customer to booking
5. **Room Status Update**: Change room status from 'Available' to 'Occupied'

### Multiple Customers Support
- One booking can have multiple customers (group booking)
- Each customer is linked to the booking via `BOOKING_DETAIL` table
- All customers share the same room and booking dates
- Customer validation and creation is done individually for each customer

### Room Status Values
- `Available`: Room can be booked
- `Occupied`: Room is currently booked
- `Maintenance`: Room is under maintenance

### Customer Types
- `1`: Domestic
- `2`: Foreign

---

## Database Tables Affected
- `BOOKING`: New booking record created
- `BOOKING_DETAIL`: Links customer to booking
- `CUSTOMER`: New customer created if not exists
- `ROOM`: Status updated to 'Occupied'

---

## Testing
Use the test file: `src/test/checkin.rest` for API testing with various scenarios including:
- Single customer booking
- Multiple customers booking (group booking)
- Booking occupied room (should fail)
- Booking with existing customer
- Missing data validation
- Empty customers array validation
- Non-existent room validation