import sql from 'mssql';

// Lấy thông tin từ biến môi trường (đã được nạp qua --env-file hoặc dotenv)
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, // Bắt buộc nếu dùng Azure, local thì true/false đều ok
        trustServerCertificate: true // QUAN TRỌNG: Để true để chạy local không lỗi SSL
    }
};

export const connectDB = async () => {
    try {
        // Tạo pool kết nối để dùng lại, tránh mở quá nhiều kết nối
        const pool = await sql.connect(config);
        console.log("✅ Kết nối SQL Server thành công!");
        return pool;
    } catch (err) {
        console.error("❌ Lỗi kết nối Database:", err.message);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
};

// Xuất sql để dùng ở các nơi khác (Model/Controller)
export { sql };