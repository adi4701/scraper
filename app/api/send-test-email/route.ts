import { NextResponse } from "next/server";

import { createResendClient } from "@/lib/resend";

export async function POST() {
  const resend = createResendClient();
  if (!resend) {
    return NextResponse.json(
      { ok: false, error: "Replace re_xxxxxxxxx in .env.local with your real Resend API key." },
      { status: 503 },
    );
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: "adityarishi322@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
