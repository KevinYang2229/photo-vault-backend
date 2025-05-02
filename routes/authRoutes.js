import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// 註冊
router.post("/register", registerUser);

// 登入
router.post("/login", loginUser);

export default router;
