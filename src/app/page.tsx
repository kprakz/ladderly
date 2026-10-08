import type { Metadata } from "next";
import Link from "next/link";
import { AuthorNote } from "@/components/AuthorNote";
import { CursorGlow } from "@/components/CursorGlow";
import { Logo } from "@/components/Logo";
import { ShootingStars } from "@/components/ShootingStars";
import { DownloadMap } from "@/components/site/DownloadMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TopicBackground } from "@/components/TopicBackground";
import { DEFAULT_THEME } from "@/lib/topicTheme";

export const metadata: Metadata = {
  title: { absolute: "Ladderly: the first step towards you" },
  description:
    "Type any skill and get a clear, step-by-step learning path with videos, courses, quizzes and streaks. Free and open source for Windows and the web.",
};

const DOWNLOAD_HREF = "/api/download";
const GITHUB_REPO = "https://github.com/kprakz/ladderly";

const STEPS = [
  { title: "Type a skill", text: "Guitar, Python, public speaking, machine learning: anything you've wanted to start." },
  { title: "Get your ladder", text: "A short path of 4–6 stages, from zero to confident, with exactly what to learn and practise." },
  { title: "Climb a step a day", text: "Tick off checkpoints, unlock quizzes and keep your streak going. Small steps add up." },
];

const FEATURES = [
  { icon: "🪜", title: "Step-by-step paths", text: "Each stage tells you what to learn, what to practise and when you're ready to move on, with a simple checklist." },
  { icon: "▶️", title: "Videos for every week", text: "Hand-picked videos in a scrolling row with hover previews, plus free and paid courses from trusted platforms." },
  { icon: "🎯", title: "Quizzes that unlock", text: "Finish a stage's checklist to unlock a short quiz. Every answer comes with an explanation, and your best score is saved." },
  { icon: "🔥", title: "Streaks and rest days", text: "Learn a little each day to grow your streak. Every 7 days in a row earns a ❄️ rest day that protects it when life gets busy." },
  { icon: "📈", title: "Your year at a glance", text: "A GitHub-style heatmap of every step you've taken, a daily goal to aim for, and badges for your milestones." },
  { icon: "🧠", title: "Choose your AI", text: "Start with the free demo, run a free open-source model on your own computer, or plug in your own Claude or OpenAI key." },
  { icon: "🔒", title: "Private by design", text: "No account, no sign-up. Your name, paths and progress stay on your device." },
  { icon: "🌙", title: "Calm by design", text: "One next step at a time, a gentle background that matches your topic, and light and dark mode." },
];

const ENGINES = [
  { name: "Free demo", cost: "Free", text: "Detailed paths for guitar, Python, public speaking and machine learning, and a general plan for anything else." },
  { name: "Local model (Ollama)", cost: "Free", text: "Any topic, generated on your own computer, so it stays private. Ladderly recommends a model that fits your storage and memory. Desktop app only." },
  { name: "Claude", cost: "Your Anthropic key", text: "The most detailed paths. You pay Anthropic directly for what you use; the key stays on your device." },
  { name: "OpenAI GPT", cost: "Your OpenAI key", text: "Detailed paths with GPT models. You pay OpenAI directly for what you use; the key stays on your device." },
];

const FAQ = [
  { q: "Is Ladderly really free?", a: "Yes. The app, the demo paths and local AI models are free. Only if you choose to use your own Claude or OpenAI key do you pay those companies for what you use." },
  { q: "Do I need an account?", a: "No. There's nothing to sign up for. Open the app and start learning." },
  { q: "Where is my data stored?", a: "On your device only: your name, paths, progress and streaks. Ladderly has no server-side accounts and doesn't track you." },
  { q: "Does it work offline?", a: "The desktop app works offline with the demo paths, and with a local model once it's downloaded. Videos and course links need the internet." },
  { q: "Windows says “Windows protected your PC”. Is that OK?", a: "Ladderly is new, so Windows SmartScreen may not recognise it yet. Click “More info”, then “Run anyway”. The full source code is on GitHub if you'd like to check it." },
  { q: "Is there a Mac or Linux version?", a: "Not yet. On a Mac, Linux or a phone, use Ladderly in your browser: it's the same app (local AI models need the Windows app)." },
  { q: "Is it open source?", a: "Yes. The code is on GitHub, and contributions and ideas are welcome." },
];

/**
 * The Ladderly website: what it is, how it works, features, AI options, download, a world map of downloads, FAQ.
 * @returns {JSX.Element} The landing page.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <TopicBackground theme={DEFAULT_THEME} />
      <CursorGlow color={DEFAULT_THEME.glows[0]} />
      <ShootingStars anchorId="site-logo" />

      {/* Navigation */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-semibold">
          <Logo size={28} className="rounded-md" />
          Ladderly
        </a>
        <div className="flex items-center gap-1 text-sm">
          <a href="#features" className="hidden rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 sm:inline dark:text-zinc-300 dark:hover:bg-zinc-900">
            Features
          </a>
          <a href="#ai" className="hidden rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 sm:inline dark:text-zinc-300 dark:hover:bg-zinc-900">
            AI options
          </a>
          <a href="#download" className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900">
            Download
          </a>
          <ThemeToggle />
        </div>
      </nav>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-16">
          <div className="brand relative z-40 mx-auto w-fit">
            <span id="site-logo" className="inline-block">
              <Logo size={88} className="block rounded-[1.4rem] shadow-lg ring-1 ring-black/5 dark:ring-white/15" />
            </span>
            <h1 className="brand-text mt-5 text-5xl font-bold tracking-tight sm:text-6xl">Ladderly</h1>
          </div>
          <p className="mt-3 text-lg font-medium text-zinc-500 dark:text-zinc-400">The first step towards you</p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            Type any skill and get a clear, step-by-step path from zero to confident, with videos, courses, quizzes and
            streaks to keep you climbing. Free and open source.
          </p>
          <DownloadButtons />
          <AuthorNote />
        </section>

        <AppPreview />

        {/* How it works */}
        <Section id="how" eyebrow="How it works" title="Three steps, then one a day">
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">{i + 1}</span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Features */}
        <Section id="features" eyebrow="Features" title="Everything you need to keep going">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <span aria-hidden="true" className="text-2xl">
                  {f.icon}
                </span>
                <h3 className="mt-2 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.text}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* AI options */}
        <Section id="ai" eyebrow="AI options" title="Free to start, room to grow">
          <ul className="grid gap-4 sm:grid-cols-2">
            {ENGINES.map((e) => (
              <li key={e.name} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{e.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      e.cost === "Free" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {e.cost}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{e.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-sm text-zinc-500">Switch any time from ⚙️ Settings in the app.</p>
        </Section>

        {/* Download */}
        <Section id="download" eyebrow="Download" title="Start climbing today">
          <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 text-center sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <Logo size={56} className="mx-auto rounded-xl" />
            <h3 className="mt-3 text-lg font-semibold">Ladderly for Windows</h3>
            <p className="mt-1 text-sm text-zinc-500">Windows 10 or 11 · 64-bit · about 115 MB · free</p>
            <DownloadButtons />
            <ol className="mx-auto mt-6 max-w-sm space-y-1.5 text-left text-sm text-zinc-600 dark:text-zinc-400">
              <li>1. Open the downloaded <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Ladderly-Setup.exe</code>.</li>
              <li>2. If Windows shows a blue warning, click &ldquo;More info&rdquo; → &ldquo;Run anyway&rdquo;.</li>
              <li>3. Follow the installer, then open Ladderly from the Start menu or desktop.</li>
            </ol>
          </div>
        </Section>

        {/* Downloads around the world */}
        <Section id="world" eyebrow="Community" title="Climbers around the world">
          <DownloadMap />
        </Section>

        {/* FAQ */}
        <Section id="faq" eyebrow="FAQ" title="Questions, answered">
          <div className="mx-auto max-w-2xl divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span aria-hidden="true" className="text-zinc-400 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        <p>
          Made with care by Karthik Prakashan ·{" "}
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

/**
 * The two main calls to action: download for Windows, or open the app in the browser.
 * @returns {JSX.Element} The buttons.
 */
function DownloadButtons() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href={DOWNLOAD_HREF}
        rel="nofollow"
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M0 3.4 9.8 2v9.5H0V3.4Zm11-1.6L24 0v11.4H11V1.8ZM0 12.6h9.8V22L0 20.6v-8Zm11 0h13V24l-13-1.8v-9.6Z" />
        </svg>
        Download for Windows
      </a>
      <Link
        href="/app"
        className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        Try it in your browser
      </Link>
    </div>
  );
}

/**
 * A titled page section.
 * @param {Object} props
 * @param {string} props.id Anchor id for the nav links.
 * @param {string} props.eyebrow Small label above the title.
 * @param {string} props.title The section heading.
 * @param {React.ReactNode} props.children The section content.
 * @returns {JSX.Element} The section.
 */
function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6">
      <p className="text-center text-sm font-medium text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
      <h2 className="mt-1 text-center text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/**
 * A static picture of the app (built with HTML, not a screenshot): the welcome line, streak and goal chips, the
 * next step, and a path with stages.
 * @returns {JSX.Element} The preview.
 */
function AppPreview() {
  const stages = [
    { title: "Guitar foundations", meta: "1–2 weeks · 2/2 done", done: true },
    { title: "Open chords", meta: "3–4 weeks · 2/2 done", done: true },
    { title: "Rhythm and strumming", meta: "3–4 weeks · 1/2 done", done: false },
    { title: "Songs and barre chords", meta: "4–6 weeks · 0/2 done", done: false },
  ];
  return (
    <div aria-hidden="true" className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-2xl shadow-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="ml-3 text-xs text-zinc-500">Ladderly</span>
        </div>
        <div className="space-y-4 p-4 text-left sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">Welcome back, Alex 👋</p>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">🔥 12 days</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">🎯 2/3 today</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-zinc-500">Next step · Guitar, stage 3</p>
              <p className="truncate text-sm font-medium">Play one full song along with the recording</p>
            </div>
            <span className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white">✓ Done</span>
          </div>
          <div>
            <p className="text-lg font-bold">Guitar</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full w-[62%] rounded-full bg-indigo-500" />
            </div>
          </div>
          <ol className="space-y-2">
            {stages.map((s, i) => (
              <li key={s.title} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    s.done ? "bg-emerald-500 text-white" : i === 2 ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {s.done ? "✓" : i + 1}
                </span>
                <span className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="block text-[11px] text-zinc-500">{s.meta}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
