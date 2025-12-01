# Quick Start Guide

Get your Football Management System running in 5 minutes!

## Step 1: Prerequisites (1 minute)

Make sure you have:

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 2: Supabase Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for initialization
3. Go to **Settings** > **API** and copy:
   - Project URL
   - anon (public) key
   - service_role key

## Step 3: Installation (1 minute)

```bash
# Clone and install
git clone <your-repo-url>
cd quan-ly-doi-bong
npm install
cd client && npm install
cd ../server && npm install
```

## Step 4: Configure Environment (30 seconds)

Create `.env` in project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=any_random_string_here
```

## Step 5: Database Setup (30 seconds)

The database migrations are already applied via MCP tools.

If you need to apply manually, check SETUP.md.

## Step 6: Seed Data (10 seconds)

```bash
cd server
node seed.js
```

## Step 7: Run App (10 seconds)

Terminal 1:

```bash
cd server && npm run dev
```

Terminal 2:

```bash
cd client && npm run dev
```

## Step 8: Login

Open http://localhost:5173

Login with:

- Username: `quangluong`
- Password: `123`

## You're Done!

Now you can:

- View dashboard
- Manage players
- Create training sessions
- Track attendance
- Manage team funds

## Need Help?

- Full setup guide: [SETUP.md](./SETUP.md)
- API documentation: [README.md](./README.md)
- Issues: Contact tranquangluong06@gmail.com

## Pro Tips

### Tip 1: Admin Powers

Login as admin to:

- Create/edit/delete players
- Manage teams
- Create sessions
- Override attendance

### Tip 2: Player Profile

Regular players can:

- View their stats
- Edit their FC card
- Self check-in to sessions
- View team info

### Tip 3: Quick Navigation

Use the navbar shortcuts to jump between pages quickly.

Happy managing!
