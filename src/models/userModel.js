import pool from "../server.js";

// 新增使用者
export const insertUser = async (username, hashedPassword) => {
  const query = `
    INSERT INTO tb_users (username, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [username, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// 根據使用者名稱查詢使用者
export const getUserByUsername = async (username) => {
  const query = "SELECT * FROM tb_users WHERE username = $1;";
  const result = await pool.query(query, [username]);
  return result.rows[0];
};
