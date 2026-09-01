"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Gauge,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const marketSignals = [
  { label: "AI support debt", score: 9.6, change: "+31%" },
  { label: "Invoice cleanup", score: 8.9, change: "+22%" },
  { label: "Onboarding friction", score: 8.3, change: "+18%" },
];

const featureCards = [
  {
    icon: Search,
    title: "Search the real market",
    description:
      "Monitor Reddit, X, and founder communities for the problems people keep repeating in public.",
  },
  {
    icon: BrainCircuit,
    title: "Turn noise into opportunity",
    description:
      "Cluster complaints into themes, rank urgency, and isolate which pain points are worth acting on.",
  },
  {
    icon: Gauge,
    title: "Ship before the trend peaks",
    description:
      "Get signal alerts as soon as an issue crosses a meaningful threshold and starts compounding.",
  },
];

const steps = [
  {
    title: "Listen",
    copy: "We scan community chatter and extract repeated pain patterns across the market.",
  },
  {
    title: "Score",
    copy: "AI ranks each problem by urgency, repetition, and commercial viability.",
  },
  {
    title: "Act",
    copy: "Prioritize the best opportunities and track emerging signals before competitors do.",
  },
];

const trustMetrics = [
  { value: "24.8K", label: "pain signals tracked" },
  { value: "1.9K", label: "warm leads surfaced" },
  { value: "92%", label: "founder response rate" },
];

export function StalkrLanding() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f5f3ef]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(circle_at_top,_rgba(92,92,255,0.18),transparent_34%),radial-gradient(circle_at_78%_18%,_rgba(79,180,255,0.12),transparent_24%),linear-gradient(180deg,#0b0b0d_0%,#0b0b0d_100%)]" />

      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#0b0b0d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-medium text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#9bb7ff]/30 bg-[#6a7cff]/12 text-[#dfe7ff]">
              <Sparkles className="h-4 w-4" />
            </div>
            PainPoint AI
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#d7d1c7]/70 md:flex">
            <a href="#product" className="transition hover:text-white">
              Product
            </a>
            <a href="#signals" className="transition hover:text-white">
              Signals
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Preview</Link>
            </Button>
            <Button asChild className="bg-[#e6f1ff] text-[#0d1117] hover:bg-white">
              <Link href="/admin">Start stalking</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="pt-14 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7e9cff]/20 bg-[#7e9cff]/8 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#dfe7ff]">
                <span className="h-2 w-2 rounded-full bg-[#7ae0c3]" />
                Startup signal engine
              </div>

              <h1 className="max-w-xl text-5xl leading-[0.9] tracking-[-0.08em] text-white sm:text-6xl lg:text-7xl">
                Find the next wedge before the market does.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-[#d7d1c7]/72">
                We mine public founder chatter for the recurring pain points that signal a big business opportunity — before they become obvious.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Explore dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/admin">
                    <Play className="h-4 w-4" />
                    Watch demo
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-[#d7d1c7]/55">
                {[
                  "Reddit",
                  "X / Twitter",
                  "Founder communities",
                  "AI cluster scoring",
                ].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_center,_rgba(122,224,195,0.18),transparent_38%)] blur-3xl" />
              <div className="rounded-[32px] border border-white/10 bg-[#111214]/90 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-xs uppercase tracking-[0.15em] text-[#d7d1c7]/60">
                  <span>Signal board</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#7ae0c3]/20 bg-[#7ae0c3]/10 px-2 py-1 text-[#7ae0c3]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7ae0c3]" />
                    live
                  </span>
                </div>

                <div className="space-y-3">
                  {marketSignals.map((signal) => (
                    <div key={signal.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#d7d1c7]/50">Opportunity</p>
                          <h3 className="mt-1 text-xl font-medium text-white">{signal.label}</h3>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7ae0c3]/10 text-lg text-[#7ae0c3]">
                          {signal.score.toFixed(1)}
                        </div>
                      </div>

                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7ae0c3] via-[#7ea5ff] to-[#e6dcff]"
                          style={{ width: `${signal.score * 10}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm text-[#d7d1c7]/72">
                        <span>Urgency trend</span>
                        <span className="text-[#7ae0c3]">{signal.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[#7e9cff]/20 bg-[#7e9cff]/8 p-4">
                  <div className="flex items-center justify-between text-sm text-[#dfe7ff]">
                    <span>Signal freshness</span>
                    <span className="text-[#7ae0c3]">2 min ago</span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    {[40, 55, 68, 82, 96, 75, 88].map((bar) => (
                      <div key={bar} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#7e9cff] to-[#dfe7ff]" style={{ height: `${bar}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {trustMetrics.map((metric) => (
            <div key={metric.label} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
              <p className="text-3xl font-medium tracking-[-0.06em] text-white">{metric.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#d7d1c7]/58">{metric.label}</p>
            </div>
          ))}
        </section>

        <section id="product" className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9bb7ff]">Built for product teams</p>
            <h2 className="mt-4 text-4xl tracking-[-0.07em] text-white sm:text-5xl">
              Turn public complaints into real business opportunities.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35 }}
                className="rounded-[28px] border border-white/8 bg-[#111214] p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#9bb7ff]/20 bg-[#9bb7ff]/10 text-[#dfe7ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl tracking-[-0.05em] text-white">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#d7d1c7]/72">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="signals" className="mt-24 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/8 bg-[#111214] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#7ae0c3]">Signals that matter</p>
            <h3 className="mt-4 text-4xl tracking-[-0.07em] text-white">What founders are saying, before it becomes a category.</h3>
            <div className="mt-8 space-y-4">
              {[
                "Support tooling is becoming a bigger operational burden than onboarding itself.",
                "Vendors are paying a hidden tax in manual invoice cleanup and reconciliation.",
                "Activation drops after week two are creating a new retention problem for SaaS teams.",
              ].map((quote) => (
                <div key={quote} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-base leading-7 text-[#d7d1c7]/78">
                  {quote}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,#111214,#0e0f11)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d7d1c7]/55">Opportunity radar</p>
                <h3 className="mt-2 text-3xl tracking-[-0.06em] text-white">High-conviction clusters</h3>
              </div>
              <div className="rounded-full border border-[#9bb7ff]/20 bg-[#9bb7ff]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#dfe7ff]">
                updated 2m ago
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {[
                { label: "Customer support ops", value: 92, tone: "from-[#7ae0c3] to-[#b3f5d8]" },
                { label: "Finance tooling gaps", value: 84, tone: "from-[#9bb7ff] to-[#dfe7ff]" },
                { label: "B2B onboarding friction", value: 76, tone: "from-[#f0d2a8] to-[#e7c88d]" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[#d7d1c7]/72">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#7ae0c3]">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.18em]">Trend</span>
                </div>
                <p className="text-2xl tracking-[-0.05em] text-white">+31%</p>
                <p className="mt-1 text-sm text-[#d7d1c7]/68">support ops complaints this week</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#9bb7ff]">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.18em]">Ready</span>
                </div>
                <p className="text-2xl tracking-[-0.05em] text-white">14</p>
                <p className="mt-1 text-sm text-[#d7d1c7]/68">validated opportunities in queue</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#d7d1c7]/55">How it works</p>
            <h2 className="mt-4 text-4xl tracking-[-0.07em] text-white sm:text-5xl">Three layers of insight.</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-white/8 bg-[#111214] p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-sm text-[#d7d1c7]">
                  0{index + 1}
                </div>
                <h3 className="text-2xl tracking-[-0.05em] text-white">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#d7d1c7]/72">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-24">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(111,124,255,0.2),transparent_30%),#0f0f12] p-8 text-center sm:p-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[#dfe7ff]">Built for founders and operators</p>
            <h2 className="mt-4 text-4xl tracking-[-0.07em] text-white sm:text-6xl">
              Start tracking the market that matters.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#d7d1c7]/72">
              From first-pain discovery to lead-grade insight, PainPoint AI helps your team spot what people are telling each other in public before the category gets crowded.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open live board
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/admin">View admin</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-white/8 px-4 py-8 text-sm text-[#d7d1c7]/60 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9bb7ff]/20 bg-[#9bb7ff]/10 text-[#dfe7ff]">
            <BriefcaseBusiness className="h-4 w-4" />
          </div>
          PainPoint AI
        </div>
        <div className="flex items-center gap-6">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}
