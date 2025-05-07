import express from "express";
import {
  createAlbum,
  getAlbums,
  deleteAlbum,
} from "../controllers/albumController.js";

const router = express.Router();

// 新增相簿
router.post("/", createAlbum);

// 取得所有相簿
router.get("/", getAlbums);

// 刪除相簿
router.delete("/:id", deleteAlbum);

export default router;
