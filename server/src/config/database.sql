-- =============================================
-- I. CREATE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS HOTEL_MANAGEMENT;
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
    Status VARCHAR(20) DEFAULT 'Available', 
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
    CitizenID VARCHAR(12) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
);

-- =============================================
-- III. FOREIGN KEYS (KHÓA NGOẠI)
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
-- IV. SEED DATA (DỮ LIỆU MẪU)
-- =============================================

-- 1. Insert Account Types
INSERT INTO ACCOUNT_TYPE (AccountTypeID, AccountTypeName) VALUES 
(1, 'Manager'), 
(2, 'Receptionist');

-- 2. Insert Accounts
-- Lưu ý: Mật khẩu này chỉ là ví dụ hash, thực tế bạn cần dùng bcrypt trong code để tạo
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
(1, 'Single Room', 500000, 1),
(2, 'Double Room', 800000, 2),
(3, 'Standard Room', 200000, 1),
(4, 'Luxury Room', 1000000, 1);

-- 5. Insert Rooms
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
(101, 1, 'Available', 'Clean room', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(102, 1, 'Available', 'Near stairs', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(103, 1, 'Occupied', 'Guest staying', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(104, 1, 'Maintenance', 'Need cleaning', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
(201, 2, 'Available', 'Has bathtub', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(202, 2, 'Available', 'Sea view', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'),
(203, 2, 'Maintenance', 'Broken light', 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),
(301, 3, 'Available', 'Spacious', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(302, 3, 'Occupied', 'Group tour', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(303, 3, 'Available', 'VIP Standard', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461');

-- 6. Insert Customers
INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, Address) VALUES 
('001200000001', 1, 'Nguyễn Văn An', '123 Cầu Giấy, Hà Nội'),
('079200000002', 1, 'Trần Thị Bích', '45 Lê Lợi, Quận 1, TP.HCM'),
('031200000003', 1, 'Lê Văn Cường', '78 Nguyễn Văn Linh, Đà Nẵng'),
('098765432001', 2, 'John Smith', 'New York, USA'), 
('001200000005', 1, 'Phạm Thị Duyên', '10 Lạch Tray, Hải Phòng'),
('092200000006', 1, 'Hoàng Văn Em', 'Ninh Kiều, Cần Thơ'),
('044200000007', 1, 'Vũ Thị Gấm', 'Hạ Long, Quảng Ninh'),
('112233445566', 2, 'Akira Yamamoto', 'Tokyo, Japan'), 
('001200000009', 1, 'Đặng Văn Hùng', 'Vinh, Nghệ An'),
('001200000010', 1, 'Bùi Thị Kim', 'Huế, Thừa Thiên Huế');
