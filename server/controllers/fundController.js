const db = require("../config/db");

// 1. Lấy danh sách quỹ
exports.getAllFunds = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM funds ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Tạo quỹ mới
exports.createFund = async (req, res) => {
  const { contributorName, amount, note } = req.body;
  const id = "f" + Date.now().toString(36);
  try {
    await db.query(
      "INSERT INTO funds (id, contributor_name, amount, note) VALUES (?, ?, ?, ?)",
      [id, contributorName, amount, note]
    );
    res.json({ message: "Đã thêm quỹ thành công", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Xóa quỹ (SỬA LỖI: Đã thêm hàm này)
exports.deleteFund = async (req, res) => {
  try {
    await db.query("DELETE FROM funds WHERE id = ?", [req.params.id]);
    res.json({ message: "Đã xóa quỹ thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
