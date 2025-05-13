const pool = require("./config/db");

async function seed() {
  try {
    await pool.query("DELETE FROM logs");
    await pool.query("DELETE FROM tasks");
    await pool.query("DELETE FROM tags");
    await pool.query("DELETE FROM columns");

    const columns = ["BackLog", "To Do", "In Progess", "Done"];
    for (let i = 0; i < columns.length; i++) {
      await pool.query(
        "INSERT INTO columns (title, position) VALUES ($1, $2)",
        [columns[i], i + 1]
      );
    }

    console.log("Database seeded with default columns");
  } catch (err) {
    console.error("Seeding error", err);
    throw err;
  }
}

module.exports = seed;
