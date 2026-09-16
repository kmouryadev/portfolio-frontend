# 💼 AI Portfolio Frontend

The frontend for an interactive engineering portfolio: a Next.js site whose content (projects, skills, experience, case studies) is authored in Contentful, plus an embedded AI chat assistant that answers questions about the engineer's background using a RAG backend.

The companion backend lives in a sibling repo, [`portfolio-ai`](../portfolio-ai) (FastAPI + Gemini + an in-process vector store).

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React Server Components, ISR)
- **UI:** React 19, Tailwind CSS 4, [Framer Motion](https://www.framer.com/motion/) for animation
- **Content Source:** [Contentful](https://www.contentful.com/) Content Delivery API — projects, skills, experience, and site config are all authored there and fetched server-side
- **AI Chat:** Client component that calls the `portfolio-ai` backend's `/chat` endpoint
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **Quality:** ESLint (`eslint-config-next`), TypeScript strict mode

---

## 🏗 Architecture

### Why this split (Contentful + a separate AI backend)

The site itself is static-ish content (projects, skills, experience) that changes rarely — that's a natural fit for **Contentful + ISR**: pages are server-rendered at request time and revalidated every 60s (`export const revalidate = 60` in `src/app/page.tsx`), so edits in Contentful show up without a redeploy, but the common case is still a fast cached response.

The chat assistant is a fundamentally different workload — it needs an LLM, an embedding model, and a small retrieval index — none of which belong in a Next.js server function on every request. So it's a separate FastAPI service (`portfolio-ai`) that the browser calls directly via `fetch`. This keeps the frontend a thin, fast, mostly-static site, and keeps the AI service independently deployable/scalable and swappable (e.g. the vector store or LLM provider can change without touching this repo).

### Data flow

```text
Contentful (CMS)                     portfolio-ai (FastAPI + Gemini RAG)
      │                                          ▲
      │ CDA fetch (server-side, ISR)             │ POST /chat (client-side fetch)
      ▼                                          │
┌─────────────────────────┐           ┌──────────┴──────────┐
│  Next.js Server          │           │   ChatWidget         │
│  (src/lib/contentful/*)  │           │   ("use client")     │
│  → typed Project/Skill/  │           │   - message history   │
│    Experience/SiteConfig │           │   - request timeout   │
└──────────┬────────────────┘         │   - graceful fallback │
           │ props                    └──────────────────────┘
           ▼
┌─────────────────────────┐
│  Server Components       │
│  (Hero, Projects, etc.)  │
└─────────────────────────┘
```

- **`src/lib/contentful/`** — a typed Content Delivery API client (`client.ts`) plus per-content-type fetchers (`projects.ts`, `skills.ts`, `experience.ts`, `site-config.ts`) and link-resolution helpers (`resolvers.ts`) for Contentful's `Link` references. All server-side only — Contentful credentials never reach the browser.
- **`src/app/`** — App Router pages and components. `page.tsx` and `projects/[slug]/page.tsx` are async Server Components that fetch Contentful data and pass it down as typed props.
- **`src/app/components/ChatWidget.tsx`** — the one client-side integration point with the AI backend. It degrades gracefully: a missing `NEXT_PUBLIC_CHAT_API_URL`, a slow/hung backend (aborts after 15s), and a non-2xx response all render a distinct, user-visible fallback message instead of hanging or failing silently.

---

## ⚙️ Environment Variables

Create `.env.local` (not committed) with:

| Variable | Description | Where it's used |
| :--- | :--- | :--- |
| `CONTENTFUL_SPACE_ID` | Contentful space ID | Server-side (`src/lib/contentful/client.ts`) |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful Content Delivery API token | Server-side |
| `CONTENTFUL_ENVIRONMENT` | Contentful environment (e.g. `master`) | Server-side |
| `NEXT_PUBLIC_CHAT_API_URL` | Base URL of the `portfolio-ai` backend (e.g. `http://localhost:8000`) | Client-side (`ChatWidget.tsx`) |

Only `NEXT_PUBLIC_CHAT_API_URL` is exposed to the browser (by design, via the `NEXT_PUBLIC_` prefix) — the Contentful credentials stay server-side.

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js 24+**
2. A **Contentful space** with `project`, `challenge`, `skill`, and `siteConfig` content types populated
3. The [`portfolio-ai`](../portfolio-ai) backend running locally (or a deployed URL) if you want the chat widget to work

### Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the values above
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 🧪 Testing

Tests use Vitest + React Testing Library (`jsdom` environment). Coverage focuses on behavior that's easy to silently break:

- **`ChatWidget.test.tsx`** — send/receive happy path, a non-2xx response falls back gracefully, a hung request times out with a distinct message, and a missing `NEXT_PUBLIC_CHAT_API_URL` shows a visible "not configured" message instead of silently doing nothing.
- **`ProjectsGrid.test.tsx`** — the professional/personal/all filter logic and the empty-state message.

CI (`.github/workflows/ci.yml`) runs ESLint, `tsc --noEmit`, and the test suite on every push/PR.
