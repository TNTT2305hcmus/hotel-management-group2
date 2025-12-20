-- =============================================
-- I. CREATE DATABASE
-- =============================================
USE master;
GO

-- Drop database if it exists to reset
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'HOTEL_MANAGEMENT')
BEGIN
    ALTER DATABASE HOTEL_MANAGEMENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE HOTEL_MANAGEMENT;
END
GO

CREATE DATABASE HOTEL_MANAGEMENT;
GO

USE HOTEL_MANAGEMENT;
GO

-- =============================================
-- II. CREATE TABLES
-- =============================================

-- 1. Table: Room Type (Loại Phòng)
CREATE TABLE ROOM_TYPE (
    RoomTypeID INT PRIMARY KEY, 
    RoomTypeName NVARCHAR(50) NOT NULL,
    Price DECIMAL(15, 2) NOT NULL,
    MaxGuests INT NOT NULL
);

-- 2. Table: Room (Phòng)
CREATE TABLE ROOM (
    RoomID INT PRIMARY KEY, -- Room Number like 101, 102...
    RoomTypeID INT NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Available', 
	ImageURL NVARCHAR(MAX),
    Notes NVARCHAR(MAX)
);

-- 3. Table: Customer Type (Loại Khách Hàng)
CREATE TABLE CUSTOMER_TYPE (
    CustomerTypeID INT PRIMARY KEY,
    CustomerTypeName NVARCHAR(50) NOT NULL
);

-- 4. Table: Customer (Khách Hàng)
CREATE TABLE CUSTOMER (
    CitizenID VARCHAR(12) PRIMARY KEY, 
    CustomerTypeID INT NOT NULL, 
    FullName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(255)
);

-- 5. Table: Account Type / Role (Loại Tài Khoản)
CREATE TABLE ACCOUNT_TYPE (
    AccountTypeID INT PRIMARY KEY,
    AccountTypeName NVARCHAR(50) NOT NULL
);

-- 6. Table: Account / Login Info (Thông Tin Đăng Nhập)
CREATE TABLE ACCOUNT (
    Username VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    AccountTypeID INT NOT NULL 
);

-- 7. Table: Booking (Phiếu Thuê)
CREATE TABLE BOOKING (
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    RoomID INT NOT NULL, 
    CheckInDate DATETIME NOT NULL DEFAULT GETDATE(),
    CheckOutDate DATETIME,
    PaymentDate DATETIME,
    TotalPrice DECIMAL(15, 2)
);

-- 8. Table: Booking Details (Chi Tiết Phiếu Thuê)
CREATE TABLE BOOKING_DETAIL (
    BookingID INT NOT NULL,
    CitizenID VARCHAR(12) NOT NULL, 
    PRIMARY KEY (BookingID, CitizenID)
);

-- =============================================
-- III. CONSTRAINTS (RÀNG BUỘC)
-- =============================================

-- 1. Check Room Status (Standardized to English)
ALTER TABLE ROOM
ADD CONSTRAINT CK_Room_Status
CHECK (Status IN ('Available', 'Occupied', 'Maintenance'));

-- 2. Check Customer Type
ALTER TABLE CUSTOMER_TYPE
ADD CONSTRAINT CK_CustomerType_Name
CHECK (CustomerTypeName IN ('Domestic', 'Foreign'));

-- =============================================
-- IV. FOREIGN KEYS (KHÓA NGOẠI)
-- =============================================

-- 1. Room -> RoomType
ALTER TABLE ROOM
ADD CONSTRAINT FK_Room_RoomType
FOREIGN KEY (RoomTypeID) REFERENCES ROOM_TYPE(RoomTypeID);

-- 2. Customer -> CustomerType
ALTER TABLE CUSTOMER
ADD CONSTRAINT FK_Customer_CustomerType
FOREIGN KEY (CustomerTypeID) REFERENCES CUSTOMER_TYPE(CustomerTypeID);

-- 3. Account -> AccountType
ALTER TABLE ACCOUNT
ADD CONSTRAINT FK_Account_AccountType
FOREIGN KEY (AccountTypeID) REFERENCES ACCOUNT_TYPE(AccountTypeID);

-- 4. Booking -> Room
ALTER TABLE BOOKING
ADD CONSTRAINT FK_Booking_Room
FOREIGN KEY (RoomID) REFERENCES ROOM(RoomID);

-- 5. BookingDetail -> Booking
ALTER TABLE BOOKING_DETAIL
ADD CONSTRAINT FK_BookingDetail_Booking
FOREIGN KEY (BookingID) REFERENCES BOOKING(BookingID);

-- 6. BookingDetail -> Customer
ALTER TABLE BOOKING_DETAIL
ADD CONSTRAINT FK_BookingDetail_Customer
FOREIGN KEY (CitizenID) REFERENCES CUSTOMER(CitizenID);

-- =============================================
-- V. SEED DATA (DỮ LIỆU MẪU)
-- =============================================

-- 1. Insert Account Types
INSERT INTO ACCOUNT_TYPE (AccountTypeID, AccountTypeName) VALUES 
(1, 'Manager'), 
(2, 'Receptionist');   
GO

-- 2. Insert Accounts (Password is hashed '123456')
INSERT INTO ACCOUNT (Username, Password, AccountTypeID) VALUES 
('admin', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 1), 
('staff1', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 2), 
('staff2', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 2); 
GO

-- 3. Insert Customer Types
INSERT INTO CUSTOMER_TYPE (CustomerTypeID, CustomerTypeName) VALUES 
(1, 'Domestic'), 
(2, 'Foreign');
GO

-- 4. Insert Room Types
INSERT INTO ROOM_TYPE (RoomTypeID, RoomTypeName, Price, MaxGuests) VALUES 
(1, 'Single Room', 500000, 1),
(2, 'Double Room', 800000, 2),
(3, 'Standard Room', 200000, 1),
(4, 'Luxury Room', 1000000, 1);
GO

-- 5. Insert Rooms
INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL) VALUES 
(101, 1, 'Available', 'Clean room', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600'),
(102, 1, 'Available', 'Near stairs', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600'),
(103, 1, 'Occupied', 'Guest staying', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600'),
(104, 1, 'Maintenance', 'Need cleaning', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600'),
(201, 2, 'Available', 'Has bathtub', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600'),
(202, 2, 'Available', 'Sea view', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600'),
(203, 2, 'Maintenance', 'Broken light', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600'),
(301, 3, 'Available', 'Spacious', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600'),
(302, 3, 'Occupied', 'Group tour', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600'),
(303, 3, 'Available', 'VIP Standard', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600');
GO

-- 6. Insert Customers
INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, Address) VALUES 
('001200000001', 1, N'Nguyễn Văn An', N'123 Cầu Giấy, Hà Nội'),
('079200000002', 1, N'Trần Thị Bích', N'45 Lê Lợi, Quận 1, TP.HCM'),
('031200000003', 1, N'Lê Văn Cường', N'78 Nguyễn Văn Linh, Đà Nẵng'),
('098765432001', 2, N'John Smith', N'New York, USA'), 
('001200000005', 1, N'Phạm Thị Duyên', N'10 Lạch Tray, Hải Phòng'),
('092200000006', 1, N'Hoàng Văn Em', N'Ninh Kiều, Cần Thơ'),
('044200000007', 1, N'Vũ Thị Gấm', N'Hạ Long, Quảng Ninh'),
('112233445566', 2, N'Akira Yamamoto', N'Tokyo, Japan'), 
('001200000009', 1, N'Đặng Văn Hùng', N'Vinh, Nghệ An'),
('001200000010', 1, N'Bùi Thị Kim', N'Huế, Thừa Thiên Huế');
GO

-- =============================================
-- VI. VERIFY DATA
-- =============================================
SELECT * FROM CUSTOMER;
SELECT * FROM CUSTOMER_TYPE;
SELECT * FROM ROOM;
SELECT * FROM ROOM_TYPE;
SELECT * FROM ACCOUNT;
SELECT * FROM ACCOUNT_TYPE;