const pool = require('../config/db');

const getAllLogs = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM logs ORDER BY timestamp DESC`
    );

    return rows;
}

const createLog = async (task_id, action) => {
    const { rows } = await pool.query(
        `INSERT INTO logs (task_id, action) VALUES ($1, $2) RETURNING *`,
        [task_id, action]
    );
    return rows[0];
}

module.exports = { getAllLogs, createLog };