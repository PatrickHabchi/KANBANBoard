const pool = require("../config/db");

const getAllColumns = async () => {
    const { rows } = await pool.query(
        "SELECT * from columns ORDER BY position"
    );
    return rows;
}

const createColumn = async () => {
    const { rows } = pool.query(
        "INSERT INTO columns (title, position) VALUES ($1, $2) RETURNING [title, position]"
    );

    return rows[0];
}

module.exports = { getAllColumns, createColumn };