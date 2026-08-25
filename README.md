# Accewa Frontend

Next.js 15 / React 19 / TypeScript frontend for the Accewa accessibility-scanning SaaS, built against the existing NestJS backend (`accewa-backend.zip`).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_URL and NEXT_PUBLIC_RAZORPAY_KEY_ID
npm run dev
```

The app expects the backend running at `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`), exposing routes under `/api/v1`.

## What's built (Slice 1)

- **Auth**: register, login, forgot/reset password, verify email — JWT stored in a Zustand store (persisted to localStorage), auto-refresh via Axios interceptor, edge middleware route protection.
- **Dashboard shell**: sidebar + topbar, role-aware nav (Admin/Agency sections appear only for those roles), dark/light theme, mobile nav drawer.
- **Websites**: add + list + trigger scans.
- **Scans**: start an ad-hoc scan, live-polling detail page with findings, AI fix suggestions, PDF report generation.
- **Reports & Notifications**: surfaced from scan-completion notifications (the backend has no list-all-reports/list-all-scans endpoint for org users — see `NOTES.md`).
- **Billing**: subscription + usage overview, plan comparison with Razorpay Checkout integration, payment history, invoices.
- **AI Assistant**: chat UI backed by `/ai/chat` and `/ai/conversations`.
- **Admin**: platform metrics + paginated tables for users, organizations, payments, scans, reports, audit logs, jobs.
- **Agency**: client onboarding, white-label brand settings, API key management.
- **Marketing site**: landing, pricing (static, mirrors seeded plans — see notes), docs, blog, about, contact, legal pages, help center.
- **404 / 500 / maintenance** pages.

## Tech stack

Next.js 15, React 19, TypeScript, Tailwind CSS v4, hand-built shadcn-style primitives (Radix + CVA), TanStack Query, Axios, React Hook Form + Zod, Zustand, Framer Motion (installed, ready for use), Recharts (installed), Lucide, next-themes.

## Design system

Signature idea: the WCAG severity scale (critical/serious/moderate/minor) *is* the accent color system — it shows up in the score ring, issue badges, and plan/usage cards. Fonts: Space Grotesk (display) + Inter (UI/body) + IBM Plex Mono (code/keys). See `src/app/globals.css` for tokens.

See `NOTES.md` for backend integration notes and known gaps to close in the next slice.
