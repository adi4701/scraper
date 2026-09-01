"use client";

import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { AdminDashboard } from "@/components/admin-dashboard";
import { Button } from "@/components/ui/button";
import {
  createSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client";

export function AdminAuthGate({ user }: { user: { email?: string } | null }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [email, setEmail] = useState("admin@painpoint.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  if (user || isDemoMode) {
    return <AdminDashboard />;
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase credentials are not configured yet. Use demo mode to continue.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00E599]/10 text-[#00E599] ring-1 ring-[#00E599]/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">PainPoint AI</p>
            <p className="font-display text-2xl tracking-[-0.06em] text-white">Admin access</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#E0B363]/15 bg-[#E0B363]/8 p-4 text-sm text-[#F4D7A8]">
          <div className="mb-2 flex items-center gap-2 font-medium text-[#E0B363]">
            <LockKeyhole className="h-4 w-4" />
            Secure operator login
          </div>
          {hasSupabaseConfig
            ? "Sign in with your configured Supabase admin account."
            : "Supabase is not configured yet, so this view is running in demo mode until your environment variables are added."}
        </div>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <label className="block text-sm text-white/70">
            <span className="mb-2 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none transition focus:border-[#00E599]/60"
              placeholder="admin@painpoint.ai"
            />
          </label>

          <label className="block text-sm text-white/70">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none transition focus:border-[#00E599]/60"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 bg-[#00E599] text-black hover:bg-[#40f4ba]">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsDemoMode(true)}
            >
              Demo mode
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
