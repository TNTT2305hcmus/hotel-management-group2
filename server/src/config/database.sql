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
    CitizenID VARCHAR(20) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
);

<<<<<<< HEAD
-- ==========================================================
-- II. FOREIGN KEYS 
-- ==========================================================
=======
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
>>>>>>> origin/feature/setting-checkout

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

<<<<<<< HEAD
-- ==========================================================
-- III. SEED DATA 
-- ==========================================================
=======
-- =============================================
-- IV. SEED DATA (DỮ LIỆU MẪU ĐỂ TEST CHECKOUT)
-- =============================================
>>>>>>> origin/feature/setting-checkout

-- 1. Insert Account Types
INSERT INTO ACCOUNT_TYPE (AccountTypeID, AccountTypeName) VALUES 
(1, 'Manager'), 
(2, 'Receptionist');

-- 2. Insert Accounts
-- Password: 123456 
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

-- 5. Insert Rooms 
<<<<<<< HEAD
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
-- Standard Rooms (Type 1)
(101, 1, 'Available',   'Clean room', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(102, 1, 'Available',   'Near stairs', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(103, 1, 'Occupied',    'Guest staying (Mr. Robert)', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(104, 1, 'Maintenance', 'AC Repair', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
=======
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
>>>>>>> origin/feature/setting-checkout

-- VIP Rooms (Type 2)
(201, 2, 'Available',   'Has bathtub', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(202, 2, 'Available',   'Sea view', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'),
(203, 2, 'Maintenance', 'Broken light', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),

-- Luxury Rooms (Type 3)
(301, 3, 'Available',   'Spacious', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(302, 3, 'Occupied',    'VIP Guest (Mr. Chris Evans)', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(303, 3, 'Available',   'VIP Standard', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461');

-- 6. Insert Customers
INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) VALUES 
<<<<<<< HEAD
('001200000001', 1, 'Michael Johnson', '0909000001', '123 Main Street, New York, USA'),
('079200000002', 1, 'Sarah Williams', '0909000002', '45 Oxford Street, London, UK'),
('031200000003', 1, 'James Brown', '0909000003', '78 Rue de la Paix, Paris, France'),
('098765432001', 2, 'John Smith', '0909000004', '456 Fifth Avenue, New York, USA'), 
('001200000005', 1, 'Emma Davis', '0909000005', '10 Church Street, Toronto, Canada'),
('092200000006', 1, 'Robert Miller', '0909000006', '99 George Street, Sydney, Australia'),
('044200000007', 1, 'Lisa Anderson', '0909000007', '55 Champ-Élysées, Paris, France'),
('112233445566', 2, 'Akira Yamamoto', '0909000008', '1-2-3 Shibuya, Tokyo, Japan'), 
('001200000009', 1, 'David Martinez', '0909000009', '87 Gran Via, Madrid, Spain'),
('001200000010', 1, 'Amy Robinson', '0909000010', '202 Brooklyn Bridge, Brooklyn, USA'),
('001098000999', 1, 'Nguyen Van An', '0911222333', '12 Le Loi, Ho Chi Minh, Vietnam'),
('ABC123456789', 2, 'Chris Evans', '0944555666', '100 Hollywood Blvd, LA, USA');

-- 7. Insert Bookings (10 Booking)
INSERT INTO BOOKING (BookingID, RoomID, CheckInDate, CheckOutDate, PaymentDate, TotalPrice) VALUES 
(1, 101, '2025-12-20 14:00:00', '2025-12-22 11:00:00', '2025-12-22 11:00:00', 300000), 
(2, 201, '2025-12-21 15:30:00', '2025-12-25 11:00:00', '2025-12-25 11:00:00', 680000), 
(3, 301, '2025-12-22 16:00:00', '2025-12-23 12:00:00', '2025-12-23 12:00:00', 200000),
(4, 102, '2025-12-18 13:00:00', '2025-12-24 11:00:00', '2025-12-24 11:00:00', 900000), 
(5, 202, '2025-12-19 14:00:00', '2025-12-23 11:00:00', '2025-12-23 11:00:00', 680000),
(6, 103, '2025-12-28 14:00:00', NULL, NULL, 0), 
(7, 302, '2025-12-29 12:00:00', NULL, NULL, 0), 
(8, 101, '2025-12-01 14:00:00', '2025-12-05 12:00:00', '2025-12-05 12:00:00', 600000), 
(9, 303, '2025-12-10 14:00:00', '2025-12-15 11:00:00', '2025-12-15 11:00:00', 1000000), 
(10, 203, '2025-12-15 14:00:00', '2025-12-16 12:00:00', '2025-12-16 12:00:00', 170000);
=======
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
>>>>>>> origin/feature/setting-checkout

-- 8. Insert Booking Details 
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES 
<<<<<<< HEAD
(1, '001200000001'), 
(2, '079200000002'), 
(3, '031200000003'), 
(4, '098765432001'), 
(5, '001200000005'), 
(6, '092200000006'), 
(7, 'ABC123456789'), 
(8, '001098000999'), 
(9, '044200000007'), 
(10, '001200000001'); 
=======
(1, '001'), -- Phòng 101
(2, '002'), -- Phòng 103
(3, '003'), -- Phòng 202
(4, '005'), -- Phòng 203
(5, '004'), -- Phòng 104
(6, '006'), -- Phòng 302
(7, '002'); -- Phòng 401
>>>>>>> origin/feature/setting-checkout
