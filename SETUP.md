# Football Management System - Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project initialization

### 2. Get Your Credentials

From your Supabase project dashboard:

1. Go to **Settings** > **API**
2. Copy:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 3. Apply Database Migrations

The migrations are already defined. In your Supabase dashboard:

1. Go to **SQL Editor**
2. You can use the `mcp__supabase__apply_migration` tool or run migrations manually

Or use the MCP Supabase tool if available in your environment.

## Installation

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Configure Environment Variables

Create `.env` file in project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# JWT
JWT_SECRET=your_very_secure_random_string_here

# Server
PORT=3000
```

Create `.env` in `client/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Create `.env` in `server/` directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_very_secure_random_string_here
PORT=3000
```

### 3. Seed Database

```bash
cd server
node seed.js
```

This creates:

- 2 sample players
- 2 admin users (quangluong/123, baohuy/123)
- 2 teams

## Running the Application

### Development Mode

Terminal 1 (Server):

```bash
cd server
npm run dev
```

Terminal 2 (Client):

```bash
cd client
npm run dev
```

Access: http://localhost:5173

### Production Build

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## Default Login Credentials

After seeding:

- Username: `quangluong` / Password: `123` (Admin)
- Username: `baohuy` / Password: `123` (Admin)

## Features

- JWT-based authentication
- Player management with FC-style cards
- Team management and auto-splitting
- Attendance tracking with verification system
- Fund management
- Custom traits/playstyles system
- Responsive modern UI with glassmorphism

## Troubleshooting

### "Missing Supabase credentials"

Make sure all .env files are properly configured with your Supabase credentials.

### Database Connection Issues

1. Check your Supabase project is active
2. Verify credentials are correct
3. Check RLS policies are properly set

### Port Already in Use

Change PORT in .env or kill the process:

```bash
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:5173)
```

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS, Pinia
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + bcrypt
- **Styling**: Tailwind CSS with custom glassmorphism theme

## License

MIT
