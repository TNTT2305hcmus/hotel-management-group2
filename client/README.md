# Hotel Management System (Frontend)

Dự án Frontend cho hệ thống quản lý khách sạn, được xây dựng bằng **React (Vite)**. Hệ thống bao gồm các chức năng xác thực người dùng, phân quyền (Manager/Receptionist) và các giao diện quản lý cơ bản.

## Tính Năng Chính

* **Đăng nhập (Login):**
    * Hỗ trợ chọn vai trò: Quản lý (Manager) hoặc Lễ tân (Receptionist).
    * Giao diện responsive, full màn hình.
    * Ẩn/Hiện mật khẩu (Eye Icon).
* **Quên mật khẩu (Forgot Password):**
    * Quy trình 3 bước: Nhập SĐT -> Nhập OTP -> Đặt mật khẩu mới.
    * Giả lập gửi và xác thực OTP.
* **Bảo mật (Security):**
    * **Private Route:** Chặn truy cập trái phép. Chỉ người dùng đã đăng nhập và có đúng quyền (Role) mới vào được Dashboard tương ứng.
    * Lưu Token và thông tin User vào LocalStorage.
* **Giả lập API (Mock API):**
    * Hệ thống chạy độc lập không cần Backend thực tế

## 🛠️ Công Nghệ Sử Dụng

* **Core:** React JS (Vite Bundler).
* **Routing:** React Router DOM (v6).
* **HTTP Client:** Axios (hoặc Mock API nội bộ).
* **Styling:** CSS thuần (Custom layout & animations).
* **Icons:** SVG Icons.

## 📂 Cấu Trúc Thư Mục

```bash
src/
├── assets/             # Chứa hình ảnh (hotel.jpg, logo...)
├── components/         # Các trang chính
│   ├── Login.jsx       # Trang đăng nhập
│   ├── ForgotPassword.jsx # Trang quên mật khẩu (Gửi OTP)
│   └── ResetPassword.jsx  # Trang đặt lại mật khẩu
├── styles/             # File CSS cho từng component
│   ├── login.css
│   └── Forgot.css
├── utils/              # Các hàm tiện ích & Mock Data
│   └── mockApi.js      # Giả lập Server (Login, OTP, Reset Pass)
├── routes/             # Cấu hình bảo vệ Router
│   └── RoutePrivate.jsx
├── temp/               # Các trang tạm thời (Dashboard)
│   ├── ManagerDashboard.jsx
│   └── ReceptionistDashboard.jsx
└── App.js              # Cấu hình Routing chính