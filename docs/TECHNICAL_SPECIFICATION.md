# Technical Specification — SimpliFly Finland
**Version:** 1.0 | **Last Updated:** 2026-05-29

---

## 1. Business Overview

**Client:** SimpliFly Finland  
**Domain:** simpliflyfinland.fi  
**Purpose:** A premium travel agency platform offering:
- Curated Sri Lankan tour packages
- Luxury Maldives resort bookings
- Targeted at Finnish travelers

---

## 2. System Architecture

```
                        ┌─────────────────┐
                        │   Cloudflare    │  ← CDN, DDoS, SSL
                        │   (Global CDN)  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Hostinger VPS  │  ← Ubuntu 22.04 LTS
                        │  (Docker Host)  │
                        └────────┬────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │          Nginx (Port 80/443)         │  ← Reverse Proxy
              └──────┬───────────────────────┬───────┘
                     │                       │
          ┌──────────▼───────┐   ┌───────────▼──────────┐
          │  Next.js :3000   │   │  Express.js :5000    │
          │  (Frontend App)  │   │  (REST API Backend)  │
          └──────────────────┘   └──────────┬───────────┘
                                            │
                              ┌─────────────▼────────────┐
                              │     PostgreSQL :5432      │
                              │    (Primary Database)     │
                              └─────────────┬────────────┘
                                            │
                              ┌─────────────▼────────────┐
                              │       Redis :6379         │
                              │   (In-Memory Cache)       │
                              └──────────────────────────┘
```

---

## 3. Frontend Specification (Next.js)

### Framework
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui component library

### Routing Structure
```
app/
├── (public)/                        ← Public pages (no auth required)
│   ├── page.tsx                     → / (Home)
│   ├── who-we-are/page.tsx          → /who-we-are
│   ├── sri-lanka-tours/
│   │   ├── page.tsx                 → /sri-lanka-tours
│   │   └── [categoryId]/
│   │       ├── page.tsx             → /sri-lanka-tours/:category
│   │       └── [packageId]/page.tsx → /sri-lanka-tours/:category/:package
│   ├── maldives-resorts/
│   │   ├── page.tsx                 → /maldives-resorts
│   │   └── [categoryId]/
│   │       ├── page.tsx             → /maldives-resorts/:category
│   │       └── [resortId]/page.tsx  → /maldives-resorts/:category/:resort
│   ├── blog/
│   │   ├── page.tsx                 → /blog
│   │   └── [slug]/page.tsx          → /blog/:slug
│   └── gallery/page.tsx             → /gallery
│
├── (auth)/                          ← Authentication pages
│   ├── login/page.tsx               → /login
│   └── register/page.tsx            → /register
│
└── (admin)/                         ← Protected admin panel
    ├── layout.tsx                   ← Checks ADMIN role, redirects if not
    ├── dashboard/page.tsx           → /admin/dashboard
    ├── packages/
    │   ├── page.tsx                 → /admin/packages (list)
    │   ├── new/page.tsx             → /admin/packages/new
    │   └── [id]/edit/page.tsx       → /admin/packages/:id/edit
    ├── bookings/page.tsx            → /admin/bookings
    ├── users/page.tsx               → /admin/users
    └── blog/
        ├── page.tsx                 → /admin/blog
        └── new/page.tsx             → /admin/blog/new
```

### Performance Strategy
- ISR (Incremental Static Regeneration) on all tour/resort pages (revalidate: 3600s)
- Next.js `<Image>` for all media (auto WebP, lazy-load)
- Cloudinary for image hosting and transformation
- Static generation for Homepage, About, Blog index

---

## 4. Backend Specification (Express.js)

### Framework & Language
- Node.js 20 LTS
- Express.js 4.x
- TypeScript (strict mode)
- Prisma ORM (PostgreSQL)

### API Endpoints

#### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create customer account | No |
| POST | /api/auth/login | Login, returns JWT cookie | No |
| POST | /api/auth/logout | Clear JWT cookie | Yes |
| GET | /api/auth/me | Get current user profile | Yes |

#### Packages (Tour Packages & Resorts)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/packages | List all (filter by destination) | No |
| GET | /api/packages/:slug | Get single package by slug | No |
| POST | /api/packages | Create new package | ADMIN |
| PUT | /api/packages/:id | Update package | ADMIN |
| DELETE | /api/packages/:id | Delete package | ADMIN |

#### Bookings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/bookings | Create new booking | CUSTOMER |
| GET | /api/bookings | Get all bookings | ADMIN |
| GET | /api/bookings/my | Get current user's bookings | CUSTOMER |
| PATCH | /api/bookings/:id/status | Update booking status | ADMIN |

#### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/admin/stats | Dashboard stats | ADMIN |
| GET | /api/admin/users | All users | ADMIN |

#### Blog
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/blog | All published posts | No |
| GET | /api/blog/:slug | Single post | No |
| POST | /api/blog | Create post | ADMIN |
| PUT | /api/blog/:id | Update post | ADMIN |
| DELETE | /api/blog/:id | Delete post | ADMIN |

---

## 5. Database Schema (PostgreSQL via Prisma)

### Core Tables
- `users` — Customer & admin accounts
- `packages` — Sri Lanka tours + Maldives resorts
- `bookings` — Customer trip reservations
- `payments` — Payment records (Stripe)
- `blog_posts` — CMS content

### Key Indexes
- `packages.slug` — Fast URL lookups
- `bookings.userId` — Fast user booking history
- `bookings.packageId` — Fast package booking count
- `blog_posts.slug` — Fast blog URL lookups

---

## 6. Security Requirements

| Measure | Implementation |
|---------|---------------|
| Authentication | JWT in HTTP-only cookies (no localStorage) |
| Authorization | RBAC middleware (ADMIN / CUSTOMER roles) |
| Input Validation | Zod schemas on all POST/PUT routes |
| Rate Limiting | express-rate-limit (5 login attempts / 15min) |
| Headers | Helmet.js (CSP, HSTS, XSS protection) |
| CORS | Strict allowlist (simpliflyfinland.fi only) |
| Passwords | bcrypt (cost factor 12) |
| SQL Injection | Impossible — Prisma uses parameterized queries |

---

## 7. External Services

| Service | Purpose | SDK |
|---------|---------|-----|
| Cloudinary | Image storage + optimization | `cloudinary` npm |
| Resend | Transactional emails | `resend` npm |
| Cloudflare | CDN + DDoS + SSL | DNS/proxy layer |
| Stripe | Payment processing (Sprint 6) | `stripe` npm |

---

## 8. DevOps & Infrastructure

### Containers
1. `nginx` — Reverse proxy (ports 80, 443)
2. `frontend` — Next.js app (internal port 3000)
3. `backend` — Express API (internal port 5000)
4. `db` — PostgreSQL 15 (internal port 5432)
5. `redis` — Redis 7 (internal port 6379)

### CI/CD Pipeline
1. Developer pushes to `feature/*` branch
2. PR opened → GitHub Actions runs lint + type check
3. PR merged to `develop` → Staging deploy
4. `develop` merged to `main` → Production deploy to Hostinger VPS

### Server: Hostinger VPS (Ubuntu 22.04 LTS)
- Minimum spec: KVM2 (2 vCPU, 8GB RAM, 100GB SSD)
- Docker + Docker Compose installed
- UFW firewall: Only ports 22, 80, 443 open
