# 🚀 Hướng Dẫn Deploy Lên Vercel

## Bước 1: Chuẩn Bị

### 1.1 Đảm bảo bạn đã có:
- Tài khoản [Vercel](https://vercel.com)
- Tài khoản [Supabase](https://supabase.com) với database đã được setup
- Code đã được push lên GitHub/GitLab/Bitbucket

### 1.2 Kiểm tra Supabase
- Database đã được migrate (tất cả tables đã được tạo)
- RLS policies đã được apply
- Copy SUPABASE_URL và SUPABASE_ANON_KEY từ Supabase Dashboard

## Bước 2: Deploy Lên Vercel

### 2.1 Import Project
1. Truy cập [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Chọn repository của bạn
4. Click **"Import"**

### 2.2 Cấu Hình Environment Variables
Trong phần **"Configure Project"**, thêm các biến môi trường sau:

#### Root Environment Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Server Environment Variables:
```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

**Quan trọng:** Thay thế các giá trị trên bằng credentials thực của bạn từ Supabase Dashboard.

### 2.3 Build Settings
Vercel sẽ tự động detect monorepo structure. Đảm bảo:
- **Framework Preset**: Vite
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### 2.4 Deploy
1. Click **"Deploy"**
2. Đợi 2-3 phút để Vercel build và deploy
3. Sau khi deploy xong, bạn sẽ nhận được URL production

## Bước 3: Cập Nhật API URL

### 3.1 Lấy URL của app
Sau khi deploy, bạn sẽ có URL dạng: `https://your-app.vercel.app`

### 3.2 Cập nhật Environment Variables
1. Quay lại Vercel Dashboard
2. Vào **Settings** → **Environment Variables**
3. Thêm/Cập nhật:
```
VITE_API_URL=https://your-app.vercel.app/api
```

### 3.3 Redeploy
Click **"Redeploy"** để áp dụng thay đổi

## Bước 4: Seed Database (Lần Đầu)

### 4.1 Chạy seed script local
```bash
cd server
node seedHash.js
```

Hoặc sử dụng Supabase SQL Editor để insert data thủ công.

### 4.2 Default Admin Accounts
Sau khi seed, bạn có thể login với:
- Username: `quangluong` / Password: `123`
- Username: `baohuy` / Password: `123`

**Khuyến nghị:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

## Bước 5: Kiểm Tra

### 5.1 Test các chức năng:
- ✅ Login/Logout
- ✅ Xem danh sách cầu thủ
- ✅ Thêm/Sửa/Xóa cầu thủ (Admin)
- ✅ Check-in điểm danh
- ✅ Chia đội
- ✅ Quản lý quỹ

### 5.2 Check Network Tab
Mở Chrome DevTools → Network:
- API calls phải đi đến `https://your-app.vercel.app/api`
- Status codes phải là 200 (OK) hoặc 201 (Created)

## Troubleshooting

### ❌ Lỗi 404 khi gọi API
**Giải pháp:** Kiểm tra `vercel.json` đã đúng routes chưa.

### ❌ Database connection failed
**Giải pháp:**
- Kiểm tra SUPABASE_URL và SUPABASE_ANON_KEY
- Đảm bảo RLS policies đã được apply đúng

### ❌ JWT token invalid
**Giải pháp:**
- Đảm bảo JWT_SECRET giống nhau giữa local và production
- Clear localStorage và login lại

### ❌ CORS errors
**Giải pháp:**
- Kiểm tra server/index.js có cấu hình CORS đúng không
- Đảm bảo origin được allow

## Tips Tối Ưu

### 1. Caching
Vercel tự động cache static assets. Không cần config thêm.

### 2. Performance
- ✅ Đã enable code splitting với Vite
- ✅ Đã optimize images với lazy loading
- ✅ Đã minify CSS/JS khi build

### 3. Security
- ✅ RLS đã được enable trên tất cả tables
- ✅ JWT token có expiry (7 days)
- ✅ Passwords được hash với bcrypt
- ✅ Environment variables được bảo vệ

### 4. Monitoring
- Vercel Analytics: Track performance và usage
- Supabase Logs: Monitor database queries
- Browser Console: Check for client errors

## Custom Domain (Optional)

### Thêm domain riêng:
1. Vào Vercel Dashboard → **Settings** → **Domains**
2. Add domain của bạn (vd: `fcdabbaybong.com`)
3. Update DNS records theo hướng dẫn
4. Vercel tự động setup SSL certificate

## Support

Nếu gặp vấn đề:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console errors
4. Contact: tranquangluong06@gmail.com

---

**🎉 Chúc mừng! App của bạn đã live trên production!**
