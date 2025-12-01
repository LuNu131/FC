# 🚀 HƯỚNG DẪN BẮT ĐẦU

## ⚡ Quick Start

### 1. Cài Đặt Dependencies
```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Config Database (Aiven MySQL)
Tạo file `server/.env`:
```env
DB_HOST=your-mysql.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=defaultdb
DB_PORT=12345
DB_SSL=true
JWT_SECRET=fc-da-bay-bong-super-secret-key-2024
NODE_ENV=development
```

### 3. Chạy Local
```bash
# Terminal 1 - Backend (port 3000)
cd server
npm run dev

# Terminal 2 - Frontend (port 5173)
cd client
npm run dev
```

Mở http://localhost:5173

---

## 📦 Build Production
```bash
npm run build
```
Output: `client/dist/`

---

## 🌐 Deploy Vercel

### Bước 1: Push GitHub
```bash
git add .
git commit -m "Deploy FC Đá Bay Bóng"
git push origin main
```

### Bước 2: Vercel Dashboard
1. Import project: https://vercel.com/new
2. Add Environment Variables:
```
DB_HOST=your-mysql.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=defaultdb
DB_PORT=12345
DB_SSL=true
JWT_SECRET=fc-da-bay-bong-super-secret-key-2024
NODE_ENV=production
VITE_API_URL=/api
```
3. Deploy!

---

## 📚 Documentation

- `README_DEPLOY.md` - Quick deploy guide
- `DEPLOY_VERCEL.md` - Chi tiết deploy
- `THAY_DOI.md` - Tóm tắt thay đổi
- `databasecautruc.sql` - Database schema

---

## 🔐 Default Login
- Username: `quangluong` / Password: `123` (Admin)
- Username: `baohuy` / Password: `123` (Admin)

---

## 🎯 Tech Stack
- **Frontend**: Vue 3 + Vite + Pinia + Tailwind
- **Backend**: Node.js + Express + JWT
- **Database**: MySQL (Aiven Cloud)
- **Deploy**: Vercel (Frontend + Serverless Backend)

---

## ✅ Features
- ⚽ Quản lý cầu thủ (FC-style cards)
- 👥 Chia đội tự động
- 📋 Điểm danh với secret icon
- 💰 Quản lý quỹ
- 🎨 Dark theme optimized
- 📱 Responsive design

---

**🎉 Sẵn sàng deploy! Good luck!**
