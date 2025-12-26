# Check-in API Documentation

## 1. Get Unpaid Check-ins

```http
GET /check-in/unpaid
```

**Description:** Get list of all unpaid check-ins (bookings where PaymentDate IS NULL). Returns only customer name and room number.

**Response:**

```json
{
  "data": [
    {
      "fullName": "Michael Johnson",
      "roomNumber": "101"
    },
    {
      "fullName": "Sarah Williams",
      "roomNumber": "201"
    }
  ]
}
```

**Response Fields:**

- `fullName`: Customer's full name
- `roomNumber`: Room number (as string)

**Error Responses:**

- `500 Internal Server Error`: Server error occurred
  ```json
  {
    "message": "Server Error",
    "error": "Error message details"
  }
  ```

---

## 2. Search Unpaid Check-ins

```http
GET /check-in/unpaid/search?q={searchTerm}
```

**Description:** Search unpaid check-ins by customer name or room number. Returns only customer name and room number.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | String | Yes | Search term (customer name or room number) |

**Examples:**

- `/check-in/unpaid/search?q=Michael` - Search by customer name
- `/check-in/unpaid/search?q=101` - Search by room number
- `/check-in/unpaid/search?q=John` - Partial name search

**Response:**

```json
{
  "data": [
    {
      "fullName": "Michael Johnson",
      "roomNumber": "101"
    },
    {
      "fullName": "John Smith",
      "roomNumber": "102"
    }
  ]
}
```

**Response Fields:**

- `fullName`: Customer's full name
- `roomNumber`: Room number (as string)

**Error Responses:**

- `400 Bad Request`: Search term is missing or empty
  ```json
  {
    "message": "Search term is required",
    "error": "Query parameter 'q' cannot be empty"
  }
  ```
- `500 Internal Server Error`: Server error occurred
  ```json
  {
    "message": "Server Error",
    "error": "Error message details"
  }
  ```

**Notes:**

- Search is case-insensitive
- Supports partial matching (LIKE query)
- Only returns unpaid bookings (PaymentDate IS NULL)
- Results are ordered by check-in date (most recent first)

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Search term is required",
  "error": "Query parameter 'q' cannot be empty"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server Error",
  "error": "Error message details"
}
```

## 3. Create Booking

```http
POST /api/bookings

```

**Description:** Create a new booking transaction. This API automatically handles creating or updating customer information (including phone number), calculating total price, creating booking details, and updating room status to 'Occupied'.

**Request Body:**

```json
{
  "roomId": 101,
  "checkInDate": "2025-12-24",
  "checkOutDate": "2025-12-26",
  "guests": [
    {
      "fullName": "Nguyen Van A",
      "citizenId": "079200012345",
      "customerTypeId": 1,
      "phoneNumber": "0909123456",
      "address": "123 Street, City"
    },
    {
      "fullName": "Le Thi B",
      "citizenId": "079200098765",
      "customerTypeId": 1,
      "address": "456 Avenue"
    }
  ]
}
```

**Response:**

```json
{
  "bookingId": 15,
  "totalPrice": 1000000,
  "status": "Success"
}
```

**Response Fields:**

- `bookingId`: The unique ID generated for this booking
- `totalPrice`: Total calculated cost (Price per night \* Number of nights)
- `status`: Transaction status message

**Error Responses:**

- `400 Bad Request`: Missing required fields (Room ID, Check-in Date, or Guest List)

```json
{
  "message": "Missing required fields: Room ID, Check-in Date, or Guest List."
}
```

- `500 Internal Server Error`: Server error, invalid Room ID, or transaction failed

```json
{
  "message": "Server Error during booking creation",
  "error": "Error message details"
}
```
