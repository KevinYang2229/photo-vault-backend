import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUser, getUserByUsername } from "../models/userModel.js";

// 註冊使用者
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    // 檢查使用者是否已存在
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send("Username already exists.");
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新增使用者到資料庫
    const user = await insertUser(username, hashedPassword);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error.");
  }
};

// 使用者登入
export const loginUser = async (req, res) => {
  try {
    console.log("Registering user:", req.body);

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

    // 產生 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Internal server error.");
  }
};

// 驗證 JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access token is missing.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
};
