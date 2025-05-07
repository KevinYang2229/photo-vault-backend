import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUser, getUserByUsername } from "../models/userModel.js";
import logger from "../utils/logger.js";

// 產生 Access Token 和 Refresh Token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "5m" }, // Access Token 有效期
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }, // Refresh Token 有效期
  );

  return { accessToken, refreshToken };
};

// 註冊使用者
export const registerUser = async (req, res) => {
  try {
    logger.info(`Registering user: ${JSON.stringify(req.body)}`); // 使用 logger

    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn("Missing username or password."); // 使用 logger
      return res.status(400).send("Username and password are required.");
    }

    // 檢查使用者是否已存在
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      logger.warn(`Username already exists: ${username}`); // 使用 logger
      return res.status(400).send("Username already exists.");
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新增使用者到資料庫
    const user = await insertUser(username, hashedPassword);
    logger.info(`User registered successfully: ${JSON.stringify(user)}`); // 使用 logger
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`); // 使用 logger
    res.status(500).send("Internal server error.");
  }
};

// 使用者登入
export const loginUser = async (req, res) => {
  try {
    logger.info("Logging in user:", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    // 查詢使用者
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send("Invalid username or password.");
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid username or password.");
    }

    // 產生 Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    logger.info(`User logged in successfully: ${username}`);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    logger.error("Error logging in user:", error);
    res.status(500).send("Internal server error.");
  }
};

// 刷新 Token
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).send("Refresh token is required.");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token.");

    // 產生新的 Access Token
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "5m" },
    );

    res.json({ accessToken });
  });
};
