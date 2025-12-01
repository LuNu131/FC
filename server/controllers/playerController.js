const db = require("../config/db");

const sanitizeInt = (val) => (isNaN(parseInt(val)) ? 0 : parseInt(val));

exports.getAllPlayers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM players ORDER BY jersey_number ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM players WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlayer = async (req, res) => {
  const body = req.body;

  try {
    const traitsJson =
      typeof body.traits === "object" ? JSON.stringify(body.traits) : "[]";
    const validDob = body.dob && body.dob !== "" ? body.dob : null;

    const [result] = await db.execute(
      `INSERT INTO players (name, phone, dob, height_cm, weight_kg, position, jersey_number,
       image_url, dominant_foot, pac, sho, pas, dri, def, phy, traits_json, total_attendance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.phone || null,
        validDob,
        sanitizeInt(body.height_cm),
        sanitizeInt(body.weight_kg),
        body.position,
        sanitizeInt(body.jerseyNumber),
        body.imageUrl || null,
        body.dominantFoot || "Right",
        sanitizeInt(body.pac),
        sanitizeInt(body.sho),
        sanitizeInt(body.pas),
        sanitizeInt(body.dri),
        sanitizeInt(body.def),
        sanitizeInt(body.phy),
        traitsJson,
        0,
      ]
    );

    res.json({
      success: true,
      message: "Player created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  const body = req.body;

  try {
    const traitsJson =
      typeof body.traits === "object" ? JSON.stringify(body.traits) : "[]";
    const validDob = body.dob && body.dob !== "" ? body.dob : null;

    await db.execute(
      `UPDATE players SET name=?, phone=?, dob=?, height_cm=?, weight_kg=?,
       position=?, jersey_number=?, image_url=?, dominant_foot=?,
       pac=?, sho=?, pas=?, dri=?, def=?, phy=?, traits_json=?
       WHERE id=?`,
      [
        body.name,
        body.phone || null,
        validDob,
        sanitizeInt(body.height_cm),
        sanitizeInt(body.weight_kg),
        body.position,
        sanitizeInt(body.jerseyNumber),
        body.imageUrl || null,
        body.dominantFoot || "Right",
        sanitizeInt(body.pac),
        sanitizeInt(body.sho),
        sanitizeInt(body.pas),
        sanitizeInt(body.dri),
        sanitizeInt(body.def),
        sanitizeInt(body.phy),
        traitsJson,
        req.params.id,
      ]
    );

    await db.execute("UPDATE users SET display_name=? WHERE player_id=?", [
      body.name,
      req.params.id,
    ]);

    res.json({ success: true, message: "Player updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    await db.execute("DELETE FROM players WHERE id=?", [req.params.id]);
    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
