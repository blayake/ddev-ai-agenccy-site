# BLAYAKE — AI Systems Agency · PRD

## Original Problem Statement
User shared a Framer Motion-heavy `BlayakeAgency` reference component and asked for "something like this and more optimized." Iterated to: small, animation-rich landing page styled after **zaid.agency** (monochrome, floating pill nav, glassmorphic image-top cards, white pill CTAs) plus **custom cursor animations**.

## Architecture
- **Frontend**: React 19 + Tailwind + Framer Motion + Lenis smooth scroll + Axios
  - `/app/frontend/src/pages/Blayake.jsx` — single-page composite (~480 lines, 6 subcomponents)
  - `/app/frontend/src/components/Cursor.jsx` — custom cursor with `<Cursor />` (dot + ring, hover/view variants, mix-blend-difference, auto-disabled on touch) and `<Magnetic />` wrapper (springs CTA toward pointer)
- **Backend**: FastAPI + Motor (async MongoDB), routes under `/api`
  - `POST /api/leads` (LeadCreate: name, email, phone?, company?, project_type?, message?)
  - `GET /api/leads` (sorted desc, no `_id`)
- **Theme**: Pure monochrome — `#050505` background + white text, dotted grid backdrop, soft halos, grain. Cabinet Grotesk + JetBrains Mono + Manrope (no Inter/Roboto).

## User Personas
- Founders/operators evaluating an AI engineering partner
- Marketing/ops leads researching automation vendors
- Recruiters / press scanning the studio's case work

## Core Requirements
1. Small, animation-rich, distinctive monochrome marketing site
2. MongoDB-backed lead capture form (Name + Email + Phone + Message)
3. Sections: Hero · Marquee · Services (4 image-top glass cards) · Selected Work (3 editorial rows) · FAQ (3 items) · Contact · Footer
4. Custom cursor on desktop with hover scale + "View" label expansion + magnetic CTAs
5. Lenis smooth scroll, scroll-progress bar, all interactive elements have `data-testid`

## What's Been Implemented (2026-05-08)
- ✅ V1: Editorial dark + tangerine layout (Hero, 4-card bento, Stats, Process, 3 Case Studies, Testimonials, FAQ, Contact, Footer) — tested 100%
- ✅ V2 (current): zaid-inspired monochrome redesign + custom cursor:
  - Floating pill nav (centered, sticky)
  - Hero with reveal-line mask animation, halo glow, magnetic CTAs
  - Glassmorphic 2×2 services grid with image-on-top + icon badges
  - Editorial work rows with "VIEW" cursor-label expansion on hover
  - FAQ accordion (animated with AnimatePresence)
  - Centered contact card with Name/Email/Phone/Message + magnetic submit
  - Massive BLAYAKE wordmark footer
  - **Cursor**: dot + spring-trailed ring with `data-cursor="hover|view|hide"` API; magnetic CTA wrapper
  - Backend Lead model now allows optional phone & message
- ✅ Tested twice — iteration_1 100%, iteration_2 100% (backend pytest 7/7, frontend playwright e2e including cursor scale verification)

## Prioritized Backlog
- **P1**: Connect lead form to email (Resend/SendGrid) for real-time team notifications + auto-reply with calendar link (Cal.com)
- **P1**: Add per-case-study detail pages (`/work/[slug]`) when real client work exists
- **P2**: Admin `/admin` lead inbox (auth required)
- **P2**: Lighthouse pass — preconnect already set, audit image dimensions + LCP
- **P3**: Split `Blayake.jsx` into `pages/Blayake/sections/*` if it grows >700 lines
- **P3**: Replace deprecated `@app.on_event("shutdown")` with FastAPI lifespan context

## Next Tasks
- Wire lead notification (Resend) so submissions ping the inbox immediately
- Optional: drop unused `company` / `project_type` from `LeadCreate` if no longer needed

## Notes
- No auth, no LLM, no third-party APIs in MVP. Pure React + FastAPI + Mongo.
- Cursor auto-hides on coarse pointers (touch); native cursor restored automatically.
