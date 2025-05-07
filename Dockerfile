# 使用官方 Node.js LTS 映像作為基礎映像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到容器中
COPY package.json package-lock.json ./

# 刪除本地 node_modules（如果存在）
RUN rm -rf node_modules

# 安裝依賴項
RUN npm install

# 複製專案的所有檔案到容器中
COPY . .

# 暴露應用程式執行的埠
EXPOSE 3000

# 設定環境變數
ENV NODE_ENV=production

# 啟動應用程式
CMD ["npm", "start"]