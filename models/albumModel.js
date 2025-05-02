import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 新增相簿
export const insertAlbum = async (name, description) => {
  const query = `
    INSERT INTO tb_albums (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [name, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// 取得所有相簿
export const getAllAlbums = async () => {
  const query = "SELECT * FROM tb_albums ORDER BY created_at DESC;";
  const result = await pool.query(query);
  return result.rows;
};

// 刪除相簿
export const deleteAlbumById = async (id) => {
  const query = "DELETE FROM tb_albums WHERE id = $1 RETURNING *;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
