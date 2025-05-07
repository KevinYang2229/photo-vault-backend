import express from "express";
import multer from "multer";
import {
  uploadPhoto,
  getPhotos,
  deletePhoto,
} from "../controllers/photoController.js";

const router = express.Router();

// 設定 Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 圖片路由
router.post(
  "/",
  upload.single("photo"),
  (req, res, next) => {
    const additionalData = req.body; // 取得其他參數
    req.additionalData = additionalData; // 將參數附加到請求物件
    next();
  },
  uploadPhoto,
);
router.get("/", getPhotos);
router.delete("/:id", deletePhoto);

export default router;
