import { NextResponse } from "next/server";

import {
  addKeyword,
  readStore,
  removeKeyword,
  updateIdeaStatus,
} from "@/lib/demo-store";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const [{ data: ideas, error: ideasError }, { data: keywords, error: keywordsError }] =
      await Promise.all([
        supabase.from("idea_clusters").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("tracked_keywords").select("keyword"),
      ]);
    if (ideasError || keywordsError) {
      return NextResponse.json({ error: ideasError?.message || keywordsError?.message }, { status: 500 });
    }
    return NextResponse.json({
      ideas: (ideas ?? []).map((idea) => ({
        id: idea.id,
        title: idea.summary_title,
        category: idea.problem_category ?? idea.category,
        source: idea.source ?? "public signal",
        urgency: idea.urgency_score,
        status: "pending",
        summary: idea.summary ?? idea.raw_complaint,
      })),
      keywords: (keywords ?? []).map((item) => item.keyword),
    });
  }

  const store = await readStore();
  return NextResponse.json(store);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body ?? {};

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const idea = await updateIdeaStatus(id, status);
    return NextResponse.json({ ok: true, idea });
  } catch {
    return NextResponse.json({ error: "Unable to update idea" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword, action } = body ?? {};

    if (action === "remove") {
      const keywords = await removeKeyword(keyword ?? "");
      return NextResponse.json({ ok: true, keywords });
    }

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    const keywords = await addKeyword(keyword);
    return NextResponse.json({ ok: true, keywords });
  } catch {
    return NextResponse.json({ error: "Unable to update keywords" }, { status: 500 });
  }
}
