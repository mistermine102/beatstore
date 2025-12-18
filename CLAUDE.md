# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BeatStore** is a full-stack web application for buying, selling, and sharing music production assets (beats, samples, drum kits, loops). It's a social marketplace for music producers deployed on Vercel.

- **Frontend**: Vue 3 + TypeScript SPA
- **Backend**: Node.js Express API with MongoDB
- **Deployment**: Vercel (serverless)
- **Key Features**: User authentication, track uploads, Stripe payments, audio waveform visualization, social features (follows, likes, comments), admin moderation

## Quick Start Commands

### Frontend Development

```bash
# Install dependencies
cd client && npm install

# Start development server (with hot module reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking only (used before build)
vue-tsc -b
```

### Backend Development

```bash
# Install dependencies
cd server && npm install

# Start development server with auto-reload (nodemon)
npm run dev

# Start production server
npm start
```

### Full Stack Setup

```bash
# From root directory
# 1. Install frontend dependencies
cd client && npm install && cd ..

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Start both (in separate terminals):
# Terminal 1: cd client && npm run dev
# Terminal 2: cd server && npm run dev
```

## Development Prerequisites

- Node.js 18+
- MongoDB connection string (local or MongoDB Atlas)
- AWS S3 credentials (for file uploads)
- Stripe API keys (for payment testing)
- Nodemailer configuration (for email functionality)

All must be configured in `server/.env` file.

## Architecture Overview

### Directory Structure

```
beatstore/
├── client/              # Vue 3 + TypeScript frontend
│   ├── src/
│   │   ├── views/       # Page components (20+ pages, auth, upload, admin, etc.)
│   │   ├── components/  # Reusable UI components
│   │   ├── stores/      # Pinia state management (auth, audio player, toasts)
│   │   ├── api/         # Axios HTTP client with interceptors & token refresh
│   │   ├── router.ts    # Vue Router with auth guards
│   │   ├── constants.ts # Genre, mood, key, instrument metadata
│   │   └── main.ts      # Entry point
│   ├── vite.config.ts   # Build configuration
│   └── tailwind.config.js
├── server/              # Express.js backend API
│   ├── controllers/     # Business logic (auth, tracks, profiles, admin, payments)
│   ├── routes/          # Express route definitions (/api/*)
│   ├── models/          # Mongoose schemas (User, Track, License, Like, Follow, Report)
│   ├── middleware/      # Auth, error handling, validation, file type checking
│   ├── utils/           # Helper functions (audio duration, waveform, formatting)
│   ├── templates/       # EJS email templates
│   ├── s3.js            # AWS S3 integration (presigned URLs)
│   ├── stripe.js        # Stripe configuration
│   ├── emailTransport.js # Nodemailer configuration
│   └── index.js         # Express app setup (entry point)
├── vercel.json          # Deployment configuration
└── [Root config files]
```

### Core Data Models

1. **User**: Credentials, profile, uploads, follows, Stripe integration
2. **Track**: Metadata (title, BPM, key, genre, mood), audio file, cover art, comments, likes
3. **License**: Track usage rights
4. **Follow**: User relationships
5. **Like**: Track and comment likes
6. **Report**: Content abuse reports
7. **PopularTrack**: Featured/trending tracks
8. **FeaturedProfile**: Promoted profiles

### API Routes

- `/api/auth` - Login, registration, logout, token refresh, password reset
- `/api/tracks` - Track CRUD, streaming, likes, comments, search/filter
- `/api/profile` - User profiles, follows, settings
- `/api/admin` - Admin operations (verify tracks, manage reports, featured content)
- `/api/licenses` - License management
- `/api/payments` - Stripe payment processing & webhooks
- `/api/reports` - Abuse report submission

## Key Implementation Details

### Authentication & Authorization

- **JWT-based**: Access tokens (short-lived) + refresh tokens (HTTP-only cookies)
- **Token Refresh**: Automatic via Axios interceptor (`client/src/api/appApi.ts`)
- **Protected Routes**: Vue Router guards check auth state
- **Backend Verification**: Middleware validates JWT on protected endpoints

**Files**:
- Frontend: `client/src/stores/auth.ts`, `client/src/api/appApi.ts`
- Backend: `server/middleware/auth.js`, `server/controllers/auth.js`

### File Uploads & Storage

- **Audio Files**: Uploaded to AWS S3, validated by MIME type and file size
- **Images**: Compressed via Sharp, stored on S3
- **Multer Config**: `server/multer.js` (defines size limits: 50MB audio, 5MB images)
- **S3 Presigned URLs**: Generated server-side for secure, temporary download access
- **Metadata Extraction**: Audio metadata (BPM, duration) extracted via music-metadata library

**Files**: `server/s3.js`, `server/multer.js`, `server/controllers/tracks.js`

### Audio Waveform Generation

- Waveform samples generated during track upload
- Samples used for visual display in frontend audio player
- Stored as array in Track model

**Files**:
- Backend: `server/utils/getWaveformSamples.js`, `server/controllers/tracks.js`
- Frontend: `client/src/components/InteractiveWaveform.vue`

### Payment Processing (Stripe)

- Track purchases processed via Stripe
- Webhook at `/api/payments/webhook` confirms transactions
- Licenses created upon successful payment
- Artist receives funds to connected Stripe account

**Files**:
- Backend: `server/controllers/payments.js`, `server/stripe.js`
- Frontend: Checkout flows in views

### Email Notifications

- User registration verification emails
- Password reset emails
- Uses Nodemailer with EJS templating
- Email templates in `server/templates/`

**Files**: `server/emails/emails.js`, `server/emailTransport.js`

### Search & Filtering

- Tracks filterable by: genre, mood, key, BPM range, instruments
- Full-text search on track titles/descriptions
- Constants shared between frontend and backend: `constants.ts` and `constants.js`

**Files**:
- Frontend: `client/src/components/FiltersPanel.vue`
- Backend: `server/controllers/tracks.js` (filter logic)

### Admin Features

- Verify unverified track uploads
- Review and handle abuse reports
- Manage featured profiles and popular tracks
- Admin-only routes protected by middleware checking user role

**Files**:
- Frontend: `client/src/views/Admin.vue`, `client/src/views/AdminManageUploads.vue`
- Backend: `server/routes/admin.js`, `server/controllers/admin.js`

## Deployment Configuration

### Vercel Setup

- Frontend builds as static site (output to `dist/` folder)
- Backend deployed as Node.js serverless function
- Routes configured in `vercel.json`:
  - `/api/*` → routed to Express function
  - `/assets/*`, `/public/*` → static assets
  - All other routes → fallback to SPA (`index.html`)

**Database Reconnection**: Express app handles MongoDB reconnection on each serverless invocation (connection pooling considerations).

## Common Development Patterns

### Adding a New API Endpoint

1. Create controller function in `server/controllers/[resource].js`
2. Add route in `server/routes/[resource].js` (call controller)
3. Register route in `server/index.js`: `app.use('/api/[resource]', routes)`
4. Add input validation middleware if needed
5. Use Axios in frontend to call: `apiClient.post('/api/[resource]/...', data)`

### Adding a New Page/View

1. Create Vue component in `client/src/views/[Page].vue`
2. Add route to `client/src/router.ts` with meta-data (auth required, etc.)
3. Add navigation link to layout/navigation component
4. Use components from `client/src/components/` for UI

### State Management (Pinia)

- Auth state: `client/src/stores/auth.ts` (user login, tokens, logout)
- Audio player state: `client/src/stores/audioPlayer.ts` (currently playing track, playback state)
- Toast notifications: `client/src/stores/toast.ts` (temporary notifications)

Use `useAuthStore()`, `useAudioPlayerStore()`, etc. in components.

### Making API Calls

Import and use `apiClient` from `client/src/api/appApi.ts`:
```typescript
import { apiClient } from '@/api/appApi'
apiClient.get('/tracks', { params: { genre: 'hip-hop' } })
```

The client automatically handles token refresh on 401 responses.

## Important Notes

### Rate Limiting

Global rate limit configured in `server/limiters.js`. Different routes may have different limits to prevent abuse.

### Error Handling

- Frontend: Errors displayed via toast notifications (Pinia toast store)
- Backend: Global error handler in middleware catches and formats errors
- API returns consistent error response format

**Files**: `server/middleware/errorHandling.js`

### Type Safety

- Frontend uses TypeScript throughout
- Backend is JavaScript but has JSDoc type hints
- Type definitions in `client/src/types/`
- Always run `vue-tsc -b` before building to catch type errors

### Git Workflow

- Main branch is production (deployed to `wavsmarket.com`)
- Feature branches used for development
- Modified files tracked in git (see git status at session start)

## Vercel-Specific Considerations

- Database connections use connection pooling (Mongoose handles this automatically)
- File uploads go to S3, not ephemeral serverless storage
- Environment variables configured in Vercel dashboard
- Build command: `npm run build` in each workspace