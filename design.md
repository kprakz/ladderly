# Ladderly: Architecture and Design

This document explains how Ladderly is built and why. For *what* it must do, see [requirements.md](requirements.md).

## 1. Overview

Ladderly is a single Next.js application that runs in three ways:

| Mode | How it runs | API key | Typical use |
|---|---|---|---|
| **Web** | Deployed on Vercel | None, so demo mode | Public demo link |
| **Desktop** | Electron app that starts a bundled Next.js server on the user's PC | Optional, in a local settings file | Installed Windows app |
| **Development** | `npm run dev` | Optional, in `.env.local` | Building and testing |

All three share the same UI, API route, schema and demo data. Only the *host* differs.

```mermaid
flowchart LR
  subgraph Client["UI (browser or Electron window)"]
    Page["page.tsx<br/>form · timeline · history"]
    Store[("localStorage<br/>saved paths + theme")]
    Page <--> Store
  end

  subgraph Server["Next.js server (Vercel or local)"]
    Route["/api/path<br/>route.ts"]
    Demo["demo.ts<br/>sample paths"]
    Schema["schema.ts<br/>zod schemas"]
    Route --> Demo
    Route --> Schema
  end

  Claude["Anthropic API<br/>claude-opus-5"]

  Page -- "POST {topic, level, hours, goal}" --> Route
  Route -- "NDJSON stream" --> Page
  Route -- "only if a key is set and demo mode is off" --> Claude
```

## 2. Project structure

```
electron/            Desktop shell (Node.js, runs outside the browser)
  main.js            App lifecycle, window, menu
  server.js          Starts the bundled Next.js server and waits until it is ready
  config.js          Reads the desktop settings file (API key, demo mode)
scripts/
  build-desktop.mjs  Builds the standalone Next.js server and adds static files
  after-pack.cjs     electron-builder hook that copies the server into the packaged app
build/icon.svg       Logo source: a white ladder rising toward a yellow star on a dark grey tile (also src/app/icon.svg and components/Logo.tsx)
build/icon.png       App icon rendered from icon.svg (the installer and .exe icons are generated from it)
src/
  app/
    layout.tsx       HTML shell, fonts, no-flash theme script
    page.tsx         The single page: state and layout
    api/path/route.ts  POST endpoint: validates, streams, calls Claude or serves demo data
  components/        Presentational React components (form, cards, panels, list…)
  lib/
    schema.ts        zod schemas and TypeScript types shared by client and server
    prompt.ts        System prompt and user-prompt builder
    demo.ts          Demo-mode switch and sample paths
    generate.ts      Browser-side client for the streaming API
    storage.ts       localStorage-backed store for saved paths
    profile.ts       Learner's name and daily goal (localStorage)
    activity.ts      Rungs climbed per day (localStorage)
    dates.ts         Local-calendar day keys (YYYY-MM-DD) and day arithmetic
    streaks.ts       Streak, rest days and heatmap maths (pure functions)
    badges.ts        Milestone badges
    celebrate.ts     Logs a step and shows toasts for streaks, goals and badges
    ai/models.ts     Engines, model lists, Ollama catalog, recommendation, AiSettingsSchema
    ai/settingsStore.ts  localStorage store for the AI engine choice
    ai/useAiStatus.ts    Hook that fetches /api/ai/status
    server/llm.ts    Claude, OpenAI and Ollama adapters + error messages
    server/ollama.ts Local-server check, Ollama status, disk and memory
    server/requestGuard.ts  Rejects cross-site POSTs
    platforms.ts     Learning platforms and their search-link templates
    demoExtras.ts    Demo video searches, quizzes, course picks and verified featured links
```

## 2.1 Website and downloads

- **Routes:** `/` is the website (a static, pre-rendered server component, `src/app/page.tsx`); `/app` is the learning app (`src/app/app/page.tsx`), with a "Ready-made paths" picker under the search box. Electron loads `${url}/app`.
- **Download flow:** `GET /api/download` reads `x-vercel-ip-country`, normalises it (`XX` when missing), and, unless the `ladderly_dl` cookie is set or the user agent looks like a crawler, calls `recordDownload`, then sets the cookie (1 year, httpOnly) and returns a 302 to `LADDERLY_DOWNLOAD_URL` or the GitHub "latest release" asset URL. electron-builder names the installer `Ladderly-Setup.exe` so that URL is stable.
- **Storage:** `lib/server/downloadStats.ts` talks to Upstash Redis over its REST `/pipeline` endpoint with `fetch` (no extra dependency): `HINCRBY ladderly:downloads:countries <CC> 1` and `INCR ladderly:downloads:total`. It reads `KV_REST_API_URL`/`KV_REST_API_TOKEN` (Vercel's Upstash integration) or `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`. Without them, counting is a no-op and stats report `enabled: false`; errors are logged without details and never block the redirect.
- **Map:** `GET /api/downloads` returns `{ enabled, total, countries }` with `s-maxage=60`. `components/site/DownloadMap.tsx` projects Natural Earth 110m country shapes (`world-atlas`, bundled) with `d3-geo`'s Natural Earth projection, maps ISO alpha-2 codes to the shapes' numeric ids with `i18n-iso-countries`, and shades countries on a log scale (5 levels). Country names come from `Intl.DisplayNames`. Ranks are numbers rather than flag emoji, because Windows doesn't draw flag emoji.

## 2.2 Desktop updates

- **Files:** `electron/update-core.js` (no Electron imports; unit-tested) parses electron-builder's `latest.yml`, compares versions, and downloads the installer with `fetch` (following GitHub's redirects), hashing it as it streams and deleting it if the SHA-512 doesn't match. `electron/updater.js` holds the state machine (`idle → checking → available → downloading → installing`, or `error`), broadcasts it to windows on `updates:state`, and answers `updates:get/check/install` IPC calls only from the local server's origin.
- **Bridge:** `electron/preload.js` exposes a fixed `window.ladderly = { desktop, updates }` through `contextBridge` (the window stays sandboxed with context isolation). `src/lib/desktop.ts` types it; `UpdateBanner` subscribes and renders the bar.
- **Install:** the verified installer is saved to the temp folder and started detached with `/S --updated --force-run` (electron-builder's NSIS: silent install, then relaunch); the app quits 0.8 s later so files can be replaced.
- **Release feed:** `https://github.com/kprakz/ladderly/releases/latest/download/` (`latest.yml` and `Ladderly-Setup.exe`). `package.json` has a GitHub `publish` entry so electron-builder writes `latest.yml`; builds use `--publish never` and `scripts/release.mjs` uploads with `gh`. Unpackaged builds only check when `LADDERLY_UPDATE_FEED` points at a test feed.

## 2.3 Feedback

- **Storage:** `lib/server/redis.ts` (shared REST pipeline helper) and `lib/server/feedback.ts`: entries are JSON in a Redis list `ladderly:feedback` (`LPUSH` + `LTRIM` to 5,000). Rate limiting uses `INCR` + `EXPIRE … NX` on `ladderly:feedback:rl:<HMAC(ip)>` (16 hex characters, 10-minute expiry), so the IP itself is never written.
- **API:** `POST /api/feedback` → cross-site check → zod validation (`FeedbackInputSchema`) → trap field (a filled `website` field gets a fake success) → rate limit → save. Without a database on a local server (the desktop app), it forwards the body to `LADDERLY_SITE_URL` (default `https://ladderly.vercel.app`) with no redirects; on the public site without a database it answers 503. `GET /api/feedback` needs `Authorization: Bearer FEEDBACK_ADMIN_TOKEN` (constant-time compare, at least 12 characters) and is `no-store`.
- **UI:** `FeedbackDialog` (native modal `<dialog>`, rendered only while open) and `FeedbackButton` (lets the server-rendered website open it). The source is "website", "app", or "desktop" when `window.ladderly` exists (with the app version). `/admin/feedback` keeps the password in `sessionStorage` for the tab only, and its layout sets `robots: noindex`.

## 2.4 Next topics

- `NextTopicSchema` (`{ topic, why }`) is required in `GeneratedPathSchema` (so structured output always asks for it) but optional in `LearningPathSchema` (so older paths load). `repairGeneratedPath` keeps at most 3 valid items and removes the field if none are valid.
- `lib/nextTopics.ts` has hand-picked suggestions per topic family, chosen with the same `matchTopicTheme` keywords as the background, and a general fallback. `getDemoPath` attaches them; `PathView` uses them when a stored path has none.
- `WhatsNext` renders when `progressOf(saved).percent === 100`; its button calls the page's `startNextTopic`, which runs `generate({ topic, level: "some", hoursPerWeek, goal })`.

## 2.5 Web search and the Class 11–12 demos

- **Web search** (`lib/server/webSearch.ts`): `chooseSearch` in `/api/path` picks the user's key (`searchProvider` + `searchKey` in `AiSettingsSchema`) or the server's (`TAVILY_API_KEY` / `BRAVE_SEARCH_API_KEY`, reported as `serverSearch` by `/api/ai/status`). `runSearch` sends `status` events, calls `searchWeb` (Tavily `POST /search` with a Bearer key, or Brave `GET /res/v1/web/search` with `X-Subscription-Token` and strict safe search; 8-second timeout), and `tidyResults` keeps up to 5 https results, one per host, with cleaned text. `webContext` appends them to the user prompt inside `<web_results>`, with links replaced by "[link]". After validation, `withSources` attaches `{ title, url }` from the search (not the model) as `webSources`; `repairGeneratedPath` strips any the model wrote. `generatePath` passes `status` events to the page, which shows them in `LoadingPanel`.
- **Measured cost on a laptop** (`gemma3:1b` in Ollama): reading about 1,200 tokens of results took 10.7 s (≈113 tokens/s), against roughly 2 minutes for a whole path; larger local models read more slowly.
- **Class 11–12 demos** (`lib/demoIndia.ts`): five hand-written paths checked against the official CBSE 2025–26 syllabus PDFs, with `INDIA_SAMPLES` placed before the Python sample in `demo.ts` so "class 12 computer science" matches first. Each sample carries its own `next` topics. The local `q()` helper rotates each question's options by a fixed amount derived from its text, spreading correct answers across A–D.

## 3. Request flow

```mermaid
sequenceDiagram
  actor U as User
  participant P as page.tsx
  participant G as generate.ts
  participant R as /api/path
  participant C as Claude (or demo.ts)

  U->>P: Submit topic + options
  P->>G: generatePath(request, onText, signal)
  G->>R: POST JSON
  R->>R: Validate with PathRequestSchema
  alt invalid input
    R-->>G: 400 {error}
  else demo mode
    R->>C: getDemoPath(topic)
  else real generation
    R->>C: messages.stream (structured output)
  end
  loop while generating
    R-->>G: {"type":"delta","text":…}
    G-->>P: onText(textSoFar)
    P-->>U: LoadingPanel shows stage titles
  end
  R->>R: JSON.parse + LearningPathSchema.safeParse
  R-->>G: {"type":"done","path":…} or {"type":"error","message":…}
  G-->>P: LearningPath (or throws Error)
  P->>P: updatePaths(): save to localStorage
  P-->>U: Timeline (or ErrorPanel with Retry)
```

### 3.1 Streaming protocol

`/api/path` responds with `application/x-ndjson`: one JSON object per line.

| Event | Shape | When |
|---|---|---|
| `delta` | `{ type: "delta", text: string }` | Each chunk of raw JSON text as it is generated |
| `done` | `{ type: "done", path: LearningPath }` | Once, after the full text is parsed and validated |
| `error` | `{ type: "error", message: string }` | Once, instead of `done`, if anything fails |

NDJSON was chosen over Server-Sent Events because it needs no extra library, works with a plain `fetch` stream reader, and keeps each event self-contained. The client ignores `delta` text for correctness. It only uses it for the live preview. The UI trusts the validated `done` payload alone.

## 4. Data model

Defined once with zod in `src/lib/schema.ts`. The TypeScript types are inferred from these schemas, so the types and validation can't drift apart.

```mermaid
classDiagram
  class PathRequest {
    topic: string (1–120)
    level?: "none" | "some" | "intermediate"
    hoursPerWeek?: int (1–80)
    goal?: "hobby" | "job" | "exam"
  }
  class LearningPath {
    summary: string
    stages: Stage[4..6]
    finishLine: FinishLine
    pitfalls: string[3]
    courses?: CourseLink[1..6]
    featured?: Featured  "demo only"
  }
  class Stage {
    title: string
    duration: string
    concepts: string[3..6]
    practice: string[1..2]
    checkpoint: string[2..5]
    resources: string[2..3]
    videoSearch?: string
    quiz?: QuizQuestion[2..3]
    videos?: (title, channel, youtubeId)[]  "demo only"
  }
  class QuizQuestion {
    question: string
    options: string[4]
    answer: int (0–3)
    explanation: string
  }
  class CourseLink {
    platform: PlatformId
    query: string
    note: string
  }
  class Featured {
    videos: (title, channel, youtubeId)[]
    courses: (title, provider, url, kind)[]
  }
  class FinishLine {
    name: string
    description: string
  }
  class SavedPath {
    id: string (UUID)
    createdAt: number (ms epoch)
    request: PathRequest
    path: LearningPath
    checked: string[]  "stage-item" keys
    quizScores?: stageIndex → (correct, total)
  }
  LearningPath *-- Stage
  Stage *-- QuizQuestion
  LearningPath *-- CourseLink
  LearningPath *-- Featured
  LearningPath *-- FinishLine
  SavedPath *-- PathRequest
  SavedPath *-- LearningPath
```

There are two versions of the path schema:

- **`GeneratedPathSchema`** is what Claude must produce: `videoSearch`, `quiz` and `courses` are required.
- **`LearningPathSchema`** is what the app stores and shows: the same fields, but optional, so paths saved before they existed still validate (otherwise `loadPaths` would drop them). Only this version has `featured`, which comes solely from hand-checked demo data.

Checkbox state is stored as keys like `"2-0"` (stage 3, item 1) from `checkKey()`. That keeps saved data small and independent of the checkpoint text.

## 5. Generation with Claude

- **SDK:** `@anthropic-ai/sdk`, `client.beta.messages.stream(...)`, on the server only.
- **Model:** `claude-opus-5` with `output_config.effort: "medium"`, which balances speed and quality for this short, structured task.
- **Structured output:** `output_config.format = betaZodOutputFormat(GeneratedPathSchema)`. The SDK turns the zod schema into a JSON Schema, so Claude must return JSON of that shape. Count limits the JSON Schema can't express (e.g. "4–6 stages") are passed to Claude as hints and **enforced by zod** after generation.
- **Refusal fallback:** `fallbacks: "default"` with beta `server-side-fallback-2026-07-01`. If a safety classifier declines, the API retries on Anthropic's recommended fallback model instead of failing.
- **Stop reasons:** `refusal` and `max_tokens` become user-friendly errors. Only `end_turn` output is parsed.
- **Prompting:** `SYSTEM_PROMPT` in `prompt.ts` sets the rules: detailed, specific concepts (each names the exact technique or tool, with a vague-vs-specific example), practice tasks with a named dataset or scenario and a measurable goal, testable checkpoints, quiz questions about the stage's own content, no URLs, and realistic durations. The schema field descriptions repeat these rules, because Claude sees them too. `buildUserPrompt()` adds the learner's details.

### 5.1 Videos, courses and quizzes

**No made-up links.** AI models often invent URLs that look real but don't exist, so Claude never writes a URL:

| Content | What Claude writes | What the app does |
|---|---|---|
| Stage videos | `videoSearch`: search words for that stage | A "More on YouTube" card at the end of the stage's video row, linking to YouTube's search results (`youtubeSearchUrl`). Demo samples also carry hand-verified `videos` per stage |
| Courses | `courses[]`: a platform ID, search words and a short note | `lib/platforms.ts` maps each platform ID to its real search page and builds the link (`platformSearchUrl`). Each platform is tagged free, free to audit (Coursera) or paid |
| Quiz | `quiz[]`: question, 4 options, the correct index, an explanation | Shown by `StageQuiz` once the stage is complete |

The platform list is described to Claude in the schema and the prompt, but the SDK can't enforce string enums in structured output. So the route runs `dropUnknownPlatforms()` before validation: a course on an unlisted platform is removed instead of failing the whole path. Every platform search URL was checked to load. edX and MasterClass were left out, because their search pages didn't respond or redirected to the homepage.

**Demo content** lives in `lib/demoExtras.ts` and is merged into the sample paths by `getDemoPath`. The four samples (guitar, public speaking, python, machine learning) also have `featured` videos and course pages. Each YouTube ID was confirmed with YouTube's oEmbed endpoint and each course URL was loaded before being added. The generic template gets topic-based searches only: no quiz (a quiz that can't ask about the topic is useless) and no featured links. It sets `isTemplate: true`, and `PathView` shows a notice that it's a general template rather than a detailed plan.

**Video rows** (`VideoRow`, `VideoCard`): each stage's "Videos for this week" dropdown (`Disclosure`) and the "Recommended videos" strip use the same horizontal, snap-scrolling row. A card shows YouTube's cover thumbnail (`mqdefault.jpg`) with the title and channel underneath. On hover or focus it zooms up, shows a play button, and cycles every 0.9 s through `mq1`–`mq3`: still frames YouTube captures from inside every video, all 320×180. The extra frames load only after the first hover, and the cycling stops under reduced motion. Arrow buttons use a `ResizeObserver` and the scroll position to appear only on a side with more to show. The per-stage videos for the four demo samples (49 in total) were found with each stage's search words, reviewed by hand, and confirmed via YouTube oEmbed. The app itself never scrapes YouTube.

**Dropdowns** (`Disclosure`): a button with `aria-expanded`/`aria-controls`, and a content region animated with the `grid-template-rows: 0fr → 1fr` technique. Closed content is `inert`, so it can't be tabbed into. The "Learn with" panel puts free and paid courses in separate dropdowns, closed by default.

**Quiz flow** (`StageQuiz`): locked until every checkpoint in the stage is ticked → "Take the quiz" → one question at a time. Picking an option locks it, marks right (green) and wrong (red), and shows the explanation → score → retake. `page.tsx` saves the best score per stage in `SavedPath.quizScores`. `PathView` is keyed by path ID, so quiz state resets when you switch paths.

### 5.2 AI engines

```mermaid
flowchart LR
  UI["AI settings (browser)<br/>provider, model, own keys<br/>localStorage: ladderly:ai"] -- "POST /api/path<br/>{topic…, ai}" --> R["route.ts<br/>chooseEngine()"]
  R -- "demo" --> D["demo.ts"]
  R -- "ollama (local server only)" --> O["Ollama<br/>OLLAMA_HOST /api/chat"]
  R -- "anthropic" --> C["Claude<br/>user key or server key"]
  R -- "openai" --> G["OpenAI Responses API<br/>user key"]
  O & C & G --> V["repairGeneratedPath()<br/>+ LearningPathSchema"]
```

- **Settings** (`lib/ai/models.ts`, `lib/ai/settingsStore.ts`): `AiSettingsSchema` (provider, model choices, optional keys; every field is length- or pattern-limited) is stored in `localStorage` under `ladderly:ai` and sent with each request (`generate.ts`). `"auto"` means the server decides: its own Anthropic key if it has one, otherwise the free demo.
- **Engines** (`lib/server/llm.ts`): one function per engine with the same shape (prompts, abort signal, `onDelta` callback → full text and stop reason).
  - Claude uses `betaZodOutputFormat`. Effort is omitted on Haiku 4.5, and refusal fallbacks are used only on Opus 5.
  - OpenAI uses the Responses API with `zodTextFormat` (strict JSON Schema), streaming `response.output_text.delta`.
  - Ollama uses `/api/chat` with `format` set to the JSON Schema, and `think: false`. Without the latter, "thinking" models spend minutes reasoning on a CPU.
- **Local models** (`lib/server/ollama.ts`):
  - `isLocalServer()` is true in the desktop app (`LADDERLY_LOCAL=1`, set by `electron/config.js`) and under `npm run dev`.
  - `systemInfo()` reads free space where Ollama stores models (`fs.statfs`) and total memory (`os.totalmem`).
  - `/api/ai/status`, `/api/ai/ollama/pull` (streams Ollama's progress) and `/api/ai/ollama/delete` back the settings screen.
- **Choosing a model** (`OLLAMA_CATALOG`, `recommendOllamaModel`): nine suggested models with exact download sizes from Ollama's registry, a memory guideline and a quality rank. The recommendation is the highest-quality model that fits memory and disk (keeping 2 GB of disk spare). On an 8 GB laptop that's Qwen 3.5 4B; on 16 GB, Qwen 3.5 9B; on a 32 GB workstation, gpt-oss 20B.
- **Speed**: local models get a compact-path instruction (`buildSystemPrompt(true)`). The loading panel estimates progress from characters received against the expected size, and shows elapsed time.
- **Robustness** (`repairGeneratedPath`): before validation, any AI output has `featured`, `isTemplate` and per-stage `videos` removed, so models can never inject links. Over-long lists are trimmed, and malformed quiz questions and unknown platforms are dropped. Too-short lists still fail validation.
- **Security**:
  - **Cross-site requests:** `rejectCrossSite()` refuses POSTs whose `Origin` isn't this host. Without it, any website could drive the desktop app's local server.
  - **Keys:** never logged. Errors are mapped to fixed messages, and only status codes are logged.
  - **Ollama:** only on a local server, at a server-configured address.

## 6. Demo mode

`isDemoMode()` in `demo.ts` is the single switch, evaluated on the server at request time:

| `DEMO_MODE` | `ANTHROPIC_API_KEY` | Result |
|---|---|---|
| `"true"` | any | Demo |
| anything else | missing or empty | **Demo** (fail-safe: no key means no paid calls) |
| anything else | set | Real generation |

Demo responses go through the same NDJSON stream, with small delays between chunks, and are validated with the same schema. That means the UI code has no demo-specific branches.

The built-in paths are offered through the **Ready-made paths** picker (`ReadyPaths`, catalogue in `lib/readyPaths.ts`): category → grade (students) → topic. Picking one calls `generate({ topic }, true)`, which sends `ai: { provider: "demo" }` regardless of the user's engine, so it's instant, free, skips web search, and works offline in the desktop app. Retry remembers that it was a ready-made path. The old demo banner was removed.

## 7. Client state and persistence

- **Page state** (`page.tsx`): `status` (`idle` | `loading` + partial text | `error` + message), the last request (for Retry), the selected path ID, and an `AbortController` so a new request cancels the previous one.
- **Saved paths** (`storage.ts`): a small external store over `localStorage` key `ladderly:paths` (falling back once to `pathfinder:paths`, the key used before the rename), read through React's `useSyncExternalStore`. Entries are validated with zod on load, and invalid ones are dropped. `useSavedPaths()` returns `null` during server rendering, so the page can tell "not loaded yet" from "no paths".
- **Profile** (`profile.ts`): `ladderly:profile` holds `{ name?, skipped?, dailyGoal: 1 | 3 | 5, createdAt? }`. `isReturningVisit()` is true when a profile already existed when the page loaded, which picks "Welcome back" over "Welcome".
- **Activity** (`activity.ts`): `ladderly:activity` maps local day keys to steps done, e.g. `{ "2026-10-06": 3 }`. On first read it is seeded from saved paths' `createdAt`. `recordActivity(delta)` changes today's count and never goes below zero, so tick/untick can't inflate it.
- **Streaks** (`streaks.ts`, pure and unit-tested): `computeStreak(days, today)` walks back from today. A day with ≥1 step extends the streak; every 7 active days in a row earns a rest day (max 2); a missed day spends one, otherwise the streak ends. Today never breaks it (`atRisk` is true until the first step). `heatmapWeeks` builds 53 Sunday-start weeks for the heatmap; `heatLevel` buckets counts into 5 shades (0, 1–2, 3–5, 6–9, 10+).
- **Celebrations** (`celebrate.ts`): every action goes through `climb(delta, change)`, which snapshots today's count, the streak and earned badges, applies the change, logs the step, snapshots again and calls `showToast` for each difference. The comparison happens in the event handler, not in an effect, so nothing fires on page load.
- **Theme**: `localStorage` key `ladderly:theme` and a `.dark` class on `<html>`. An inline script in `layout.tsx` applies it before first paint, to avoid a flash of the wrong theme. `ThemeToggle` watches the class with a `MutationObserver`.

### 7.1 Keeping the UI simple

The audience is students, so the page shows one thing to do at a time. Details are revealed on demand rather than shown all at once:

- **Home:** greeting, two chips (🔥 streak, 🎯 today's goal), the single next step with "Open" and "✓ Done". "My progress" toggles the week strip, daily goal choice, year heatmap, badges and "Change name".
- **Form:** one input and one button. Level, hours and goal are behind "Options".
- **Path:** stages are fold-out cards (`StageCard` keeps its own `open` state; the first unfinished stage starts open). The "Open" button on the next step dispatches the `ladderly:open-stage` window event so the right card opens before scrolling. Videos and courses, per-stage videos and resources, and common mistakes are all folded `Disclosure`s.
- **Topic background:** `TopicBackground` is a fixed `-z-10` layer behind the page. `matchTopicTheme(topic)` in `lib/topicTheme.ts` maps keywords (whole words for short ones like "ai") to a family with two glow colours and five symbols. The page uses the typed topic when it matches, else the active path's topic, else `DEFAULT_THEME`. Glows animate with the `drift` keyframes and symbols with `floaty`; both are disabled under `prefers-reduced-motion`.
- **Cursor glow:** `CursorGlow` is a fixed, `pointer-events-none` radial gradient (20 px, about half a centimetre) moved with `translate3d` once per animation frame from a passive `pointermove` listener, so React doesn't re-render on every mouse move. It only runs when `(pointer: fine)` matches.
- **Shooting stars:** `ShootingStars` draws on one full-screen canvas (`pointer-events-none`, device-pixel-ratio aware). A passive `pointermove` listener checks whether the cursor is inside `#ladderly-logo` (the icon only); if so (and the 1.4 s cooldown has passed) it launches 4–6 stars from the centre of the logo. The brand row is `relative z-40`, above the `z-30` canvas, so the stars appear to slide out from underneath the logo. Each star has a slight turn per frame so it arcs, slows a little, keeps an 18-point trail and fades over its last third. The `requestAnimationFrame` loop stops when no stars are left.
- **Logo twinkle:** `Logo` tags its star, glow and three sparkles with `logo-*` classes. `globals.css` animates them with `.brand:has(.brand-text:hover)`, so only hovering the word "Ladderly" triggers it (the word itself gets a `textGlow` text-shadow pulse) (`twinkle`, `glowPulse`, `sparkle` with staggered delays), using `transform-box: fill-box` so each shape scales around its own centre.
- **Visual language:** neutral zinc surfaces, indigo for the one primary action, green for done, few borders and no all-caps labels.

## 8. Desktop architecture (Electron)

### 8.1 Why a local server

The app needs server code: the API route that holds the key and calls Claude. Rather than rewrite it for Electron, the desktop app bundles the Next.js **standalone server** and runs it locally. This means:

- one codebase for web and desktop;
- the API key stays in a server process, never in the window (NFR-1);
- demo mode works fully offline.

### 8.2 Processes

```mermaid
flowchart TB
  subgraph App["Ladderly.exe"]
    Main["Main process<br/>electron/main.js"]
    Server["Utility process<br/>Next.js server.js<br/>127.0.0.1:47821"]
    Window["BrowserWindow (renderer)<br/>sandboxed, no Node.js"]
  end
  Config[("%APPDATA%\\Ladderly\\config.json")]
  Browser["Default web browser"]

  Main -- "reads" --> Config
  Main -- "fork with env: ANTHROPIC_API_KEY, DEMO_MODE, PORT" --> Server
  Main -- "creates, loads http://127.0.0.1:47821" --> Window
  Window -- "HTTP" --> Server
  Window -. "external links" .-> Browser
```

### 8.3 Startup sequence

1. `requestSingleInstanceLock()`: a second launch focuses the existing window and exits.
2. `ensureConfigFile()` creates `config.json` (`{"anthropicApiKey": "", "demoMode": true}`) if it's missing.
3. `choosePort(47821)` uses the fixed port if it's free, otherwise any free port.
4. `startServer()` forks `server.js` as an Electron utility process, with env from `configToEnv()`, and `waitForServer()` polls until it answers (20 s timeout).
5. `createWindow()` loads the URL and shows the window when it's ready. If any step fails, an error dialog is shown and the app quits.
6. On quit, the server process is killed. If the server exits unexpectedly while the app is running, the app shows an error and quits.

**Why a fixed port:** `localStorage` is scoped to the page's origin, which includes the port. A fixed port keeps saved paths across launches. If 47821 is taken, the app still works, but that session uses separate storage.

### 8.4 Settings

`%APPDATA%\Ladderly\config.json`:

```json
{ "anthropicApiKey": "sk-ant-...", "demoMode": false }
```

Real generation is used only when a key is set **and** `demoMode` is `false`. Opened from **File → Open Settings File**, applied with **File → Restart to Apply Settings**.

### 8.5 Window security

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, and no preload script: the page is an ordinary web page with no access to Node.js or the file system.
- `setWindowOpenHandler` and `will-navigate` keep the window on the local server. Other `http(s)` links open in the default browser.
- The server binds to `127.0.0.1`, so other devices on the network can't reach it.

### 8.6 Build and packaging

```mermaid
flowchart LR
  A["npm run desktop:build"] --> B["scripts/build-desktop.mjs"]
  B --> C["next build<br/>(BUILD_STANDALONE=1 → output: standalone)"]
  C --> D["copy .next/static + public<br/>into .next/standalone;<br/>delete any .env*"]
  D --> E["electron-builder --win"]
  E --> F["app.asar<br/>electron/* + package.json only"]
  E --> G["after-pack.cjs<br/>copy standalone → resources/app-server"]
  F & G --> H["NSIS installer<br/>dist/Ladderly Setup x.y.z.exe"]
```

- `output: "standalone"` is enabled **only** for desktop builds (`BUILD_STANDALONE`), so Vercel builds are unaffected.
- `app.asar` excludes `node_modules`, because the main process uses only Electron and Node.js built-ins. The server's own trimmed `node_modules` travels inside `app-server`.
- The copy happens in an `afterPack` hook because electron-builder's `extraResources` skips `node_modules` and dot-folders such as `.next`.
- The installer is per-user (no admin rights needed), lets the user choose the folder, and creates Start menu and desktop shortcuts.

## 9. Error handling

| Failure | Where detected | User sees |
|---|---|---|
| Invalid input | `route.ts` (zod) | Message from the validator (HTTP 400) |
| Invalid API key | `describeError` | "The Anthropic API key is invalid…" |
| Rate limit | `describeError` | "Rate limited… wait a moment and retry." |
| Network down | `describeError` | "Couldn't reach the Anthropic API…" |
| Other API error | `describeError` | "The Anthropic API returned an error (status)…" |
| Refusal | `stop_reason` | "Claude declined… try rephrasing." |
| Output cut off | `stop_reason === "max_tokens"` | "The response was cut off… retry." |
| Bad or invalid JSON | zod `safeParse` | "…unexpected format. Please retry." |
| Stream closed early | `generate.ts` | "The connection closed before the path was finished…" |
| Desktop server fails to start | `main.js` | Error dialog, app quits |

Every UI error shows **Retry**, which re-sends the last request.

## 10. Security summary

- The key lives in `.env.local` (development), Vercel environment variables (not set, by design) or `config.json` (desktop). It is read only by server code.
- `.gitignore` excludes `.env*` except `.env.example`, which holds no key. The desktop build deletes `.env*` from the bundle in two places.
- The web deployment has no key, so the public endpoint can't spend money.
- Model output is treated as data: validated with zod and rendered as text by React (no HTML injection).
- Model output never supplies a URL. Links are built from a fixed list of platform search pages (search words are URL-encoded), or come from hand-verified demo data. External links use `rel="noopener noreferrer"`, and in the desktop app they open in the user's browser.

## 11. Design decisions

| Decision | Alternatives considered | Reason |
|---|---|---|
| Bundle the Next.js server in Electron | Load the Vercel URL; rewrite as a static app | Works offline, keeps the key out of the window, single codebase |
| NDJSON streaming | Server-Sent Events; no streaming | Simple, no dependencies, live preview |
| zod as the single source of truth | Hand-written JSON Schema and types | One definition drives the prompt schema, validation and TypeScript types |
| Demo mode on when no key | Explicit flag only | Fail-safe against accidental API costs |
| localStorage | Database / accounts | No backend state needed. Private to the device |
| `useSyncExternalStore` for storage | `useEffect` + `useState` | Correct hydration and no cascading renders |
| Per-stage video previews from YouTube's frame thumbnails | Embedded iframes; autoplaying muted video | No player loads until clicked, so it's light and private. Feels like a Netflix preview |
| Bring-your-own key + local Ollama | Hosted proxy with our own key; browser-only calls | Keeps Ladderly free to run: users pay their own provider (or nothing, locally), and the website can't run up costs |
| Platform search links for AI paths | Let Claude write course/video URLs; Claude web search; YouTube Data API | Always valid and free, with no extra API key or per-search cost. Specific verified links are used where they've been checked (demo samples) |

## 12. Possible future work

- In-app settings screen instead of editing `config.json`
- Code signing and auto-update for the desktop app
- Export and import of saved paths
- macOS and Linux builds (Electron supports them. They need their own build machines)
- More hand-written demo topics
- Specific video and course picks for AI paths, using Claude's web search tool or the YouTube Data API, with links checked before they're shown
