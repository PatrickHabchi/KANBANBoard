const pool = require("../config/db");


const getAllTasks = async () => {
  const { rows } = await pool.query(`
    SELECT t.*, c.title AS column_title, tg.name AS tag_name
    FROM tasks t
    JOIN columns c ON t.column_id = c.id
    LEFT JOIN tags tg ON t.tag_id = tg.id
    ORDER BY t.column_id, t.position
  `);
  return rows;
};

const getTaskById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, title, column_id, position
       FROM tasks
      WHERE id = $1`,
    [id]
  );
  return rows[0];
}


const createTask = async ({ title, description, column_id, tag_id }) => {
  const posRes = await pool.query(
    `SELECT COALESCE(MAX(position), 0) + 1 AS next_pos   -- ← typo fixed
     FROM tasks
     WHERE column_id = $1`,
    [column_id]
  );
  const position = posRes.rows[0].next_pos;          

  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, column_id, tag_id, position)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, column_id, tag_id, position]
  );
  return rows[0];
};

const updateTask = async (
  id,
  { title, description, column_id, tag_id, position }
) => {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET title=$1, description=$2, column_id=$3, tag_id=$4, position=$5
     WHERE id=$6
     RETURNING *`,
    [title, description, column_id, tag_id, position, id]
  );
  return rows[0];
};

const deleteTask = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  
  return rows[0];
}


module.exports = { getAllTasks, createTask, updateTask, getTaskById, deleteTask};
