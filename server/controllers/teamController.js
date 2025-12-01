const db = require("../config/db");

// Hàm 1: Lấy danh sách đội kèm thành viên (Dùng cho trang hiển thị)
exports.getTeamsWithMembers = async (req, res) => {
  try {
    // Lấy danh sách team và thông tin đội trưởng
    const [teams] = await db.query(`
      SELECT t.*, p.name as captain_name, p.jersey_number as captain_number, p.image_url as captain_image 
      FROM teams t 
      LEFT JOIN players p ON t.captain_id = p.id
    `);

    // Lấy danh sách thành viên cho từng team
    const [members] = await db.query(`
      SELECT tm.team_id, p.id, p.name, p.jersey_number, p.position, p.image_url 
      FROM team_members tm
      JOIN players p ON tm.player_id = p.id
      ORDER BY p.jersey_number ASC
    `);

    // Gộp data: Map members vào đúng team
    const result = teams.map((team) => ({
      ...team,
      members: members.filter((m) => m.team_id === team.id),
      memberCount: members.filter((m) => m.team_id === team.id).length,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi lấy danh sách đội:", err);
    res.status(500).json({ error: "Không thể lấy danh sách đội bóng" });
  }
};

// Hàm 2: Cập nhật thành viên đội (Dùng cho Admin chia lại đội - nếu cần)
exports.updateTeamMembers = async (req, res) => {
  const { teamId, playerIds } = req.body; // playerIds là mảng ID [1, 2, 3...]

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Xóa thành viên cũ của đội này
    await connection.query("DELETE FROM team_members WHERE team_id = ?", [
      teamId,
    ]);

    // 2. Thêm thành viên mới
    if (playerIds && playerIds.length > 0) {
      const values = playerIds.map((pid) => [teamId, pid]);
      await connection.query(
        "INSERT INTO team_members (team_id, player_id) VALUES ?",
        [values]
      );
    }

    await connection.commit();
    res.json({ message: "Cập nhật đội hình thành công" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};
