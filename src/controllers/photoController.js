import sharp from "sharp";
import fs from "fs/promises";
import {
  insertPhoto,
  getAllPhotos,
  deletePhotoById,
  getPhotoById,
} from "../models/photoModel.js";

// 上傳圖片
export const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    const { filename, path: filepath } = file;

    // 產生高解析度縮圖
    const thumbPath = filepath.replace(/(\.\w+)$/, "_thumb$1");
    await sharp(filepath)
      .resize({ width: 600 }) // 提高縮圖寬度到 600px
      .jpeg({ quality: 90 }) // 設定 JPEG 壓縮品質為 90
      .toFile(thumbPath);

    // 儲存資料到資料庫
    const photo = await insertPhoto(filename, filepath, thumbPath);
    res.status(201).json(photo);
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).send("Internal server error.");
  }
};

// 取得所有圖片
export const getPhotos = async (req, res) => {
  try {
    const photos = await getAllPhotos();
    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).send("Internal server error.");
  }
};

// 刪除圖片
export const deletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await getPhotoById(id);

    if (!photo) return res.status(404).send("Photo not found.");

    // 刪除實體檔案
    await fs.unlink(photo.filepath);
    await fs.unlink(photo.thumbnail_path);

    // 刪除資料庫紀錄
    await deletePhotoById(id);
    res.send({ msg: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).send("Internal server error.");
  }
};
