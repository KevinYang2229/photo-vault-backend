import pool from "../server.js";

// 新增圖片資料
export const insertPhoto = async (filename, filepath, thumbnailPath) => {
  const query = `
    INSERT INTO tb_photos (filename, filepath, thumbnail_path)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [filename, filepath, thumbnailPath];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// 取得所有圖片
export const getAllPhotos = async () => {
  const query = "SELECT * FROM tb_photos ORDER BY upload_time DESC;";
  const result = await pool.query(query);
  return result.rows;
};

// 刪除圖片
export const deletePhotoById = async (id) => {
  const query = "DELETE FROM tb_photos WHERE id = $1 RETURNING *;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// 取得單張圖片
export const getPhotoById = async (id) => {
  const query = "SELECT * FROM tb_photos WHERE id = $1;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
