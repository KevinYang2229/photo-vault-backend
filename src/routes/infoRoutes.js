import express from "express";

const router = express.Router();

// 取得 API 版本資訊
router.get("/version", (req, res) => {
  const userInfo = {
    version: process.env.API_VERSION || "v1",
    name: "Photo Album API",
    description: "API for managing photo albums",
    author: "Kevin",
    license: "MIT",
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(userInfo);
});

// 取得靜態資料夾路徑
router.get("/static-path", (req, res) => {
  const staticPath = process.env.STATIC_FOLDER_PATH
    ? `${process.cwd()}/${process.env.STATIC_FOLDER_PATH}`
    : `${process.cwd()}/public`;
  res.status(200).json({ staticPath });
});

export default router;
