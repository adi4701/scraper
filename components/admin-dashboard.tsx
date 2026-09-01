"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Database,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type IdeaStatus = "pending" | "approved" | "archived";

type Idea = {
  id: string;
  title: string;
  category: string;
  source: string;
  urgency: number;
  status: IdeaStatus;
  summary: string;
};

export function AdminDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      try {
        const response = await fetch("/api/admin/ideas", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load admin data");
        }
        const payload = await response.json();
        const nextIdeas = (payload.ideas ?? []).map((idea: any) => ({
          id: String(idea.id),
          title: String(idea.title),
          category: String(idea.category),
          source: String(idea.source),
          urgency: Number(idea.urgency ?? 7.5),
          status: (idea.status ?? "pending") as Idea["status"],
          summary: String(idea.summary),
        }));

        setIdeas(nextIdeas);
        setKeywords(payload.keywords ?? []);
        setSelectedId((current) => current || nextIdeas[0]?.id || "");
      } catch {
        setIdeas([]);
        setKeywords([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBoard();
  }, []);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesQuery =
        query.trim() === "" ||
        [idea.title, idea.summary, idea.category, idea.source]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesCategory = category === "all" || idea.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, ideas, query]);

  const selectedIdea =
    filteredIdeas.find((idea) => idea.id === selectedId) ??
    filteredIdeas[0] ??
    ideas[0] ?? {
      id: "",
      title: "No ideas yet",
      category: "general",
      source: "system",
      urgency: 0,
      status: "pending",
      summary: "No market signals are available yet. Trigger a queue refresh to populate the board.",
    };

  const metrics = useMemo(() => {
    const approved = ideas.filter((idea) => idea.status === "approved").length;
    const pending = ideas.filter((idea) => idea.status === "pending").length;
    const avgUrgency =
      ideas.reduce((total, idea) => total + idea.urgency, 0) / Math.max(ideas.length, 1);

    return {
      approved,
      pending,
      avgUrgency,
      trackedKeywords: keywords.length,
    };
  }, [ideas, keywords.length]);

  const updateIdeaStatus = async (id: string, status: "pending" | "approved" | "archived") => {
    if (!id) {
      return;
    }

    const response = await fetch("/api/admin/ideas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      return;
    }

    setIdeas((current) =>
      current.map((idea) => (idea.id === id ? { ...idea, status } : idea)),
    );
  };

  const handleAddKeyword = async () => {
    const value = newKeyword.trim();
    if (!value) return;

    const response = await fetch("/api/admin/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: value }),
    });

    if (response.ok) {
      const payload = await response.json();
      setKeywords(payload.keywords ?? [...keywords, value]);
      setNewKeyword("");
    }
  };

  const handleDeleteKeyword = async (keyword: string) => {
    const response = await fetch("/api/admin/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, action: "remove" }),
    });

    if (response.ok) {
      const payload = await response.json();
      setKeywords(payload.keywords ?? keywords.filter((item) => item !== keyword));
    }
  };

  const runQueueRefresh = async () => {
    const response = await fetch("/api/process-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query || "customer support pain" }),
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    if (!payload.ok) {
      return;
    }

    const refreshed = await fetch("/api/admin/ideas", { cache: "no-store" });
    const nextBoard = await refreshed.json();
    const nextIdeas = (nextBoard.ideas ?? []).map((idea: any) => ({
      id: String(idea.id),
      title: String(idea.title),
      category: String(idea.category),
      source: String(idea.source),
      urgency: Number(idea.urgency ?? 7.5),
      status: (idea.status ?? "pending") as Idea["status"],
      summary: String(idea.summary),
    }));

    setIdeas(nextIdeas);
    setSelectedId((current) => current || nextIdeas[0]?.id || "");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-[#0A0A0A]/80 p-4 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00E599]/10 text-[#00E599] ring-1 ring-[#00E599]/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">PainPoint AI</p>
              <p className="font-display text-xl tracking-[-0.06em] text-white">Admin</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm text-white/70">
            {[
              "Overview",
              "Signal board",
              "Validated clusters",
              "Tracked keywords",
              "Alerts",
            ].map((item, index) => (
              <div
                key={item}
                className={[
                  "flex items-center justify-between rounded-2xl border px-3 py-2.5",
                  index === 0
                    ? "border-[#00E599]/20 bg-[#00E599]/8 text-white"
                    : "border-transparent bg-transparent text-white/60",
                ].join(" ")}
              >
                <span>{item}</span>
                {index === 0 ? <Zap className="h-4 w-4 text-[#00E599]" /> : null}
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#E0B363]/15 bg-[#E0B363]/8 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E0B363]">Ops status</p>
            <p className="mt-3 text-2xl font-display text-white">Healthy</p>
            <p className="mt-2 text-sm text-white/65">Scrape cadence is active and all jobs are within SLA.</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#0A0A0A]/80 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#00E599]">Admin control center</p>
              <h1 className="mt-2 font-display text-3xl tracking-[-0.06em] text-white md:text-4xl">
                Market intelligence operations
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={runQueueRefresh}>
                <Bell className="h-4 w-4" />
                Refresh queue
              </Button>
              <Button size="sm" className="bg-[#00E599] text-black hover:bg-[#40f4ba]">
                Publish brief
              </Button>
            </div>
          </header>

          <section className="mb-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Approved", value: metrics.approved, tone: "text-[#00E599]" },
              { label: "Pending", value: metrics.pending, tone: "text-[#E0B363]" },
              { label: "Avg urgency", value: `${metrics.avgUrgency.toFixed(1)}/10`, tone: "text-white" },
              { label: "Tracked keywords", value: metrics.trackedKeywords, tone: "text-[#00E599]" },
            ].map((stat) => (
              <Card key={stat.label} className="border-white/10 bg-[#0A0A0A]/80">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
                  <p className={`mt-3 font-display text-3xl ${stat.tone}`}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mb-6 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-[#0A0A0A]/80 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5">
              <Search className="h-4 w-4 text-white/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search clusters or complaints"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-3 py-2.5">
              <Filter className="h-4 w-4 text-white/45" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-transparent text-sm text-white outline-none"
              >
                <option value="all" className="bg-black text-white">All categories</option>
                <option value="support ops" className="bg-black text-white">Support ops</option>
                <option value="finance ops" className="bg-black text-white">Finance ops</option>
                <option value="onboarding" className="bg-black text-white">Onboarding</option>
                <option value="billing" className="bg-black text-white">Billing</option>
              </select>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-white/10 bg-[#0A0A0A]/80">
              <CardHeader className="flex-row items-center justify-between gap-3 border-b border-white/5">
                <div>
                  <CardTitle>Cluster queue</CardTitle>
                  <CardDescription>Approve, archive, or promote ideas for publication</CardDescription>
                </div>
                <div className="rounded-full border border-[#00E599]/20 bg-[#00E599]/10 px-3 py-1 text-xs text-[#00E599]">
                  {filteredIdeas.length} live
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                {isLoading ? (
                  <p className="text-sm text-white/60">Loading admin board...</p>
                ) : filteredIdeas.length === 0 ? (
                  <p className="text-sm text-white/60">No signals yet. Run a queue refresh to load fresh ideas.</p>
                ) : (
                  filteredIdeas.map((idea) => (
                    <button
                      key={idea.id}
                      type="button"
                      onClick={() => setSelectedId(idea.id)}
                      className={[
                        "w-full rounded-2xl border p-4 text-left transition",
                        selectedIdea.id === idea.id
                          ? "border-[#00E599]/25 bg-[#00E599]/5"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{idea.source}</p>
                          <h3 className="mt-2 text-xl font-semibold text-white">{idea.title}</h3>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00E599]/10 text-[#00E599]">
                          {idea.urgency.toFixed(1)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-white/70">{idea.summary}</p>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-white/60">
                          {idea.category}
                        </span>
                        <span
                          className={[
                            "rounded-full px-2.5 py-1",
                            idea.status === "approved"
                              ? "bg-[#00E599]/10 text-[#00E599]"
                              : idea.status === "pending"
                                ? "bg-[#E0B363]/10 text-[#E0B363]"
                                : "bg-white/5 text-white/60",
                          ].join(" ")}
                        >
                          {idea.status}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-white/10 bg-[#0A0A0A]/80">
                <CardHeader>
                  <CardTitle>{selectedIdea.title}</CardTitle>
                  <CardDescription>{selectedIdea.source}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Raw signal</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">{selectedIdea.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Category</p>
                      <p className="mt-2 text-lg font-medium text-white">{selectedIdea.category}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Urgency</p>
                      <p className="mt-2 text-lg font-medium text-white">{selectedIdea.urgency.toFixed(1)}/10</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-[#00E599] text-black hover:bg-[#40f4ba]"
                      onClick={() => updateIdeaStatus(selectedIdea.id, "approved")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateIdeaStatus(selectedIdea.id, "pending")}
                    >
                      Review later
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateIdeaStatus(selectedIdea.id, "archived")}
                    >
                      <Trash2 className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#0A0A0A]/80">
                <CardHeader className="flex-row items-center justify-between gap-3 border-b border-white/5">
                  <div>
                    <CardTitle>Tracked keywords</CardTitle>
                    <CardDescription>Pro-level signal watchlist</CardDescription>
                  </div>
                  <Database className="h-4 w-4 text-[#00E599]" />
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  <div className="flex gap-2">
                    <input
                      value={newKeyword}
                      onChange={(event) => setNewKeyword(event.target.value)}
                      placeholder="Add keyword"
                      className="flex-1 rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
                    />
                    <Button size="sm" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {keywords.map((keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-white/75"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteKeyword(keyword)}
                          className="text-white/45 transition hover:text-white"
                          aria-label={`Remove ${keyword}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="border-white/10 bg-[#0A0A0A]/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#E0B363]" />
                  Alert stream
                </CardTitle>
                <CardDescription>Fresh signals that need a response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm text-white/70">
                <div className="rounded-2xl border border-[#E0B363]/15 bg-[#E0B363]/5 p-3">
                  AI support agents are trending upward in SMB SaaS threads with a 31% lift this week.
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                  Billing transparency complaints are resurfacing after a wave of pricing changes.
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0A0A0A]/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-[#00E599]" />
                  Publishing queue
                </CardTitle>
                <CardDescription>Ideas ready to go live to public pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm text-white/70">
                {ideas
                  .filter((idea) => idea.status === "approved")
                  .map((idea) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2"
                    >
                      <span>{idea.title}</span>
                      <span className="text-[#00E599]">Ready</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
