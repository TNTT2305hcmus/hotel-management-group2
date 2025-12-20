-- I. Tạo Database 
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'HOTEL_MANAGEMENT')
BEGIN
    CREATE DATABASE HOTEL_MANAGEMENT;
END
GO

USE HOTEL_MANAGEMENT;
GO




-- II. Tạo bảng 
-- 1. Bảng Loại Phòng
CREATE TABLE LOAI_PHONG (
    MaLoaiPhong INT PRIMARY KEY, 
    TenLoaiPhong NVARCHAR(45) NOT NULL,
    DonGia DECIMAL(15, 2) NOT NULL,
    SoLuongKhachToiDa INT NOT NULL
);

-- 2. Bảng Phòng
CREATE TABLE PHONG (
    MaPhong INT PRIMARY KEY,
    MaLoaiPhong INT NOT NULL,
    TinhTrang NVARCHAR(20) DEFAULT N'Trống', 
    GhiChu NVARCHAR(MAX)
);

-- 3. Bảng Loại Khách Hàng
CREATE TABLE LOAI_KHACH_HANG (
    MaLoaiKhachHang INT PRIMARY KEY,
    TenLoaiKhachHang NVARCHAR(50) NOT NULL
);

-- 4. Bảng Khách Hàng
CREATE TABLE KHACH_HANG (
    CCCD VARCHAR(12) PRIMARY KEY, 
    MaLoaiKhachHang INT NOT NULL, 
    TenKhachHang NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255)
);

-- 5. Bảng Loại Tài Khoản
CREATE TABLE LOAI_TAI_KHOAN (
    MaLoaiTaiKhoan INT PRIMARY KEY,
    TenLoai NVARCHAR(50) NOT NULL
);

-- 6. Bảng Thông Tin Đăng Nhập
CREATE TABLE THONG_TIN_DANG_NHAP (
    Username VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    MaLoaiTaiKhoan INT NOT NULL 
);

-- 7. Bảng Phiếu Thuê
CREATE TABLE PHIEU_THUE (
    MaPhieuThue INT PRIMARY KEY IDENTITY(1,1),
    MaPhong INT NOT NULL, 
    NgayBatDau DATETIME NOT NULL DEFAULT GETDATE(),
    NgayKetThuc DATETIME,
    NgayThanhToan DATETIME,
    ThanhTien DECIMAL(15, 2)
);

-- 8. Bảng Chi Tiết Phiếu Thuê
CREATE TABLE CHI_TIET_PHIEU_THUE (
    MaPhieuThue INT NOT NULL,
    CCCD VARCHAR(12) NOT NULL, 
    PRIMARY KEY (MaPhieuThue, CCCD)
);

-- III. Tạo ràng buộc
-- 1. Tình trạng phòng
ALTER TABLE PHONG
ADD CONSTRAINT CK_TinhTrang_Phong
CHECK (TinhTrang IN (N'Trống', N'Có khách', N'Bảo trì'));

-- 2. Loại khách
ALTER TABLE LOAI_KHACH_HANG
ADD CONSTRAINT CK_TenLoaiKhach
CHECK (TenLoaiKhachHang IN (N'Nội địa', N'Nước ngoài'));

-- IV. Tạo khóa ngoại
-- 1. Nối Phòng -> Loại Phòng
ALTER TABLE PHONG
ADD CONSTRAINT FK_Phong_LoaiPhong
FOREIGN KEY (MaLoaiPhong) REFERENCES LOAI_PHONG(MaLoaiPhong);

-- 2. Nối Khách Hàng -> Loại Khách Hàng
ALTER TABLE KHACH_HANG
ADD CONSTRAINT FK_KhachHang_LoaiKhach
FOREIGN KEY (MaLoaiKhachHang) REFERENCES LOAI_KHACH_HANG(MaLoaiKhachHang);

-- 3. Nối Tài Khoản -> Loại Tài Khoản
ALTER TABLE THONG_TIN_DANG_NHAP
ADD CONSTRAINT FK_User_LoaiTK
FOREIGN KEY (MaLoaiTaiKhoan) REFERENCES LOAI_TAI_KHOAN(MaLoaiTaiKhoan);

-- 4. Nối Phiếu Thuê -> Phòng
ALTER TABLE PHIEU_THUE
ADD CONSTRAINT FK_PhieuThue_Phong
FOREIGN KEY (MaPhong) REFERENCES PHONG(MaPhong);

-- 5. Nối Chi Tiết -> Phiếu Thuê
ALTER TABLE CHI_TIET_PHIEU_THUE
ADD CONSTRAINT FK_ChiTiet_PhieuThue
FOREIGN KEY (MaPhieuThue) REFERENCES PHIEU_THUE(MaPhieuThue);

-- 6. Nối Chi Tiết -> Khách Hàng (CCCD)
ALTER TABLE CHI_TIET_PHIEU_THUE
ADD CONSTRAINT FK_ChiTiet_KhachHang
FOREIGN KEY (CCCD) REFERENCES KHACH_HANG(CCCD);

-- V. Thêm dữ liệu
-- 1. Tạo dữ liệu Loại Tài Khoản (Admin & Staff)
INSERT INTO LOAI_TAI_KHOAN (MaLoaiTaiKhoan, TenLoai) VALUES 
(1, N'Quản lý'), 
(2, N'Lễ tân');   
GO
-- 2. Thêm thông tin đăng nhập
INSERT INTO THONG_TIN_DANG_NHAP (Username, Password, MaLoaiTaiKhoan) VALUES 
('admin', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 1), 
('nhanvien1', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 2), 
('nhanvien2', '$2a$10$X7V.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.j/p.', 2); 
GO

-- 3. Tạo Loại Khách Hàng (Nhập cứng ID)
INSERT INTO LOAI_KHACH_HANG (MaLoaiKhachHang, TenLoaiKhachHang) VALUES 
(1, N'Nội địa'), 
(2, N'Nước ngoài');
GO

-- 4. Tạo Loại Phòng (Nhập cứng ID 1, 2, 3)
INSERT INTO LOAI_PHONG (MaLoaiPhong, TenLoaiPhong, DonGia, SoLuongKhachToiDa) VALUES 
(1, N'Phòng Đơn ', 500000, 1),
(2, N'Phòng Đôi ', 800000, 2),
(3, N'Phòng Tiêu Chuẩn', 200000, 1),
(4, N'Phòng Sang Trọng', 1000000, 1);
GO

-- 5. Tạo Phòng (Nhập cứng ID Phòng: 101, 102...)
INSERT INTO PHONG (MaPhong, MaLoaiPhong, TinhTrang, GhiChu) VALUES 
(101, 1, N'Trống', N'Phòng sạch'),
(102, 1, N'Trống', N'Gần cầu thang'),
(103, 1, N'Có khách', N'Khách đang ở'),
(104, 1, N'Bảo trì', N'Cần dọn'),
(201, 2, N'Trống', N'Có bồn tắm'),
(202, 2, N'Trống', N'View biển'),
(203, 2, N'Bảo trì', N'Hỏng đèn'),
(301, 3, N'Trống', N'Rộng rãi'),
(302, 3, N'Có khách', N'Đoàn khách'),
(303, 3, N'Trống', N'VIP nhất');
GO

-- 6. Thêm thông tin khách hàng
INSERT INTO KHACH_HANG (CCCD, MaLoaiKhachHang, TenKhachHang, DiaChi) VALUES 
('001200000001', 1, N'Nguyễn Văn An', N'123 Cầu Giấy, Hà Nội'),
('079200000002', 1, N'Trần Thị Bích', N'45 Lê Lợi, Quận 1, TP.HCM'),
('031200000003', 1, N'Lê Văn Cường', N'78 Nguyễn Văn Linh, Đà Nẵng'),
('098765432001', 2, N'John Smith', N'New York, USA'), -- Khách nước ngoài
('001200000005', 1, N'Phạm Thị Duyên', N'10 Lạch Tray, Hải Phòng'),
('092200000006', 1, N'Hoàng Văn Em', N'Ninh Kiều, Cần Thơ'),
('044200000007', 1, N'Vũ Thị Gấm', N'Hạ Long, Quảng Ninh'),
('112233445566', 2, N'Akira Yamamoto', N'Tokyo, Japan'), -- Khách nước ngoài
('001200000009', 1, N'Đặng Văn Hùng', N'Vinh, Nghệ An'),
('001200000010', 1, N'Bùi Thị Kim', N'Huế, Thừa Thiên Huế');
GO


SELECT * FROM KHACH_HANG
SELECT * FROM LOAI_KHACH_HANG
SELECT * FROM PHONG
SELECT * FROM LOAI_PHONG
SELECT * FROM LOAI_TAI_KHOAN
SELECT * FROM CHI_TIET_PHIEU_THUE
SELECT * FROM PHIEU_THUE
