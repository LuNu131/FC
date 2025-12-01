const mysql = require("mysql2");
require("dotenv").config();

// Tạo pool kết nối thường
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Cấu hình SSL cho Aiven
  ssl:
    process.env.DB_SSL === "true" || process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : null,
});

// Chuyển sang dạng Promise để dùng async/await
const promisePool = pool.promise();

// Test kết nối (FIX LỖI: Dùng promisePool thay vì pool)
promisePool
  .getConnection()
  .then((conn) => {
    console.log("✅ Đã kết nối thành công tới Aiven MySQL!");
    conn.release();
  })
  .catch((err) => {
    // Chỉ log lỗi, không crash app để server vẫn chạy được nếu DB chập chờn
    console.error("❌ Lỗi kết nối Database:", err.message);
  });

module.exports = promisePool;
