import { NextResponse } from "next/server";

import { processWithGemini } from "@/lib/ai";
import { dequeuePost, type RawPost } from "@/lib/queue";
import { ingestIdeas } from "@/lib/demo-store";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return !secret || request.headers.get("authorization") === `Bearer ${secret}`;
}

async function notifyMatchingProUsers(competitor: string | null) {
  const resendKey = process.env.RESEND_API_KEY;
  const supabase = createSupabaseAdminClient();
  if (!resendKey || !supabase || !competitor) {
    return 0;
  }

  const { data: matches, error } = await supabase
    .from("tracked_keywords")
    .select("keyword, profiles!inner(email, tier)")
    .ilike("keyword", `%${competitor}%`);
  if (error) {
    throw error;
  }

  const recipients = (matches ?? [])
    .flatMap((match) => (Array.isArray(match.profiles) ? match.profiles : [match.profiles]))
    .filter((profile) => profile?.tier === "pro")
    .map((profile) => profile?.email)
    .filter((email): email is string => Boolean(email));
  if (recipients.length === 0) {
    return 0;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "PainPoint AI <alerts@painpoint.ai>",
      to: recipients,
      subject: `New competitor lead: ${competitor}`,
      text: `PainPoint AI detected a new complaint mentioning ${competitor}.`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend request failed with status ${response.status}`);
  }

  return recipients.length;
}

function processWithoutGemini(post: RawPost) {
  return {
    problem_category: "general",
    competitor_mentioned: null,
    urgency_score: 7,
    summary: `${post.title}: ${post.selftext}`.slice(0, 220),
  };
}

async function persistCloudIdea(post: RawPost, idea: Awaited<ReturnType<typeof processWithGemini>>) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("idea_clusters").upsert(
    {
      id: post.id,
      problem_category: idea.problem_category,
      category: idea.problem_category,
      urgency_score: idea.urgency_score,
      competitor_mentioned: idea.competitor_mentioned,
      summary_title: idea.summary.slice(0, 120),
      summary: idea.summary,
      raw_complaint: `${post.title}\n\n${post.selftext}`.trim(),
      source_url: post.source_url ?? null,
      source: post.source ?? "public",
      author: post.author,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (error) {
    throw error;
  }

  await notifyMatchingProUsers(idea.competitor_mentioned);
  return true;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    let post = await dequeuePost();

    if (!post && process.env.NODE_ENV !== "production") {
      const query = typeof body?.query === "string" ? body.query : "customer support pain";
      const python = process.platform === "win32" ? "python" : "python3";
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const { stdout } = await promisify(execFile)(python, ["scripts/scrape_reddit.py"], {
        cwd: process.cwd(),
        env: { ...process.env, PAINPOINT_QUERY: query },
        timeout: 30000,
      });
      const scraped = JSON.parse(stdout || "{}");
      post = scraped.posts?.[0] ?? null;
    }

    if (!post) {
      return NextResponse.json({ ok: true, processed: 0, message: "Queue is empty" });
    }

    const idea =
      !process.env.GEMINI_API_KEY && process.env.NODE_ENV !== "production"
        ? processWithoutGemini(post)
        : await processWithGemini(post);
    const persistedToSupabase = await persistCloudIdea(post, idea);
    if (!persistedToSupabase) {
      await ingestIdeas([
        {
          title: idea.summary,
          selftext: post.selftext,
          source: post.source ?? "public signal",
          category: idea.problem_category,
          score: idea.urgency_score,
        },
      ]);
    }

    return NextResponse.json({ ok: true, processed: 1, persistedToSupabase });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Queue processing failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
