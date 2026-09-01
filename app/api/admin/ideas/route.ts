import { NextResponse } from "next/server";

import {
  addKeyword,
  readStore,
  removeKeyword,
  updateIdeaStatus,
} from "@/lib/demo-store";

export async function GET() {
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
