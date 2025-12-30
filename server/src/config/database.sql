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
    Status VARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance
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
    CheckInDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CheckOutDate DATETIME,
    PaymentDate DATETIME,
    TotalPrice DECIMAL(15, 2)
);

-- 8. Table: Booking Details
CREATE TABLE BOOKING_DETAIL (
    BookingID INT NOT NULL,
    CitizenID VARCHAR(20) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
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

-- 2. Insert Accounts
-- Password: 123456 
INSERT INTO ACCOUNT (Username, Email, Password, Phone, AccountTypeID) VALUES 
('admin', 'admin@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0901234567', 1), 
('staff1', 'staff1@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0912345678', 2), 
('staff2', 'staff2@hotel.com', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', '0923456789', 2);

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
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
-- Standard Rooms (Type 1)
(101, 1, 'Available',   'Clean room', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(102, 1, 'Available',   'Near stairs', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(103, 1, 'Occupied',    'Guest staying (Mr. Robert)', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(104, 1, 'Maintenance', 'AC Repair', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),

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

-- 8. Insert Booking Details 
INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES 
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