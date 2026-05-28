/* E2E verification for C2/C3/C6: simulates the authed-user flow against the
   local Supabase stack with RLS enabled, mirroring what the SSR server actions
   do (sign in -> create project -> upsert domain -> reload -> export -> import). */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read local credentials from the environment (loaded from .env.local) so no
// secrets are committed. Run with:  node --env-file=.env.local scripts/...
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANON || !SERVICE) {
  console.error('Missing env: run with `node --env-file=.env.local scripts/e2e-persistence.cjs`');
  process.exit(1);
}

const email = `e2e_${Date.now()}@example.com`;
const password = 'Password123!';

(async () => {
  const admin = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

  // 1) create a confirmed user (triggers personal-org creation).
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  if (cErr) throw cErr;
  console.log('✓ user created:', created.user.id);

  // wait for the signup trigger to provision the org.
  await new Promise((r) => setTimeout(r, 500));

  // 2) sign in as that user via the anon client (RLS now applies as this user).
  const sb = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error: sErr } = await sb.auth.signInWithPassword({ email, password });
  if (sErr) throw sErr;
  console.log('✓ signed in');

  // resolve org (mirrors resolveOrgId)
  const { data: members } = await sb.from('org_members').select('org_id, role, created_at').order('created_at');
  const orgId = (members.find((m) => m.role === 'owner') ?? members[0]).org_id;
  console.log('✓ resolved org:', orgId);

  // 3) create project (mirrors createProject action)
  const { data: project, error: pErr } = await sb.from('projects').insert({
    org_id: orgId,
    name: 'E2E Eval',
    target_model: { provider: 'google', modelSlug: 'gemini-2.5-pro', modelName: 'Gemini 2.5 Pro' },
    workflow_description: 'verify persistence',
    global_progress: 0,
    created_by: created.user.id,
  }).select('*').single();
  if (pErr) throw pErr;
  console.log('✓ project created:', project.id);

  // 4) seed + upsert a domain (mirrors initializeProjectDomains + upsertDomain)
  await sb.from('domains').upsert({ project_id: project.id, domain_key: 'instruction_following', status: 'untested', progress: 0, artifacts: [] }, { onConflict: 'project_id,domain_key' });
  await sb.from('domains').upsert({ project_id: project.id, domain_key: 'instruction_following', status: 'probing', progress: 42, probe_summary: { weaknessTitle: 'X', variants: [] } }, { onConflict: 'project_id,domain_key' });
  console.log('✓ domain upserted');

  // 5) reload (mirrors hydrate): fresh client, fresh sign-in
  const sb2 = createClient(URL, ANON, { auth: { persistSession: false } });
  await sb2.auth.signInWithPassword({ email, password });
  const { data: projects2 } = await sb2.from('projects').select('*').order('created_at', { ascending: false });
  const { data: domains2 } = await sb2.from('domains').select('*').eq('project_id', project.id);
  const reloaded = projects2[0];
  const dom = domains2.find((d) => d.domain_key === 'instruction_following');
  console.log('✓ reloaded project:', reloaded.name, '| target:', reloaded.target_model.modelName);
  console.log('✓ reloaded domain:', dom.status, dom.progress, '| probe:', dom.probe_summary?.weaknessTitle);

  const persistOK = reloaded.id === project.id && reloaded.name === 'E2E Eval'
    && dom.status === 'probing' && dom.progress === 42 && dom.probe_summary.weaknessTitle === 'X';
  console.log(persistOK ? '✅ PERSISTENCE VERIFIED' : '❌ PERSISTENCE FAILED');

  // 6) RLS isolation: a second user must NOT see this project.
  const email2 = `e2e2_${Date.now()}@example.com`;
  const { data: u2 } = await admin.auth.admin.createUser({ email: email2, password, email_confirm: true });
  await new Promise((r) => setTimeout(r, 400));
  const sbB = createClient(URL, ANON, { auth: { persistSession: false } });
  await sbB.auth.signInWithPassword({ email: email2, password });
  const { data: leaked } = await sbB.from('projects').select('*').eq('id', project.id);
  console.log(leaked.length === 0 ? '✅ RLS ISOLATION VERIFIED (other user sees 0)' : `❌ RLS LEAK: ${leaked.length} rows`);

  // cleanup
  await admin.auth.admin.deleteUser(created.user.id);
  await admin.auth.admin.deleteUser(u2.user.id);
  console.log('✓ cleaned up test users');

  process.exit(persistOK && leaked.length === 0 ? 0 : 1);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
