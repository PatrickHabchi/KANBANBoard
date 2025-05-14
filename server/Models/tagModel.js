const pool = require("../config/db");

const getAllTags = async  () => {
  const { rows } = await pool.query(
    `SELECT id, name FROM tags ORDER BY name`
  );
  return rows;
}

const createTag = async (name) => {
  const { rows } = await pool.query(
    `INSERT INTO tags(name) VALUES($1)
     ON CONFLICT(name) DO NOTHING
     RETURNING *`,
    [name]
  );
  if (rows.length) return rows[0];

  const { rows: existing } = await pool.query(
    `SELECT id, name FROM tags WHERE name = $1`,
    [name]
  );
  return existing[0];
}

module.exports = { getAllTags, createTag };
