# Hotel Management API Documentation

## Base URL
```
http://localhost:8888/api
```

## Authentication
All endpoints except `/auth/login` and `/auth/register` require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication

### 1.1 Register Manager
```http
POST /auth/register
```
**Body:**
```json
{
  "Username": "string (max 45 chars)",
  "Password": "string (max 45 chars)",
  "MaSoLoai": 1
}
```
**Note:** MaSoLoai: 1 = Manager, 2 = Employee

**Response:** `200 OK`

### 1.2 Login
```http
POST /auth/login
```
**Body:**
```json
{
  "Username": "string",
  "Password": "string"
}
```
**Response:**
```json
{
  "token": "jwt_token_string",
  "MaSoLoai": 1,
  "TenLoai": "Manager" | "Employee"
}
```

---

## 2. Room Management (BM1 - Danh Mục Phòng)

### 2.1 Get All Rooms
```http
GET /rooms
```
**Response:**
```json
[
  {
    "MaPhong": 1,
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "TinhTrang": "Trống" | "Đã thuê" | "Bảo trì",
    "GhiChu": "string (max 100 chars)"
  }
]
```

### 2.2 Create Room
```http
POST /rooms
```
**Body:**
```json
{
  "MaLoaiPhong": 1,
  "TinhTrang": "Trống",
  "GhiChu": "string (optional)"
}
```
**Response:** `201 Created`

### 2.3 Update Room
```http
PUT /rooms/:MaPhong
```
**Body:**
```json
{
  "MaLoaiPhong": 1,
  "TinhTrang": "Trống" | "Đã thuê" | "Bảo trì",
  "GhiChu": "string (optional)"
}
```
**Response:** `200 OK`

### 2.4 Delete Room
```http
DELETE /rooms/:MaPhong
```
**Response:** `200 OK`

### 2.5 Get Room Status (BM3 - Danh Sách Phòng)
```http
GET /rooms/status
```
**Response:**
```json
[
  {
    "MaPhong": 1,
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "TinhTrang": "Trống" | "Đã thuê" | "Bảo trì"
  }
]
```

### 2.6 Search/Lookup Rooms
```http
GET /rooms/search
```
**Query Parameters:**
- `MaLoaiPhong` (optional): Filter by room type (1, 2, 3)
- `TinhTrang` (optional): Filter by status ("Trống", "Đã thuê", "Bảo trì")
- `DonGiaMin` (optional): Minimum price
- `DonGiaMax` (optional): Maximum price
- `MaPhong` (optional): Search by specific room number

**Examples:**
- `/rooms/search?TinhTrang=Trống` - Get all available rooms
- `/rooms/search?MaLoaiPhong=1&TinhTrang=Trống` - Get available rooms of type A
- `/rooms/search?DonGiaMin=150000&DonGiaMax=180000` - Get rooms in price range
- `/rooms/search?MaPhong=101` - Get specific room by number

**Response:**
```json
[
  {
    "MaPhong": 1,
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "TinhTrang": "Trống",
    "GhiChu": "string",
    "SoLuongKhachToiDa": 3
  }
]
```

### 2.7 Get Available Rooms
```http
GET /rooms/available
```
**Description:** Shortcut to get all rooms with TinhTrang = "Trống"

**Response:**
```json
[
  {
    "MaPhong": 1,
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "SoLuongKhachToiDa": 3,
    "GhiChu": "string"
  }
]
```

### 2.8 Get Room by ID
```http
GET /rooms/:MaPhong
```
**Response:**
```json
{
  "MaPhong": 1,
  "MaLoaiPhong": 1,
  "TenLoaiPhong": "Loại A",
  "DonGia": 150000,
  "TinhTrang": "Trống",
  "GhiChu": "string",
  "SoLuongKhachToiDa": 3,
  "currentRental": {
    "MaPhieuThue": 1,
    "NgayBatDau": "2025-12-15T14:00:00",
    "SoKhach": 2
  }
}
```
**Note:** `currentRental` is null if room is not currently rented

---

## 3. Customer Management

### 3.1 Get All Customers
```http
GET /customers
```
**Response:**
```json
[
  {
    "CCCD": "123456789012",
    "TenKhachHang": "string (max 45 chars)",
    "MaLoaiKhachHang": 1,
    "TenLoaiKhach": "Nội địa" | "Nước ngoài",
    "DiaChi": "string (max 100 chars)"
  }
]
```

### 3.2 Create Customer
```http
POST /customers
```
**Body:**
```json
{
  "CCCD": "string (12 chars)",
  "TenKhachHang": "string (max 45 chars)",
  "MaLoaiKhachHang": 1,
  "DiaChi": "string (max 100 chars)"
}
```
**Note:** MaLoaiKhachHang: 1 = Nội địa, 2 = Nước ngoài

**Response:** `201 Created`

### 3.3 Update Customer
```http
PUT /customers/:CCCD
```
**Body:**
```json
{
  "TenKhachHang": "string (max 45 chars)",
  "MaLoaiKhachHang": 1,
  "DiaChi": "string (max 100 chars)"
}
```
**Response:** `200 OK`

### 3.4 Delete Customer
```http
DELETE /customers/:CCCD
```
**Response:** `200 OK`

---

## 4. Rental Management (BM2 - Phiếu Thuê Phòng)

### 4.1 Create Rental
```http
POST /rentals
```
**Body:**
```json
{
  "MaPhong": 1,
  "NgayBatDau": "2025-12-15T14:00:00",
  "customers": [
    {
      "CCCD": "123456789012",
      "TenKhachHang": "string (max 45 chars)",
      "MaLoaiKhachHang": 1,
      "DiaChi": "string (max 100 chars)"
    }
  ]
}
```
**Validation:**
- Maximum 3 customers per room (QD2)
- Room TinhTrang must be "Trống"

**Response:** 
```json
{
  "MaPhieuThue": 1,
  "message": "Rental created successfully"
}
```

### 4.2 Get Active Rentals
```http
GET /rentals/active
```
**Response:**
```json
[
  {
    "MaPhieuThue": 1,
    "MaPhong": 1,
    "NgayBatDau": "2025-12-15T14:00:00",
    "NgayKetThuc": null,
    "customers": [
      {
        "CCCD": "123456789012",
        "TenKhachHang": "string",
        "MaLoaiKhachHang": 1,
        "TenLoaiKhach": "Nội địa",
        "DiaChi": "string"
      }
    ]
  }
]
```

### 4.3 Get Rental by ID
```http
GET /rentals/:MaPhieuThue
```
**Response:**
```json
{
  "MaPhieuThue": 1,
  "MaPhong": 1,
  "MaLoaiPhong": 1,
  "TenLoaiPhong": "Loại A",
  "DonGia": 150000,
  "NgayBatDau": "2025-12-15T14:00:00",
  "NgayKetThuc": null,
  "customers": [
    {
      "CCCD": "123456789012",
      "TenKhachHang": "string",
      "MaLoaiKhachHang": 1,
      "TenLoaiKhach": "Nội địa",
      "DiaChi": "string"
    }
  ]
}
```

---

## 5. Billing & Payment (BM4 - Hóa Đơn Thanh Toán)

### 5.1 Create Invoice / Complete Rental
```http
POST /invoices
```
**Body:**
```json
{
  "MaPhieuThue": 1,
  "NgayKetThuc": "2025-12-18T12:00:00"
}
```

**Calculation Logic (QD4):**
- Base DonGia for 2 customers
- 3rd customer: +25% surcharge
- If any customer is foreign (MaLoaiKhachHang = 2): total price × 1.5
- ThanhTien = DonGia × days × customer_multiplier × foreign_multiplier

**Response:**
```json
{
  "MaPhieuThue": 1,
  "MaPhong": 1,
  "NgayBatDau": "2025-12-15T14:00:00",
  "NgayKetThuc": "2025-12-18T12:00:00",
  "NgayThanhToan": "2025-12-18T12:00:00",
  "ThanhTien": 450000,
  "SoNgayThue": 3,
  "DonGia": 150000,
  "SoKhach": 2
}
```

### 5.2 Get Invoice by ID
```http
GET /invoices/:MaPhieuThue
```
**Response:**
```json
{
  "MaPhieuThue": 1,
  "MaPhong": 1,
  "TenLoaiPhong": "Loại A",
  "DonGia": 150000,
  "NgayBatDau": "2025-12-15T14:00:00",
  "NgayKetThuc": "2025-12-18T12:00:00",
  "NgayThanhToan": "2025-12-18T12:00:00",
  "ThanhTien": 450000,
  "SoNgayThue": 3,
  "customers": [
    {
      "CCCD": "123456789012",
      "TenKhachHang": "string",
      "TenLoaiKhach": "Nội địa"
    }
  ]
}
```

### 5.3 Get All Invoices
```http
GET /invoices
```
**Query Parameters:**
- `startDate` (optional): filter by NgayThanhToan date range
- `endDate` (optional): filter by NgayThanhToan date range

---

## 6. Reports

### 6.1 Revenue Report by Room Type (BM5.1)
```http
GET /reports/revenue
```
**Query Parameters:**
- `month`: 1-12
- `year`: YYYY

**Response:**
```json
{
  "Thang": 12,
  "Nam": 2025,
  "data": [
    {
      "MaLoaiPhong": 1,
      "TenLoaiPhong": "Loại A",
      "DoanhThu": 15000000,
      "TyLe": 35.5
    },
    {
      "MaLoaiPhong": 2,
      "TenLoaiPhong": "Loại B",
      "DoanhThu": 12000000,
      "TyLe": 28.4
    },
    {
      "MaLoaiPhong": 3,
      "TenLoaiPhong": "Loại C",
      "DoanhThu": 15250000,
      "TyLe": 36.1
    }
  ],
  "TongDoanhThu": 42250000
}
```

### 6.2 Room Occupancy Report (BM5.2)
```http
GET /reports/occupancy
```
**Query Parameters:**
- `month`: 1-12
- `year`: YYYY

**Response:**
```json
{
  "Thang": 12,
  "Nam": 2025,
  "TongSoNgay": 31,
  "data": [
    {
      "MaPhong": 101,
      "TenLoaiPhong": "Loại A",
      "SoNgayThue": 25,
      "TyLe": 80.6
    },
    {
      "MaPhong": 102,
      "TenLoaiPhong": "Loại B",
      "SoNgayThue": 18,
      "TyLe": 58.1
    }
  ]
}
```

---

## 7. Settings/Rules (QD6)

### 7.1 Get Room Type Settings (QD1)
```http
GET /settings/room-types
```
**Response:**
```json
[
  {
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "SoLuongKhachToiDa": 3
  },
  {
    "MaLoaiPhong": 2,
    "TenLoaiPhong": "Loại B",
    "DonGia": 170000,
    "SoLuongKhachToiDa": 3
  },
  {
    "MaLoaiPhong": 3,
    "TenLoaiPhong": "Loại C",
    "DonGia": 200000,
    "SoLuongKhachToiDa": 3
  }
]
```

### 7.2 Update Room Type Settings (QD1)
```http
PUT /settings/room-types/:MaLoaiPhong
```
**Body:**
```json
{
  "TenLoaiPhong": "string",
  "DonGia": 150000,
  "SoLuongKhachToiDa": 3
}
```
**Authorization:** Manager only (MaSoLoai = 1)
**Response:** `200 OK`

### 7.3 Get Customer Type Settings (QD2)
```http
GET /settings/customer-types
```
**Response:**
```json
[
  {
    "MaLoaiKhachHang": 1,
    "TenLoaiKhach": "Nội địa",
    "HeSo": 1.0
  },
  {
    "MaLoaiKhachHang": 2,
    "TenLoaiKhach": "Nước ngoài",
    "HeSo": 1.5
  }
]
```

### 7.4 Update Customer Type Settings (QD2)
```http
PUT /settings/customer-types/:MaLoaiKhachHang
```
**Body:**
```json
{
  "TenLoaiKhach": "string (max 20 chars)",
  "HeSo": 1.5
}
```
**Authorization:** Manager only (MaSoLoai = 1)
**Response:** `200 OK`

### 7.5 Get Surcharge Settings (QD4)
```http
GET /settings/surcharge
```
**Response:**
```json
{
  "thirdCustomerSurcharge": 0.25
}
```

### 7.6 Update Surcharge Settings (QD4)
```http
PUT /settings/surcharge
```
**Body:**
```json
{
  "thirdCustomerSurcharge": 0.25
}
```
**Authorization:** Manager only
**Response:** `200 OK`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "details": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "string"
}
```

---

## Business Rules Summary

**QD1:** 3 room types (A, B, C) with base prices (150,000 / 170,000 / 200,000)

**QD2:** 2 customer types (domestic, foreign). Max 3 customers per room

**QD4:** Base price for 2 customers. 3rd customer adds 25% surcharge. Foreign customer (if any in room) applies 1.5× coefficient

**QD6:** Manager can modify:
- Room types and prices (QD1)
- Customer types, coefficients, and max customers per room (QD2)
- Surcharge rates (QD4)
