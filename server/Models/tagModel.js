const pool = require("../config/db");

const getAllTags = async () => {
    const { rows } = await pool.query(`SELECT * from tags ORDER BY id`);
    return rows;
}

const createTags = async () => {
    const { rows } = await pool.query(`INSERT INTO tags (name, color) VALUES ($1, $2) RETURNING *`);

    return rows[0];
}

module.exports = { getAllTags, createTags };