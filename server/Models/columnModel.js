const pool = require("../config/db");

const getAllColumns = async () => {
    const { rows } = await pool.query(
        "SELECT * from columns ORDER BY position"
    );
    return rows;
}

const getColumnById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, position
       FROM columns
      WHERE id = $1`,
    [id]
  );
  return rows[0];
}

const createColumn = async (title) => {
    const { rows } = await pool.query(
        `INSERT INTO columns (title, position)
         VALUES ($1,
           (SELECT COALESCE(MAX(position), 0) + 1 FROM columns)  -- auto-increment
         )
         RETURNING *`,
        [title]
      );
      return rows[0];
}

const deleteColumn = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM columns
      WHERE id = $1
      RETURNING *`,
    [id]
  );
  return rows[0];
};

module.exports = { getAllColumns, createColumn, getColumnById, deleteColumn };