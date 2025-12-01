const db = require("../config/db");
const ICONS = require("../config/icons");

// 1. Lấy danh sách (Giữ nguyên)
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sessions ORDER BY date DESC");
    const sessions = await Promise.all(
      rows.map(async (session) => {
        const [attendees] = await db.query(
          `SELECT p.id, p.name, p.image_url, p.jersey_number, p.position 
         FROM attendance a 
         JOIN players p ON a.player_id = p.id 
         WHERE a.session_id = ?`,
          [session.id]
        );
        return { ...session, attendees };
      })
    );
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Tạo buổi tập (UPDATE: Lưu secret_icon_id)
exports.createSession = async (req, res) => {
  const { date, note, secretIconId } = req.body;
  const id = "s" + Date.now().toString(36);
  try {
    await db.query(
      "INSERT INTO sessions (id, date, note, status, secret_icon_id) VALUES (?, ?, ?, 'OPEN', ?)",
      [id, date, note, secretIconId]
    );
    res.json({ message: "Tạo buổi tập thành công", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. User tự điểm danh (UPDATE: Verify Logic)
exports.selfCheckIn = async (req, res) => {
  const playerId = req.user.playerId;
  const { sessionId, selectedIconId } = req.body;

  if (!playerId) return res.status(400).json({ message: "Lỗi thông tin user" });

  try {
    // A. Check Blocked
    const [attempts] = await db.query(
      "SELECT * FROM attendance_attempts WHERE session_id = ? AND player_id = ?",
      [sessionId, playerId]
    );

    if (attempts.length > 0 && attempts[0].blocked) {
      return res.status(403).json({
        message: "🚫 RA ĐẢO: Bạn đã bị chặn do chọn sai Icon bảo mật!",
      });
    }

    // B. Get Session Info
    const [sessions] = await db.query(
      "SELECT status, secret_icon_id FROM sessions WHERE id = ?",
      [sessionId]
    );
    if (sessions.length === 0)
      return res.status(404).json({ message: "Không tìm thấy buổi tập" });

    const session = sessions[0];
    if (session.status !== "OPEN")
      return res.status(400).json({ message: "Đã đóng sổ!" });

    // C. Verify Icon
    if (selectedIconId !== session.secret_icon_id) {
      // SAI: Block luôn
      await db.query(
        `INSERT INTO attendance_attempts (session_id, player_id, attempt_count, blocked) 
         VALUES (?, ?, 1, TRUE) 
         ON DUPLICATE KEY UPDATE attempt_count = attempt_count + 1, blocked = TRUE`,
        [sessionId, playerId]
      );
      return res.status(403).json({
        message: "❌ Sai mã bảo mật! Bạn đã bị chặn vĩnh viễn ở buổi này.",
      });
    }

    // D. Success
    await db.query(
      "INSERT IGNORE INTO attendance (session_id, player_id) VALUES (?, ?)",
      [sessionId, playerId]
    );
    res.json({ success: true, message: "Điểm danh thành công! ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. API Lấy Options ngẫu nhiên (Mới)
exports.getVerifyOptions = async (req, res) => {
  const { sessionId } = req.query;
  try {
    const [rows] = await db.query(
      "SELECT secret_icon_id FROM sessions WHERE id = ?",
      [sessionId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Session not found" });

    const correctIconId = rows[0].secret_icon_id;

    // Lấy 2 icon sai ngẫu nhiên
    const wrongIcons = ICONS.filter((i) => i.id !== correctIconId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const correctIcon = ICONS.find((i) => i.id === correctIconId);

    // Trộn icon đúng vào
    const options = [...wrongIcons, correctIcon].sort(
      () => 0.5 - Math.random()
    );

    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... (Giữ nguyên các hàm Admin: adminCheckIn, adminRemoveCheckIn, deleteSession, updateSessionStatus)
exports.adminCheckIn = async (req, res) => {
  /* Code cũ */
};
exports.adminRemoveCheckIn = async (req, res) => {
  /* Code cũ */
};
exports.deleteSession = async (req, res) => {
  /* Code cũ */
};
exports.updateSessionStatus = async (req, res) => {
  /* Code cũ */
};
