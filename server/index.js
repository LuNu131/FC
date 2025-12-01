const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { seedAdmins } = require("./controllers/authController");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/players", require("./routes/playerRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/funds", require("./routes/fundRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/traits", require("./routes/traitRoutes")); // MỚI: Route quản lý chỉ số ẩn

app.get("/", (req, res) => {
  res.send("FCDBB API is running!");
});

// Init
seedAdmins();

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
app.use("/api/traits", require("./routes/traitRoutes"));
module.exports = app;
