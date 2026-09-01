"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CircleDollarSign,
  Flame,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type IdeaCard = {
  title: string;
  source: string;
  score: number;
  theme: string;
  signal: string;
};

const ideaCards: IdeaCard[] = [
  {
    title: "AI agents for customer support ops",
    source: "Reddit /r/startups",
    score: 9.6,
    theme: "High churn from support ticket floods",
    signal: "3.1x faster issue escalation",
  },
  {
    title: "Simplified vendor invoice cleanup",
    source: "Twitter/X - finance founders",
    score: 8.9,
    theme: "Manual admin work drains margins",
    signal: "42% of founders mention tax friction",
  },
  {
    title: "Managed onboarding for SMB SaaS",
    source: "Reddit /r/SaaS",
    score: 8.3,
    theme: "Setup complexity creates shrinkage",
    signal: "Activation drop after week 2",
  },
];

const engineStats = [
  { label: "Pain signals tracked", value: "24.8K" },
  { label: "Ideas scored", value: "146" },
  { label: "Warm leads", value: "1.9K" },
  { label: "Freshness", value: "2 min" },
];

const priorityList = [
  { name: "Customer support bloat", level: 92 },
  { name: "Invoice reconciliation pain", level: 82 },
  { name: "Sales enablement gaps", level: 74 },
  { name: "Ops automation deficits", level: 68 },
];

export function ProductDashboard() {
  const [liveIdeas, setLiveIdeas] = useState<IdeaCard[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadIdeas() {
      const response = await fetch("/api/admin/ideas", { cache: "no-store" });
      if (!response.ok || cancelled) {
        return;
      }
      const payload = await response.json();
      setLiveIdeas(
        (payload.ideas ?? []).map((idea: Record<string, unknown>) => ({
          title: String(idea.title),
          source: String(idea.source),
          score: Number(idea.urgency ?? 0),
          theme: String(idea.summary),
          signal: `${String(idea.category)} signal`,
        })),
      );
    }

    loadIdeas();
    const supabase = createSupabaseBrowserClient();
    const channel = supabase?.channel("idea-clusters-live").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "idea_clusters" },
      (payload) => {
        const idea = payload.new as Record<string, unknown>;
        setLiveIdeas((current) => [
          {
            title: String(idea.summary_title),
            source: String(idea.source ?? "public signal"),
            score: Number(idea.urgency_score ?? 0),
            theme: String(idea.summary ?? idea.raw_complaint ?? ""),
            signal: `${String(idea.problem_category ?? idea.category)} signal`,
          },
          ...current,
        ].slice(0, 10));
      },
    ).subscribe();

    return () => {
      cancelled = true;
      if (channel && supabase) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E599]/10 text-[#00E599] ring-1 ring-[#00E599]/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              PainPoint AI
            </p>
            <p className="text-sm font-medium text-white">Signal radar</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
          <span>Overview</span>
          <span>Competitor noise</span>
          <span>Idea clusters</span>
          <span>Pricing</span>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Bell className="h-4 w-4" />
            Alerts
          </Button>
          <Button size="sm" className="bg-[#00E599] text-black hover:bg-[#40f4ba]">
            Upgrade
          </Button>
        </div>
      </header>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#00E599]">
            live market pulse
          </p>
          <h1 className="font-display text-4xl tracking-[-0.06em] text-white md:text-5xl">
            The most expensive startup ideas are already in public comments.
          </h1>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/3 px-4 py-2 text-sm text-white/70 md:block">
          Updated 2 min ago
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {engineStats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-4"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">
              {stat.label}
            </p>
            <p className="font-display text-3xl tracking-[-0.06em] text-white">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="min-h-[420px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/5">
            <div>
              <CardTitle>Idea clusters</CardTitle>
              <CardDescription>High-intent pain points currently compounding</CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#00E599]/20 bg-[#00E599]/10 px-3 py-1 text-xs text-[#00E599]">
              <TrendingUp className="h-3.5 w-3.5" />
              hot
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {(liveIdeas.length ? liveIdeas : ideaCards).map((idea, index) => (
              <motion.div
                key={idea.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {idea.source}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{idea.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00E599]/10 text-[#00E599]">
                    {idea.score.toFixed(1)}
                  </div>
                </div>

                <p className="mb-3 text-sm text-white/70">{idea.theme}</p>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#00E599]">
                    <Flame className="h-3.5 w-3.5" />
                    {idea.signal}
                  </div>
                  <button className="flex items-center gap-1 text-sm text-white/70 transition hover:text-white">
                    View brief
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Priority stack</CardTitle>
                  <CardDescription>Urgency across tracked themes</CardDescription>
                </div>
                <Search className="h-4 w-4 text-white/60" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorityList.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                    <span>{item.name}</span>
                    <span>{item.level}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00E599] to-[#6aeeb5]"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Lead quality</CardTitle>
                  <CardDescription>Warm leads generated from public pain</CardDescription>
                </div>
                <ShieldCheck className="h-4 w-4 text-[#00E599]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-[#00E599]/15 bg-[#00E599]/5 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#00E599]">
                    Fresh leads
                  </p>
                  <p className="mt-2 text-3xl font-display text-white">1,428</p>
                </div>
                <CircleDollarSign className="h-8 w-8 text-[#00E599]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Top segment</p>
                  <p className="mt-2 text-lg font-medium text-white">Support ops</p>
                  <p className="mt-1 text-sm text-white/60">29% of new leads</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Close window</p>
                  <p className="mt-2 text-lg font-medium text-white">14 days</p>
                  <p className="mt-1 text-sm text-white/60">High intent, high friction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-[#E0B363]" />
              Pro tracking
            </CardTitle>
            <CardDescription>Custom keywords across Reddit and X</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>AI onboarding</span>
                <span className="text-[#00E599]">+18%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>billing breakdown</span>
                <span className="text-[#00E599]">+27%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>customer support debt</span>
                <span className="text-[#00E599]">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#E0B363]" />
              Signal alerts
            </CardTitle>
            <CardDescription>Triggered by a sharp rise in pain points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-white/70">
              <p className="rounded-xl border border-[#E0B363]/20 bg-[#E0B363]/8 px-3 py-2 text-white">
                AI support agents are trending in SMB SaaS threads with a 31% lift this week.
              </p>
              <p className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                Finance founders mention invoice automation in 42% of new conversations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#E0B363]" />
              Validation layer
            </CardTitle>
            <CardDescription>AI checks for novelty, market fit, and urgency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>Novelty</span>
                <span className="text-[#00E599]">86/100</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>Urgency</span>
                <span className="text-[#00E599]">91/100</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                <span>Win rate</span>
                <span className="text-[#00E599]">72%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
