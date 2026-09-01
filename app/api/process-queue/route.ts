import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { NextResponse } from "next/server";

import { ingestIdeas } from "@/lib/demo-store";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = typeof body?.query === "string" ? body.query : "customer support pain";
    const python = process.platform === "win32" ? "python" : "python3";

    const { stdout } = await execFileAsync(
      python,
      ["scripts/scrape_reddit.py"],
      {
        cwd: process.cwd(),
        env: { ...process.env, PAINPOINT_QUERY: query },
        timeout: 30000,
      },
    );

    let payload: { reddit?: Array<Record<string, unknown>>; twitter?: Array<Record<string, unknown>> } = {};

    try {
      payload = JSON.parse(stdout || "{}");
    } catch {
      payload = {};
    }

    const incoming = [...(payload.reddit ?? []), ...(payload.twitter ?? [])];
    const mapped = incoming.map((item, index) => ({
      title: String((item as any)?.title || (item as any)?.selftext || `Signal ${index + 1}`),
      selftext: String((item as any)?.selftext || (item as any)?.title || "Fresh complaint signal detected."),
      source: "public signal",
      category: "general",
      score: Number((item as any)?.score ?? 7.5),
    }));

    const ideas = await ingestIdeas(mapped);

    return NextResponse.json({
      ok: true,
      query,
      processed: mapped.length,
      saved: ideas.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
