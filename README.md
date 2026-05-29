# SimpliFly Finland — Travel & Booking Platform

> A premium travel agency website offering curated Sri Lankan tour packages and luxury Maldives resort bookings for Finnish travelers.
> 🌐 **Live Site:** [simpliflyfinland.fi](https://simpliflyfinland.fi)

---

## 🗂️ Project Structure

```
simplifly-finland/
├── frontend/          ← Next.js 14 (App Router) + Tailwind CSS
├── backend/           ← Node.js + Express + TypeScript API
├── nginx/             ← Reverse proxy configuration
├── docs/              ← Guides and documentation
├── .github/
│   └── workflows/     ← CI/CD automation (GitHub Actions)
├── docker-compose.yml         ← Production containers
├── docker-compose.dev.yml     ← Local development containers
└── README.md
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (via Prisma ORM) |
| Cache | Redis |
| Images | Cloudinary |
| Email | Resend |
| DevOps | Docker, GitHub Actions, Hostinger VPS |
| CDN/Security | Cloudflare |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Docker Desktop
- pnpm (`npm install -g pnpm`)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/simplifly-finland.git
cd simplifly-finland
```

### 2. Set up environment variables
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Fill in your actual values (API keys, database URL, etc.)
```

### 3. Start everything with Docker
```bash
docker-compose -f docker-compose.dev.yml up
```

### 4. Access the apps
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 🌿 Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | 🟢 Production — live website |
| `develop` | 🟡 Staging — tested features |
| `feature/*` | 🔵 New features (branch from develop) |
| `hotfix/*` | 🔴 Emergency production fixes |

**Workflow:**
```
feature/my-feature → develop → main (via Pull Request)
```

---

## 🔐 Environment Variables

Never commit `.env` files. Use `.env.example` as a template.

See `backend/.env.example` and `frontend/.env.example` for all required variables.

---

## 📚 Documentation

- [VPS Setup Guide](./docs/VPS_SETUP.md)
- [Technical Specification](./docs/TECHNICAL_SPECIFICATION.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 👨‍💻 Development Team

Built with ❤️ for SimpliFly Finland
