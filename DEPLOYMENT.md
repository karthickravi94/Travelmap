# TravelMap Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Clone and install
git clone <your-repo>
cd travelmap
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Setup database
npm run db:push
npm run db:seed   # Optional: adds demo data

# 4. Start development server
npm run dev
# Open http://localhost:3000
```

**Demo credentials:** `demo@travelmap.app` / `demo1234`

---

## Free Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variables:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=your-random-32-char-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
4. Deploy

> For persistent data on Vercel, use a free PostgreSQL from [Neon](https://neon.tech) or [Supabase](https://supabase.com) and update `DATABASE_URL` + Prisma provider to `postgresql`.

### Option 2: Cloudflare Pages

1. Build: `npm run build`
2. Output: `.next`
3. Add environment variables in Cloudflare dashboard

### Option 3: Railway (Free tier)

1. Connect GitHub repo
2. Railway auto-detects Next.js
3. Add `DATABASE_URL` for included PostgreSQL

---

## Database Options (Free)

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| SQLite (local) | Unlimited | Best for development |
| Neon PostgreSQL | 512MB | Best for Vercel |
| Supabase | 500MB | Great alternative |
| PlanetScale | 5GB | MySQL-compatible |

To switch to PostgreSQL:
1. Update `prisma/schema.prisma`: `provider = "postgresql"`
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma db push`

---

## GitHub Actions CI/CD

The included `.github/workflows/ci.yml` provides:
- Automatic linting and type checking on PRs
- Build verification
- Auto-deploy to Vercel on merge to main

Required GitHub Secrets:
- `VERCEL_TOKEN` — from Vercel account settings
- `VERCEL_ORG_ID` — from Vercel project settings
- `VERCEL_PROJECT_ID` — from Vercel project settings

---

## Environment Variables Reference

```bash
# Required
DATABASE_URL="file:./dev.db"           # SQLite local
NEXTAUTH_URL="https://your-domain.com"  # Your URL
NEXTAUTH_SECRET="random-32-char-string" # Generate: openssl rand -base64 32

# Optional
MAX_FILE_SIZE="10485760"  # 10MB in bytes
```

---

## Photo Storage

Photos are stored in `public/uploads/` by default.

For production with persistent storage:
- **Cloudflare R2**: Free 10GB/month
- **Backblaze B2**: Free 10GB
- **Supabase Storage**: Free 1GB

Update `src/app/api/upload/route.ts` to use your cloud storage provider.
