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

### 1.2 Login
```http
POST /auth/login
```
**Body:**
```json
{
  "Username": "string",
  "Password": "string",
  "MaSoLoai": 1
}
```
**Note:** MaSoLoai: 1 = Manager, 2 = Employee  
**Response:**
```json
{
  "token": "jwt_token_string",
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
    "TinhTrang": "Trong" | "Da Thue" | "Bao Tri",
    "GhiChu": "string (max 100 chars)"
  }
]
```
**Response:** `200 OK`

### 2.2 Create Room
```http
POST /rooms
```
**Body:**
```json
{
  "MaPhong": 101,
  "TenLoaiPhong": "Loại A",
  "DonGia": 150000,
  "SoLuongKhachToiDa" : 3,
  "TinhTrang": "Trong" (Mới tạo nên nó trống),
  "GhiChu": "string (max 100 chars)"
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
  (cho vào những trường cần update)
}
```
**Response:** `200 OK`

### 2.4 Delete Room
```http
DELETE /rooms/:MaPhong
```
**Response:** `200 OK`

### 2.1 Get Information A Room
```http
GET /rooms/:id
```
**Response:**
```json
[
  {
    "MaLoaiPhong": 1,
    "TenLoaiPhong": "Loại A",
    "DonGia": 150000,
    "TinhTrang": "Trong" | "Da Thue" | "Bao Tri",
    "GhiChu": "string (max 100 chars)"
  }
]
```
**Response:** `200 OK`