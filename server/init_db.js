const fs = require("fs");
const path = require("path");
const db = require("./config/db");

const initDb = async () => {
  try {
    console.log("🚀 Đang khởi tạo Database trên Aiven...");

    // 1. Đọc file SQL
    const sqlPath = path.join(__dirname, "../database.sql");
    let sqlContent = fs.readFileSync(sqlPath, "utf8");

    // 2. LỌC SẠCH DATA (QUAN TRỌNG)
    // - Xóa các dòng comment (bắt đầu bằng --) để tránh lỗi bỏ qua lệnh
    // - Xóa các lệnh tạo/chọn DB vì Aiven dùng 'defaultdb'
    const cleanSql = sqlContent
      .split("\n") // Cắt theo dòng
      .filter((line) => !line.trim().startsWith("--")) // Bỏ dòng comment
      .join("\n") // Gộp lại
      .replace(/DROP DATABASE IF EXISTS .*/gi, "")
      .replace(/CREATE DATABASE .*/gi, "")
      .replace(/USE .*/gi, "");

    // 3. Tách lệnh bằng dấu chấm phẩy
    const queries = cleanSql
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    console.log(`👉 Tìm thấy ${queries.length} câu lệnh SQL cần chạy...`);

    // 4. Chạy tuần tự
    for (const query of queries) {
      try {
        await db.query(query);
      } catch (err) {
        // Bỏ qua lỗi bảng đã tồn tại
        if (
          err.code === "ER_TABLE_EXISTS_ERROR" ||
          err.code === "ER_DUP_ENTRY"
        ) {
          // Không làm gì, coi như thành công
        } else {
          console.error(
            `❌ Lỗi lệnh: ${query.substring(0, 30)}... \n   -> ${err.message}`
          );
        }
      }
    }

    console.log("✅ KHỞI TẠO DATABASE THÀNH CÔNG! (Full Tables & Data)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi Script:", err);
    process.exit(1);
  }
};

initDb();
