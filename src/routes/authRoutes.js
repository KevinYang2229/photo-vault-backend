import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// 註冊
router.post("/register", registerUser);

// 登入
router.post("/login", loginUser);

// 刷新 Token
router.post("/refresh-token", refreshToken);

export default router;
