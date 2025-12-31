-- =============================================
-- 0. CLEANUP 
-- =============================================
DROP DATABASE IF EXISTS HOTEL_MANAGEMENT;

-- =============================================
-- I. CREATE DATABASE
-- =============================================
CREATE DATABASE HOTEL_MANAGEMENT;
USE HOTEL_MANAGEMENT;

-- =============================================
-- II. CREATE TABLES
-- =============================================

-- 1. Table: Room Type
CREATE TABLE ROOM_TYPE (
    RoomTypeID INT PRIMARY KEY, 
    RoomTypeName VARCHAR(50) NOT NULL,
    Price DECIMAL(15, 2) NOT NULL,
    MaxGuests INT NOT NULL
);

-- 2. Table: Room
CREATE TABLE ROOM (
    RoomID INT PRIMARY KEY,
    RoomTypeID INT NOT NULL,
    Status VARCHAR(20) DEFAULT 'Available', -- 'Available', 'Rented', 'Maintenance'
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
    CitizenID VARCHAR(12) PRIMARY KEY, 
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

-- 7. Table: Booking (CẬP NHẬT QUAN TRỌNG CHO CHECKOUT)
CREATE TABLE BOOKING (
    BookingID INT PRIMARY KEY AUTO_INCREMENT, -- Nếu dùng SQL Server hãy đổi AUTO_INCREMENT thành IDENTITY(1,1)
    RoomID INT NOT NULL, 
    CustomerName VARCHAR(100), -- Thêm để khớp Backend
    GuestCount INT DEFAULT 1,  -- Thêm để khớp Backend
    IsForeign BOOLEAN DEFAULT 0, -- Thêm để tính phụ thu (0: Nội địa, 1: Nước ngoài). SQL Server dùng BIT thay BOOLEAN
    CheckInDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CheckOutDate DATETIME,
    PaymentDate DATETIME,
    TotalPrice DECIMAL(15, 2),
    Status VARCHAR(20) DEFAULT 'Active' -- Thêm 'Active' hoặc 'Completed'
);

-- 8. Table: Booking Details
CREATE TABLE BOOKING_DETAIL (
    BookingID INT NOT NULL,
    CitizenID VARCHAR(12) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
);

-- 9. Table: Invoice (THÊM MỚI CHO CHECKOUT)
CREATE TABLE INVOICE (
    InvoiceID INT PRIMARY KEY AUTO_INCREMENT, -- Nếu dùng SQL Server đổi thành IDENTITY(1,1)
    BookingID INT,
    RoomID INT,
    CustomerName VARCHAR(100),
    TotalAmount DECIMAL(15, 2),
    PaymentMethod VARCHAR(50),
    CheckOutDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- III. FOREIGN KEYS 
-- =============================================

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

-- =============================================
-- IV. SEED DATA (DỮ LIỆU MẪU ĐỂ TEST CHECKOUT)
-- =============================================

-- 1. Insert Account Types
INSERT INTO ACCOUNT_TYPE (AccountTypeID, AccountTypeName) VALUES 
(1, 'Manager'), 
(2, 'Receptionist');

-- 2. Insert Accounts
INSERT INTO ACCOUNT (Username, Email, Password, Phone, AccountTypeID) VALUES 
('admin', 'admin@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0901234567', 1), 
('staff1', 'staff1@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0912345678', 2);

-- 3. Insert Customer Types
INSERT INTO CUSTOMER_TYPE (CustomerTypeID, CustomerTypeName) VALUES 
(1, 'Domestic'), 
(2, 'Foreign');

-- 4. Insert Room Types
INSERT INTO ROOM_TYPE (RoomTypeID, RoomTypeName, Price, MaxGuests) VALUES 
(1, 'Single Room', 500000, 1),
(2, 'Double Room', 800000, 2),
(3, 'Standard Room', 200000, 1),
(4, 'Luxury Room', 1000000, 1);

-- 5. Insert Rooms 
-- (Tạo nhiều phòng Rented để test danh sách)
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
-- Tầng 1: Single
(101, 1, 'Rented', 'Standard Check', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(102, 1, 'Available', 'Near Lobby', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(103, 1, 'Rented', 'Foreign Guest', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(104, 1, 'Rented', 'Long stay', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),

-- Tầng 2: Double
(201, 2, 'Available', 'Has bathtub', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(202, 2, 'Rented', 'Family (3 Guests)', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(203, 2, 'Rented', 'Combo Surcharge', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),

-- Tầng 3: Standard
(301, 3, 'Available', 'Budget', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(302, 3, 'Rented', 'Just arrived', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),

-- Tầng 4: Luxury
(401, 4, 'Rented', 'VIP Guest', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a');

-- 6. Insert Customers 
INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) VALUES 
('001', 1, 'Nguyen Van A', '0901000001', 'Hanoi, Vietnam'),
('002', 2, 'John Smith', '0901000002', 'London, UK'),
('003', 1, 'Tran Thi B', '0901000003', 'Da Nang, Vietnam'),
('004', 1, 'Le Van C', '0901000004', 'HCM, Vietnam'),
('005', 2, 'Alice Wonderland', '0901000005', 'Paris, France'),
('006', 1, 'Pham Van D', '0901000006', 'Can Tho, Vietnam');

-- 7. Insert Bookings (CÁC TRƯỜNG HỢP TEST)

-- Case 1: Phòng 101 - Khách Nội, 1 người, Ở 1 ngày (Cơ bản)
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (101, 'Nguyen Van A', 1, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'Active');

-- Case 2: Phòng 103 - Khách Ngoại, 1 người, Ở 3 ngày (Test phụ thu Foreign x1.5)
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (103, 'John Smith', 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, 'Active');

-- Case 3: Phòng 202 - Khách Nội, 3 người, Ở 2 ngày (Test phụ thu Khách thứ 3)
-- Giả sử quy định: Khách thứ 3 phụ thu 25%
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (202, 'Tran Thi B', 3, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'Active');

-- Case 4: Phòng 203 - Khách Ngoại, 3 người, Ở 5 ngày (Test COMBO phụ thu: Foreign + Khách 3)
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (203, 'Alice Wonderland', 3, 1, '2025-12-25 14:00:00', NULL, 'Active');

-- Case 5: Phòng 104 - Khách Nội, 1 người, Ở 10 ngày (Test tiền lớn)
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (104, 'Le Van C', 1, 0, DATE_SUB(NOW(), INTERVAL 10 DAY), NULL, 'Active');

-- Case 6: Phòng 302 - Khách Nội, 1 người, Vừa checkin (Test làm tròn ngày = 1)
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (302, 'Pham Van D', 1, 0, NOW(), NULL, 'Active');

-- Case 7: Phòng 401 - Khách Ngoại (VIP), 2 người, Ở 2 ngày
INSERT INTO BOOKING (RoomID, CustomerName, GuestCount, IsForeign, CheckInDate, CheckOutDate, Status) 
VALUES (401, 'John Smith', 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'Active');

-- 8. Insert Booking Details
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES 
(1, '001'), -- Phòng 101
(2, '002'), -- Phòng 103
(3, '003'), -- Phòng 202
(4, '005'), -- Phòng 203
(5, '004'), -- Phòng 104
(6, '006'), -- Phòng 302
(7, '002'); -- Phòng 401