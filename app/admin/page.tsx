import { AdminAuthGate } from "@/components/admin-auth-gate";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return <AdminAuthGate user={user} />;
}
