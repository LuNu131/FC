# 🚀 Hướng Dẫn Deploy Lên Vercel (MySQL Aiven)

## Tổng Quan
App quản lý đội bóng sử dụng:
- **Frontend**: Vue 3 + Vite (deploy on Vercel)
- **Backend**: Node.js + Express (deploy on Vercel Serverless)
- **Database**: MySQL trên Aiven (cloud hosted)

---

## Bước 1: Chuẩn Bị MySQL Database (Aiven)

### 1.1 Đăng nhập Aiven
1. Truy cập [Aiven Console](https://console.aiven.io/)
2. Đảm bảo MySQL service đang chạy

### 1.2 Lấy Thông Tin Kết Nối
Trong Aiven MySQL service, copy các thông tin:
- **Host**: `your-mysql.aivencloud.com`
- **Port**: `12345`
- **User**: `avnadmin`
- **Password**: `your-password`
- **Database**: `defaultdb`
- **SSL**: Required

### 1.3 Kiểm Tra Database Schema
Đảm bảo tất cả tables đã được tạo:
- players
- users
- sessions
- attendance
- attendance_attempts
- teams
- team_members
- funds
- custom_traits

---

## Bước 2: Push Code Lên GitHub

### 2.1 Tạo Repository
```bash
git init
git add .
git commit -m "Initial commit: Football team management app"
```

### 2.2 Push lên GitHub
```bash
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

---

## Bước 3: Deploy Trên Vercel

### 3.1 Import Project
1. Truy cập [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Chọn repository GitHub của bạn
4. Click **"Import"**

### 3.2 Configure Project Settings
**Framework Preset**: Other (để dùng custom vercel.json)

**Build Settings** (Tự động từ vercel.json):
- Build Command: `cd client && npm install && npm run build`
- Output Directory: `client/dist`

### 3.3 Environment Variables
Thêm các biến môi trường sau:

#### Root Environment Variables:
```bash
VITE_API_URL=/api
```

#### Server Environment Variables (cho Serverless Functions):
```bash
DB_HOST=your-mysql.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
DB_PORT=12345
DB_SSL=true
JWT_SECRET=fc-da-bay-bong-super-secret-key-2024
NODE_ENV=production
```

**⚠️ QUAN TRỌNG**:
- Thay thế `DB_HOST`, `DB_PASSWORD`, `DB_PORT` bằng thông tin thực từ Aiven
- `JWT_SECRET` nên đổi thành key bảo mật riêng của bạn

### 3.4 Deploy
1. Click **"Deploy"**
2. Đợi 2-3 phút để build và deploy
3. Sau khi xong, bạn sẽ có URL: `https://your-app.vercel.app`

---

## Bước 4: Kiểm Tra

### 4.1 Test API
Mở browser console và test:
```javascript
fetch('https://your-app.vercel.app/api/players')
  .then(r => r.json())
  .then(console.log)
```

### 4.2 Test Login
1. Truy cập `https://your-app.vercel.app`
2. Login với:
   - Username: `quangluong` / Password: `123`
   - Username: `baohuy` / Password: `123`

### 4.3 Test Features
- ✅ Xem danh sách cầu thủ
- ✅ Thêm/Sửa/Xóa cầu thủ (Admin)
- ✅ Tạo buổi tập
- ✅ Check-in điểm danh
- ✅ Chia đội tự động
- ✅ Quản lý quỹ

---

## Cấu Trúc Deploy

```
Vercel
├── Frontend (Static Files)
│   └── client/dist/* → Served as static assets
│
└── Backend (Serverless Functions)
    └── server/index.js → API routes /api/*
        └── Connects to MySQL Aiven
```

---

## Troubleshooting

### ❌ Build Failed
**Lỗi**: `Missing script: "build"`
**Giải pháp**:
```json
// root package.json
"scripts": {
  "build": "cd client && npm install && npm run build"
}
```

### ❌ Database Connection Failed
**Lỗi**: `ER_ACCESS_DENIED_ERROR` hoặc `ECONNREFUSED`
**Giải pháp**:
1. Kiểm tra Environment Variables trong Vercel
2. Đảm bảo `DB_SSL=true` đã được set
3. Verify credentials từ Aiven Console
4. Check Aiven firewall (thường allow all by default)

### ❌ API Returns 500
**Giải pháp**:
1. Check Vercel Function Logs: `vercel logs`
2. Kiểm tra MySQL connection string
3. Verify tables exist trong database

### ❌ CORS Errors
**Giải pháp**: Đã configure CORS trong `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### ❌ Function Timeout
**Giải pháp**: Đã set `maxDuration: 30` trong vercel.json

---

## Performance Tips

### 1. Database Connection Pooling
Đã config trong `server/config/db.js`:
```javascript
connectionLimit: 10,
enableKeepAlive: true
```

### 2. Image Optimization
- Images served từ `client/public/images/`
- Lazy loading enabled
- WebP format recommended

### 3. Caching
- Static assets cached tự động bởi Vercel CDN
- API responses: Consider thêm Redis cache

---

## Monitoring

### Vercel Analytics
1. Vào Project Settings → Analytics
2. Enable để track:
   - Page views
   - Performance metrics
   - Geographic distribution

### Aiven MySQL Monitoring
1. Aiven Console → Metrics
2. Monitor:
   - Connection count
   - Query performance
   - Storage usage

---

## Security Checklist

- ✅ Environment variables không commit vào Git
- ✅ JWT secret được set trong Vercel
- ✅ SSL/TLS enabled cho MySQL
- ✅ Passwords hashed với bcrypt
- ✅ CORS configured properly
- ✅ SQL injection prevention với prepared statements

---

## Backup Strategy

### Database Backup (Aiven)
Aiven tự động backup MySQL daily. Manual backup:
1. Aiven Console → Backups
2. Click "Create Backup"

### Code Backup
```bash
git push origin main
```

---

## Update & Redeploy

### Update Code
```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel tự động detect và redeploy.

### Update Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Update values
3. Click "Redeploy" để apply changes

---

## Cost Estimation

### Vercel
- **Hobby Plan**: Free
  - 100GB bandwidth
  - Unlimited deployments
  - Serverless functions

### Aiven MySQL
- **Hobbyist Plan**: $8/month
  - 1GB RAM
  - 5GB storage
  - Daily backups

**Total**: ~$8/month (or free với Aiven free trial)

---

## Support

- **Vercel Issues**: Check [Vercel Docs](https://vercel.com/docs)
- **Aiven Issues**: [Aiven Support](https://aiven.io/support)
- **Code Issues**: Email tranquangluong06@gmail.com

---

## Next Steps

1. ✅ Setup custom domain (optional)
2. ✅ Enable Vercel Analytics
3. ✅ Setup error monitoring (Sentry)
4. ✅ Configure CI/CD pipeline
5. ✅ Add automated tests

---

**🎉 Deployment Complete! Your app is now live!**

Production URL: `https://your-app.vercel.app`
