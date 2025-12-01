const db = require("./config/db");
const bcrypt = require("bcryptjs");

const resetPasswords = async () => {
  try {
    console.log("🔄 Đang reset mật khẩu toàn bộ user về '123'...");

    // 1. Tạo hash chuẩn cho '123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123", salt);

    // 2. Update vào Database
    await db.query("UPDATE users SET password = ?", [hashedPassword]);

    console.log("✅ Thành công! Mật khẩu tất cả tài khoản đã là: 123");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

resetPasswords();
