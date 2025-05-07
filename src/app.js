import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import photoRoutes from "./routes/photoRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

var corsOptions = {
  origin: "http://localhost:5173", // 允許的來源
  preflightContinue: false, // 是否在預檢請求中繼續
  optionsSuccessStatus: 204, // 預檢請求的成功狀態碼
  exposedHeaders: ["Content-Disposition"], // 允許的回應標頭
  allowedHeaders: ["Content-Type", "Authorization"], // 允許的請求標頭
  credentials: true, // 是否允許攜帶憑證
  maxAge: 600, // 預檢請求的快取時間
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// 中介軟體
app.use(cors(corsOptions));
app.use(express.json());

// 提供靜態檔案存取
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 公開路由（不需要驗證）
app.use("/", infoRoutes); // 提供資訊的路由
app.use("/api/v1/auth", authRoutes); // 認證路由
app.use("/info", infoRoutes);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 需要驗證的路由
app.use(authenticateToken); // 從這裡開始，所有路由都需要驗證
app.use("/api/v1/photos", photoRoutes);
app.use("/api/v1/albums", albumRoutes);

export default app;
