import { createClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function getActiveOrgId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('user_id', userId)
    .limit(1)
    .single();
  if (error || !data) throw new Error('No org membership found');
  return data.org_id;
}
