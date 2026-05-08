# BLAYAKE — AI Systems Agency · PRD

## Original Problem Statement
User shared a Framer Motion-heavy `BlayakeAgency` React component (dark theme, blue/purple ambient glows, glassmorphism, custom cursor, services grid, marquee) and asked for "something like this and more optimized." User chose: frontend + backend with lead-capture form, "BLAYAKE" branding kept, fresh distinctive design (not the same generic dark+blue/purple+glass aesthetic), all sections (Hero, Services, Stats, Process, Case Studies, Testimonials, FAQ, Contact, Footer), both performance + visual-polish optimizations.

## Architecture
- **Frontend**: React 19 (CRA + craco) + Tailwind + Framer Motion + Lenis smooth scroll + Axios. Single-page app at `/app/frontend/src/pages/Blayake.jsx` mounted at `/`.
- **Backend**: FastAPI + Motor (async MongoDB). All routes under `/api`. Lead capture stored in `leads` collection with UUID id and ISO datetime.
- **Theme**: Obsidian (#0F0F0F) + Bone (#F2EFE9) + Electric Tangerine (#FF5722). Cabinet Grotesk (display) + JetBrains Mono (technical/labels) + Manrope (body). Hairline grid + grain texture + ember glows for editorial depth.

## User Personas
- Senior operators / founders evaluating an AI engineering partner
- Marketing/ops leads researching automation vendors
- Recruiters / press skimming case studies

## Core Requirements (static)
1. Single-page marketing site, distinctive editorial dark aesthetic
2. Lead capture form persisted to MongoDB via `POST /api/leads`
3. Visible sections: Hero, Marquee, Services (4-card bento), Stats, Process, Case Studies, Testimonials, FAQ accordion, Contact form, Footer
4. Smooth scroll, scroll progress, motion-rich micro-interactions
5. All interactive elements carry `data-testid`

## What's Been Implemented (2026-05-08)
- ✅ Backend: FastAPI app with health (`GET /api/`), `POST /api/leads` (Pydantic `EmailStr` validation, returns 201), `GET /api/leads` (sorted desc, no `_id`), legacy `/api/status` retained.
- ✅ Frontend: full Blayake page — Header, Hero with reveal-mask animation, Marquee, Services bento grid, Stats, Process grid, Case Studies (grayscale → color hover), Testimonials, FAQ accordion (1st open by default), Contact form wired to `POST /api/leads`, large-wordmark Footer, Lenis smooth scroll, scroll progress bar.
- ✅ Tailwind config with custom palette, fonts (Cabinet Grotesk via Fontshare, JetBrains Mono, Manrope) loaded in `index.html`.
- ✅ Tested: 100% backend (pytest @ `/app/backend/tests/test_blayake_api.py`), 100% frontend (testing agent E2E iteration_1).

## Prioritized Backlog
- **P1**: Add per-case-study detail pages (`/work/[slug]`) when real client work exists
- **P1**: Connect lead form to email (Resend / SendGrid) so leads notify the team in real time
- **P2**: Add admin dashboard at `/admin` to view leads (auth required)
- **P2**: Lighthouse pass — preconnect hints already present, add `loading="lazy"` audit + image dimensions
- **P3**: Refactor `Blayake.jsx` (~770 lines) into per-section components
- **P3**: Replace `@app.on_event("shutdown")` with FastAPI lifespan context manager
- **P3**: Decide invalid-email surfacing in `form-status` (currently HTML5 blocks before axios)

## Next Tasks
- Add a lead-notification integration (Resend or SendGrid) so submissions hit the team's inbox
- Optional: split `Blayake.jsx` into composable section files

## Notes
- No auth, no LLM, no third-party APIs in this MVP. Pure React/Tailwind frontend + FastAPI/Mongo backend.
