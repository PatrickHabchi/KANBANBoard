const pool = require("../config/db");

const getAllColumns = async () => {
    const { rows } = await pool.query(
        "SELECT * from columns ORDER BY position"
    );
    return rows;
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

module.exports = { getAllColumns, createColumn };