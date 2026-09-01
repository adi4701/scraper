import { Resend } from "resend";

export function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxx") {
    return null;
  }

  return new Resend(apiKey);
}
