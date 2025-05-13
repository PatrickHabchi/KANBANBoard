// server.js
const express = require("express");
const cors    = require("cors");
require("dotenv").config();
require("./config/db");

const seed         = require("./seed");         
const columnRoutes = require("./Routes/columnRoutes");
const tagRoutes    = require("./Routes/tagRoutes");
const taskRoutes   = require("./Routes/taskRoutes");
const logRoutes    = require("./Routes/logRoutes");


const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await seed();
    console.log("Seeding complete, now starting server.");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }

  app.use("/api/columns", columnRoutes);
  app.use("/api/tags",    tagRoutes);
  app.use("/api/tasks",   taskRoutes);
  app.use("/api/logs",    logRoutes);

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
