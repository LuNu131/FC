# ⚡ FC ĐÁ BAY BÓNG - Quick Deploy Guide

## 🎯 Stack
- **Frontend**: Vue 3 + Vite
- **Backend**: Node.js + Express (Serverless on Vercel)
- **Database**: MySQL trên Aiven Cloud

---

## 🚀 Deploy Nhanh trong 5 Phút

### Bước 1: Push lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Bước 2: Deploy trên Vercel
1. Vào https://vercel.com/new
2. Import repository
3. Thêm Environment Variables:

```env
# Root .env (Client)
VITE_API_URL=/api

# Server Environment Variables
DB_HOST=your-mysql.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=defaultdb
DB_PORT=12345
DB_SSL=true
JWT_SECRET=fc-da-bay-bong-super-secret-key-2024
NODE_ENV=production
```

4. Click Deploy!

### Bước 3: Test
- URL: https://your-app.vercel.app
- Login: `quangluong` / `123`

---

## 📁 Cấu Trúc Code

```
project/
├── client/                 # Vue 3 Frontend
│   ├── src/
│   │   ├── views/         # Pages
│   │   ├── components/    # Components
│   │   ├── stores/        # Pinia stores
│   │   └── router/        # Vue Router
│   ├── dist/              # Build output
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── config/           # DB config
│   ├── middleware/       # Auth middleware
│   └── index.js          # Express app
│
├── vercel.json           # Vercel config
├── package.json          # Root build script
└── .env                  # Environment variables
```

---

## 🔧 Cấu Hình Quan Trọng

### vercel.json
```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "builds": [
    { "src": "server/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.js" },
    { "src": "/(.*)", "dest": "client/dist/$1" }
  ]
}
```

### Root package.json
```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build"
  }
}
```

---

## 🗄️ Database Setup (Aiven)

### Lấy Connection Info
1. Login vào https://console.aiven.io/
2. Chọn MySQL service
3. Copy credentials:
   - Host
   - Port
   - User (avnadmin)
   - Password
   - Database (defaultdb)

### Tables Required
```sql
- players
- users
- sessions
- attendance
- attendance_attempts
- teams
- team_members
- funds
- custom_traits
```

Schema file: `databasecautruc.sql`

---

## ✅ Features

### Player Management
- FC-style player cards với 3D effects
- Stats: PAC, SHO, PAS, DRI, DEF, PHY
- Custom traits (gold/silver)
- Image uploads

### Team Management
- Auto team splitting
- Balance algorithm
- Captain assignment

### Attendance System
- Secret icon verification
- Self check-in
- Admin override
- Attempt tracking

### Fund Management
- Transaction history
- Balance tracking
- Admin-only modifications

---

## 🔐 Security

- ✅ JWT authentication (7-day expiry)
- ✅ Bcrypt password hashing
- ✅ SQL injection prevention
- ✅ CORS configured
- ✅ SSL/TLS for database

---

## 🐛 Common Issues

### Build Failed
```bash
# Solution: Check root package.json has build script
"build": "cd client && npm install && npm run build"
```

### Database Connection Error
```bash
# Solution: Verify environment variables in Vercel
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL
```

### API 404
```bash
# Solution: Check vercel.json routes
{ "src": "/api/(.*)", "dest": "server/index.js" }
```

---

## 📊 Monitoring

### Vercel
- Function logs: `vercel logs`
- Analytics: Project Settings → Analytics

### Aiven
- Metrics: Console → Service → Metrics
- Query performance tracking

---

## 💰 Cost

- **Vercel**: Free (Hobby plan)
- **Aiven MySQL**: $8/month (Hobbyist plan)

**Total: ~$8/month**

---

## 📞 Support

- **Email**: tranquangluong06@gmail.com
- **GitHub**: https://github.com/LuongNuong131
- **Docs**: DEPLOY_VERCEL.md (chi tiết hơn)

---

## 🎉 Done!

Sau khi deploy, app sẽ chạy tại:
- Production: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api`

**Happy Deploying! ⚽️**
