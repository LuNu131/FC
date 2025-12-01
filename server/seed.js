const supabase = require("./config/supabase");
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    const passwordHash = await bcrypt.hash("123", 10);

    console.log("1. Creating sample players...");
    const { data: players, error: playersError } = await supabase
      .from("players")
      .insert([
        {
          name: "Tran Quang Luong",
          phone: "907987126",
          dob: "2005-01-13",
          height_cm: 177,
          weight_kg: 85,
          position: "Forward",
          jersey_number: 22,
          image_url: "/images/players/LuNu.jpg",
          pac: 75,
          sho: 70,
          pas: 80,
          dri: 75,
          def: 60,
          phy: 70,
          dominant_foot: "Right",
          traits_json: [],
        },
        {
          name: "Trinh Hoang Bao Huy",
          phone: "375244203",
          dob: "2004-03-07",
          height_cm: 170,
          weight_kg: 70,
          position: "Forward",
          jersey_number: 29,
          image_url: "/images/players/HuyNho.jpg",
          pac: 70,
          sho: 65,
          pas: 75,
          dri: 70,
          def: 65,
          phy: 65,
          dominant_foot: "Left",
          traits_json: [],
        },
      ])
      .select();

    if (playersError) throw playersError;
    console.log(`Created ${players.length} players`);

    console.log("2. Creating admin users...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        {
          username: "quangluong",
          password_hash: passwordHash,
          display_name: "Tran Quang Luong",
          role: "admin",
          player_id: players[0].id,
        },
        {
          username: "baohuy",
          password_hash: passwordHash,
          display_name: "Trinh Hoang Bao Huy",
          role: "admin",
          player_id: players[1].id,
        },
      ])
      .select();

    if (usersError) throw usersError;
    console.log(`Created ${users.length} users`);

    console.log("3. Creating teams...");
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .insert([
        {
          name: "Green Team",
          captain_id: players[0].id,
          color_hex: "#10b981",
        },
        {
          name: "Red Team",
          captain_id: players[1].id,
          color_hex: "#ef4444",
        },
      ])
      .select();

    if (teamsError) throw teamsError;
    console.log(`Created ${teams.length} teams`);

    console.log("4. Adding team members...");
    const { error: membersError } = await supabase.from("team_members").insert([
      { team_id: teams[0].id, player_id: players[0].id },
      { team_id: teams[1].id, player_id: players[1].id },
    ]);

    if (membersError) throw membersError;
    console.log("Team members added");

    console.log("\nSeed completed successfully!");
    console.log("\nLogin credentials:");
    console.log("  Username: quangluong / Password: 123");
    console.log("  Username: baohuy / Password: 123");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

seedDatabase();
