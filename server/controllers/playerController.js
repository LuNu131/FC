const supabase = require("../config/supabase");

const sanitizeInt = (val) => (isNaN(parseInt(val)) ? 0 : parseInt(val));

exports.getAllPlayers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("jersey_number", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Player not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlayer = async (req, res) => {
  const body = req.body;

  try {
    const traitsJson = typeof body.traits === "object" ? body.traits : [];
    const validDob = body.dob && body.dob !== "" ? body.dob : null;

    const playerData = {
      name: body.name,
      phone: body.phone || null,
      dob: validDob,
      height_cm: sanitizeInt(body.height_cm),
      weight_kg: sanitizeInt(body.weight_kg),
      position: body.position,
      jersey_number: sanitizeInt(body.jerseyNumber),
      image_url: body.imageUrl || null,
      dominant_foot: body.dominantFoot || "Right",
      pac: sanitizeInt(body.pac),
      sho: sanitizeInt(body.sho),
      pas: sanitizeInt(body.pas),
      dri: sanitizeInt(body.dri),
      def: sanitizeInt(body.def),
      phy: sanitizeInt(body.phy),
      traits_json: traitsJson,
      total_attendance: 0,
    };

    const { data, error } = await supabase
      .from("players")
      .insert([playerData])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: "Player created successfully", data });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  const body = req.body;

  try {
    const traitsJson = typeof body.traits === "object" ? body.traits : [];
    const validDob = body.dob && body.dob !== "" ? body.dob : null;

    const updateData = {
      name: body.name,
      phone: body.phone || null,
      dob: validDob,
      height_cm: sanitizeInt(body.height_cm),
      weight_kg: sanitizeInt(body.weight_kg),
      position: body.position,
      jersey_number: sanitizeInt(body.jerseyNumber),
      image_url: body.imageUrl || null,
      dominant_foot: body.dominantFoot || "Right",
      pac: sanitizeInt(body.pac),
      sho: sanitizeInt(body.sho),
      pas: sanitizeInt(body.pas),
      dri: sanitizeInt(body.dri),
      def: sanitizeInt(body.def),
      phy: sanitizeInt(body.phy),
      traits_json: traitsJson,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("players")
      .update(updateData)
      .eq("id", req.params.id);

    if (error) throw error;

    await supabase
      .from("users")
      .update({ display_name: body.name })
      .eq("player_id", req.params.id);

    res.json({ success: true, message: "Player updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
