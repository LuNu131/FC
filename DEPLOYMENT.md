# Deployment Guide

Quick guide for deploying FC ĐÁ BAY BÓNG to production.

## Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Environment variables configured
- [ ] Build test passed locally
- [ ] All features tested

## Environment Variables

### Production .env

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# JWT Secret (use strong random string)
JWT_SECRET=your_very_secure_production_secret

# Server
PORT=3000
NODE_ENV=production
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Set Environment Variables**
   Go to Vercel Dashboard > Settings > Environment Variables

5. **Production Deploy**

```bash
vercel --prod
```

### Option 2: Docker

1. **Build Image**

```bash
docker-compose build
```

2. **Run**

```bash
docker-compose up -d
```

3. **Check Logs**

```bash
docker-compose logs -f
```

### Option 3: Manual VPS

1. **Build Frontend**

```bash
cd client
npm run build
# Upload dist/ folder to server
```

2. **Setup Backend**

```bash
cd server
npm install --production
pm2 start index.js --name fcdbb-api
```

3. **Setup Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/fcdbb/client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment

### 1. Health Check

```bash
curl https://your-domain.com/api/
```

### 2. Test Login

Navigate to your domain and test login with default credentials.

### 3. Create Production Admin

Use the registration endpoint to create your production admin user.

### 4. Update DNS

Point your domain to deployment IP/URL.

## Monitoring

### Vercel

- Check Analytics in Vercel Dashboard
- Monitor function logs

### Docker

```bash
# Check container status
docker ps

# View logs
docker-compose logs -f api

# Restart services
docker-compose restart
```

### PM2 (VPS)

```bash
# Status
pm2 status

# Logs
pm2 logs fcdbb-api

# Restart
pm2 restart fcdbb-api
```

## Backup Strategy

### Database

Supabase provides automatic backups. For manual backup:

1. Go to Supabase Dashboard
2. Database > Backups
3. Download backup

### Code

Keep your code in Git and push regularly.

## Rollback

If deployment fails:

```bash
# Vercel
vercel rollback

# Docker
docker-compose down
git checkout previous-version
docker-compose up -d

# PM2
pm2 stop fcdbb-api
git checkout previous-version
npm install
pm2 restart fcdbb-api
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] Supabase RLS policies active
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if applicable)

## Performance Tips

1. Enable Gzip compression
2. Use CDN for static assets
3. Enable browser caching
4. Monitor Supabase usage
5. Optimize images

## Troubleshooting

### Build Fails

- Check Node version (18+)
- Clear node_modules and reinstall
- Check for syntax errors

### API Not Connecting

- Verify environment variables
- Check CORS settings
- Confirm Supabase credentials

### Database Errors

- Check RLS policies
- Verify migrations applied
- Check Supabase dashboard for errors

## Support

Issues? Contact:

- Email: tranquangluong06@gmail.com
- Check logs first
- Review error messages

## Updates

To update production:

```bash
git pull origin main
npm install
npm run build
# Deploy using your chosen method
```

---

Good luck with your deployment!
