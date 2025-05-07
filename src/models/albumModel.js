import pool from "../server.js";

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
