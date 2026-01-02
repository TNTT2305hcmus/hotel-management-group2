-- ==========================================================
-- 0. CLEANUP 
-- ==========================================================
DROP DATABASE IF EXISTS HOTEL_MANAGEMENT;
CREATE DATABASE HOTEL_MANAGEMENT;
USE HOTEL_MANAGEMENT;

-- ==========================================================
-- I. CREATE TABLES 
-- ==========================================================

-- 1. Table: Room Type
CREATE TABLE ROOM_TYPE (
    RoomTypeID INT PRIMARY KEY, 
    RoomTypeName VARCHAR(50) NOT NULL,
    Price DECIMAL(15, 2) NOT NULL,
    MaxGuests INT NOT NULL,
    CONSTRAINT CHK_RoomType_Name CHECK (RoomTypeName IN ('Standard', 'VIP', 'Luxury')),
    CONSTRAINT CHK_RoomType_Price CHECK (
        (RoomTypeName = 'Standard' AND Price = 150000) OR
        (RoomTypeName = 'VIP' AND Price = 170000) OR
        (RoomTypeName = 'Luxury' AND Price = 200000)
    )
);

-- 2. Table: Room
CREATE TABLE ROOM (
    RoomID INT PRIMARY KEY,
    RoomTypeID INT NOT NULL,
    Status VARCHAR(20) DEFAULT 'Available', -- 'Available', 'Occupied', 'Maintenance'
    ImageURL TEXT,
    Notes TEXT
);

-- 3. Table: Customer Type
CREATE TABLE CUSTOMER_TYPE (
    CustomerTypeID INT PRIMARY KEY,
    CustomerTypeName VARCHAR(50) NOT NULL
);

-- 4. Table: Customer 
CREATE TABLE CUSTOMER (
    CitizenID VARCHAR(20) PRIMARY KEY, 
    CustomerTypeID INT NOT NULL, 
    FullName VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15), 
    Address VARCHAR(255)
);

-- 5. Table: Account Type
CREATE TABLE ACCOUNT_TYPE (
    AccountTypeID INT PRIMARY KEY,
    AccountTypeName VARCHAR(50) NOT NULL
);

-- 6. Table: Account
CREATE TABLE ACCOUNT (
    Username VARCHAR(50) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    AccountTypeID INT NOT NULL
);

-- 7. Table: Booking 
CREATE TABLE BOOKING (
    BookingID INT PRIMARY KEY AUTO_INCREMENT, 
    RoomID INT NOT NULL, 
    CustomerName VARCHAR(100),       -- Tên khách đại diện 
    GuestCount INT DEFAULT 1,        -- Số lượng khách
    IsForeign BOOLEAN DEFAULT 0,     -- 0: Nội địa, 1: Nước ngoài (để tính phụ thu)
    CheckInDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CheckOutDate DATETIME,           -- NULL nếu đang ở
    PaymentDate DATETIME,            -- NULL nếu chưa thanh toán
    TotalPrice DECIMAL(15, 2) DEFAULT 0,
    Status VARCHAR(20) DEFAULT 'Active' -- 'Active', 'Completed', 'Cancelled'
);

-- 8. Table: Booking Details
CREATE TABLE BOOKING_DETAIL (
    BookingID INT NOT NULL,
    CitizenID VARCHAR(20) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
);

-- 9. Table: Invoice 
CREATE TABLE INVOICE (
    InvoiceID INT PRIMARY KEY AUTO_INCREMENT, 
    BookingID INT,
    RoomID INT,
    CustomerName VARCHAR(100),
    TotalAmount DECIMAL(15, 2),
    PaymentMethod VARCHAR(50),
    CheckOutDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- II. FOREIGN KEYS 
-- ==========================================================

ALTER TABLE ROOM
ADD CONSTRAINT FK_Room_RoomType
FOREIGN KEY (RoomTypeID) REFERENCES ROOM_TYPE(RoomTypeID);

ALTER TABLE CUSTOMER
ADD CONSTRAINT FK_Customer_CustomerType
FOREIGN KEY (CustomerTypeID) REFERENCES CUSTOMER_TYPE(CustomerTypeID);

ALTER TABLE ACCOUNT
ADD CONSTRAINT FK_Account_AccountType
FOREIGN KEY (AccountTypeID) REFERENCES ACCOUNT_TYPE(AccountTypeID);

ALTER TABLE BOOKING
ADD CONSTRAINT FK_Booking_Room
FOREIGN KEY (RoomID) REFERENCES ROOM(RoomID);

ALTER TABLE BOOKING_DETAIL
ADD CONSTRAINT FK_BookingDetail_Booking
FOREIGN KEY (BookingID) REFERENCES BOOKING(BookingID);

ALTER TABLE BOOKING_DETAIL
ADD CONSTRAINT FK_BookingDetail_Customer
FOREIGN KEY (CitizenID) REFERENCES CUSTOMER(CitizenID);


-- ==========================================================
-- III. SEED DATA 
-- ==========================================================

-- 1. Insert Account Types
INSERT INTO ACCOUNT_TYPE (AccountTypeID, AccountTypeName) VALUES 
(1, 'Manager'), 
(2, 'Receptionist');

-- 2. Insert Accounts (Pass: 123456)
INSERT INTO ACCOUNT (Username, Email, Password, Phone, AccountTypeID) VALUES 
('admin', 'admin@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0901234567', 1), 
('staff1', 'staff1@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0912345678', 2);

-- 3. Insert Customer Types
INSERT INTO CUSTOMER_TYPE (CustomerTypeID, CustomerTypeName) VALUES 
(1, 'Domestic'), 
(2, 'Foreign');

-- 4. Insert Room Types 
INSERT INTO ROOM_TYPE (RoomTypeID, RoomTypeName, Price, MaxGuests) VALUES 
(1, 'Standard', 150000, 2),
(2, 'VIP', 170000, 2),
(3, 'Luxury', 200000, 2);

-- 5. Insert Customers 
INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) VALUES 
-- Khách Nội
('VN_001', 1, 'Trịnh Hồ Minh Thắng', '0901000001', 'Long An, Vietnam'),
('VN_002', 1, 'Nguyễn Trần Trí Thanh',   '0901000002', 'Gia Lai, Vietnam'),
('VN_003', 1, 'Cao Quốc Tuấn',     '0901000003', 'Binh Dinh, Vietnam'),
('VN_004', 1, 'Lục Hoàng Tuấn',   '0901000004', 'Binh Phuoc, Vietnam'),
('VN_005', 1, 'Huỳnh Trọng Viên',   '0901000005', 'Quang Ngai, Vietnam'),
-- Khách Ngoại
('US_001', 2, 'John Smith',       '0901000005', 'New York, USA'),
('JP_001', 2, 'Akira Yamamoto',   '0901000006', 'Tokyo, Japan'),
('FR_001', 2, 'Alice Wonderland', '0901000007', 'Paris, France');

-- 6. Insert Rooms 
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
-- Tầng 1 (Standard)
(101, 1, 'Occupied',  'Test Base Case', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(102, 1, 'Available', 'Clean',          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(103, 1, 'Occupied',  'Test Foreign',   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(104, 1, 'Maintenance', 'AC Repair',    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),

-- Tầng 2 (VIP)
(201, 2, 'Occupied',  'Test 3rd Guest', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(202, 2, 'Occupied',  'Test COMBO',     'https://images.unsplash.com/photo-1566665797739-1674de7a421a'),
(203, 2, 'Available', 'Sea View',       'https://images.unsplash.com/photo-1590490360182-c33d57733427'),

-- Tầng 3 (Luxury)
(301, 3, 'Available', 'Spacious',       'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(302, 3, 'Available', 'VIP Standard',   'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(303, 3, 'Available', 'City View',      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461');


-- ==========================================================
-- IV. SCENARIO A: HISTORICAL DATA 
-- ==========================================================
-- =============================================
-- 1. THÁNG 11/2025 (3 Đơn)
-- =============================================

-- Booking 50: Phòng 101 - Đã thanh toán
INSERT INTO BOOKING 
(BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, PaymentDate, TotalPrice, Status) 
VALUES 
(50, 101, 'Trịnh Hồ Minh Thắng', 1, 0, '2025-11-02 14:00:00', '2025-11-04 12:00:00', '2025-11-04 12:00:00', 300000, 'Completed');

INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (50, 'VN_001');

-- Booking 51: Phòng 201 - Đã thanh toán
INSERT INTO BOOKING 
(BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, PaymentDate, TotalPrice, Status) 
VALUES 
(51, 201, 'John Smith', 1, 1, '2025-11-10 14:00:00', '2025-11-11 12:00:00', '2025-11-11 12:00:00', 255000, 'Completed');

INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (51, 'US_001');

-- Booking 52: Phòng 301 - Đã thanh toán
INSERT INTO BOOKING 
(BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, PaymentDate, TotalPrice, Status) 
VALUES 
(52, 301, 'Nguyễn Trần Trí Thanh', 2, 0, '2025-11-20 14:00:00', '2025-11-23 12:00:00', '2025-11-23 12:00:00', 600000, 'Completed');

INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (52, 'VN_002');


-- =============================================
-- 2. THÁNG 12/2025 (2 Đơn)
-- =============================================

-- Booking 53: Phòng 102 - Đã thanh toán
INSERT INTO BOOKING 
(BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, PaymentDate, TotalPrice, Status) 
VALUES 
(53, 102, 'Cao Quốc Tuấn', 1, 0, '2025-12-01 14:00:00', '2025-12-06 12:00:00', '2025-12-06 12:00:00', 750000, 'Completed');

INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (53, 'VN_003');

-- Booking 54: Phòng 202 - Đã thanh toán
INSERT INTO BOOKING 
(BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, PaymentDate, TotalPrice, Status) 
VALUES 
(54, 202, 'Alice Wonderland', 2, 1, '2025-12-15 14:00:00', '2025-12-17 12:00:00', '2025-12-17 12:00:00', 510000, 'Completed');

INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (54, 'FR_001');


-- ==========================================================
-- V. SCENARIO B: ACTIVE DATA (DỮ LIỆU ĐỂ TEST CHECKOUT)
-- ==========================================================
-- Các đơn này đang Status='Active', CheckOutDate=NULL.
-- Dùng để test chức năng trả phòng và tính tiền.

-- Case 1: Phòng 101 - Khách Nội, 1 người (Cơ bản)
INSERT INTO BOOKING (BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status, TotalPrice) 
VALUES (1, 101, 'Trịnh Hồ Minh Thắng', 1, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'Active', 0);
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (1, 'VN_001');

-- Case 2: Phòng 103 - Khách Ngoại, 1 người (Test Phụ thu Nước ngoài)
INSERT INTO BOOKING (BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status, TotalPrice) 
VALUES (2, 103, 'John Smith', 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, 'Active', 0);
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (2, 'US_001');

-- Case 3: Phòng 201 - Khách Nội, 3 người (Test Phụ thu Người thứ 3)
INSERT INTO BOOKING (BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status, TotalPrice) 
VALUES (3, 201, 'Nguyễn Trần Trí Thanh', 3, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'Active', 0);
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (3, 'VN_002'), (3, 'VN_003'), (3, 'VN_004');

-- Case 4: Phòng 202 - COMBO (Khách Ngoại + 3 Người) (Test Phụ thu chồng chéo)
INSERT INTO BOOKING (BookingID, RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status, TotalPrice) 
VALUES (4, 202, 'Akira Yamamoto', 3, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), NULL, 'Active', 0);
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (4, 'JP_001'), (4, 'VN_001'), (4, 'VN_002');