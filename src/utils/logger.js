import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // 預設日誌等級
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(), // 輸出到控制台
    new transports.File({ filename: "logs/app.log" }), // 輸出到檔案
  ],
});

export default logger;
