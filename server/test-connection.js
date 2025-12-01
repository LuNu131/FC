// server/test-connection.js
require("dotenv").config();
const db = require("./config/db");

const testConnection = async () => {
  console.log("🔍 Đang kiểm tra kết nối database...\n");

  console.log("📋 Thông tin kết nối:");
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(
    `   Password: ${
      process.env.DB_PASSWORD
        ? "***" + process.env.DB_PASSWORD.slice(-4)
        : "KHÔNG CÓ"
    }\n`
  );

  try {
    // Test query đơn giản
    const [rows] = await db.query("SELECT 1+1 as result, NOW() as time");
    console.log("✅ Kết nối thành công!");
    console.log(`   Kết quả test: ${rows[0].result}`);
    console.log(`   Server time: ${rows[0].time}\n`);

    // Kiểm tra tables
    const [tables] = await db.query("SHOW TABLES");
    console.log(`📊 Database có ${tables.length} bảng:`);
    tables.forEach((t) => console.log(`   - ${Object.values(t)[0]}`));

    // Đếm số cầu thủ
    const [playerCount] = await db.query(
      "SELECT COUNT(*) as total FROM players"
    );
    console.log(`\n👥 Tổng số cầu thủ: ${playerCount[0].total}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi kết nối:");
    console.error(`   Message: ${err.message}`);
    console.error(`   Code: ${err.code}`);
    console.error(`   SQL State: ${err.sqlState || "N/A"}\n`);

    if (err.code === "ENOTFOUND") {
      console.log("💡 Gợi ý: Kiểm tra lại DB_HOST trong file .env");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("💡 Gợi ý: Username hoặc password không đúng");
    } else if (err.code === "ECONNREFUSED") {
      console.log("💡 Gợi ý: Kiểm tra DB_PORT hoặc firewall");
    }

    process.exit(1);
  }
};

testConnection();
