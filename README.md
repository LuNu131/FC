# FC ĐÁ BAY BÓNG - Football Team Management System

A premium, feature-rich football team management system with modern UI, built with Vue 3, Node.js, and Supabase.

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

### Player Management

- FC-style player cards with 3D tilt effects
- Comprehensive player profiles with stats (PAC, SHO, PAS, DRI, DEF, PHY)
- Custom traits/playstyles system (gold & silver)
- Physical stats tracking (height, weight, dominant foot)
- Image upload support
- Jersey number management

### Team Management

- Automatic team splitting with balance
- Captain assignment
- Custom team colors
- Team member management
- Real-time team composition display

### Attendance System

- Session creation with date and notes
- Secret icon verification to prevent cheating
- Self check-in for players
- Admin override capabilities
- Attempt tracking and blocking system
- Attendance history with filters

### Fund Management

- Track team contributions
- Transaction history
- Balance calculation
- Contributor tracking
- Admin-only modifications

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/Player)
- Session management
- Secure password hashing with bcrypt

### Modern UI/UX

- Glassmorphism design
- Smooth animations and transitions
- Responsive layout (mobile, tablet, desktop)
- Loading states and skeletons
- Toast notifications
- Empty states with illustrations
- Confirmation dialogs
- Dark theme optimized

## Tech Stack

### Frontend

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Database Client**: Supabase JS

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Authentication**: JWT + bcrypt
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase Client

### Database

- **Provider**: Supabase
- **Type**: PostgreSQL
- **Features**:
  - Row Level Security (RLS)
  - Real-time subscriptions ready
  - JSON support for flexible data
  - Full-text search capabilities

## Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions.

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone <repo-url>
cd quan-ly-doi-bong
```

2. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Configure environment variables (see SETUP.md)

4. Apply database migrations using Supabase dashboard or MCP tools

5. Seed the database

```bash
cd server && node seed.js
```

6. Start development servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

7. Open http://localhost:5173

### Default Credentials

- Username: `quangluong` / Password: `123` (Admin)
- Username: `baohuy` / Password: `123` (Admin)

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (salt rounds: 10)
- Row Level Security on all database tables
- Admin-only endpoints protection
- Attendance verification system
- Attempt blocking for failed verifications
- CORS protection

## Performance

- Lazy loading for images
- Debounced search
- Optimized re-renders
- Code splitting
- Asset optimization
- BMI calculation caching

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Run Tests

```bash
npm test
```

### Build for Production

```bash
cd client && npm run build
```

## Deployment

### Vercel (Recommended)

1. Connect your repository
2. Set environment variables
3. Deploy

### Docker

```bash
docker-compose up
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:

- Email: tranquangluong06@gmail.com
- GitHub: https://github.com/LuongNuong131

---

Made with passion for football and modern web technologies
