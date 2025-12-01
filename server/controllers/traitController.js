const db = require("../config/db");

// Lấy tất cả custom traits
exports.getCustomTraits = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM custom_traits ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo trait mới
exports.createCustomTrait = async (req, res) => {
  const { name, imageUrl, description } = req.body;
  const id = "trait_" + Date.now(); // ID duy nhất
  try {
    await db.query(
      "INSERT INTO custom_traits (id, name, image_url, description) VALUES (?, ?, ?, ?)",
      [id, name, imageUrl, description]
    );
    res.json({ success: true, message: "Đã tạo chỉ số ẩn mới!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
