const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const columnRoutes = require("./Routes/columnRoutes");
const tagRoutes    = require("./Routes/tagRoutes");
const taskRoutes   = require("./Routes/taskRoutes");
const logRoutes    = require("./Routes/logRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/columns", columnRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);