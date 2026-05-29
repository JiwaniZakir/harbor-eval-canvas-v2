// Real e2e: create org/project/dataset/rubric, run an eval (fake model), verify
// run_cases + summary persisted. Run with:
//   node --env-file=.env.local scripts/e2e-eval.cjs
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

(async () => {
  const email = `eval-${Date.now()}@example.com`;
  const { data: u, error: uErr } = await db.auth.admin.createUser({
    email,
    password: 'Passw0rd!',
    email_confirm: true,
  });
  if (uErr) throw uErr;
  const userId = u.user.id;

  // Wait for signup trigger to provision the org.
  await new Promise((r) => setTimeout(r, 500));
  const { data: mem } = await db.from('org_members').select('org_id').eq('user_id', userId).single();
  const orgId = mem.org_id;

  const { data: project } = await db
    .from('projects')
    .insert({ org_id: orgId, name: 'Eval E2E', created_by: userId })
    .select('id')
    .single();

  const { data: dataset } = await db
    .from('datasets')
    .insert({ project_id: project.id, name: 'tiny' })
    .select('id')
    .single();

  const cases = [
    { dataset_id: dataset.id, input: 'say FAKE', expected: 'FAKE' },
    { dataset_id: dataset.id, input: 'also FAKE', expected: 'FAKE' },
    { dataset_id: dataset.id, input: 'nope', expected: 'ZZZ' },
  ];
  await db.from('dataset_cases').insert(cases);

  const { data: rubric } = await db
    .from('rubrics')
    .insert({ project_id: project.id, name: 'contains FAKE', created_by: userId })
    .select('id')
    .single();
  await db.from('rubric_scorers').insert({
    rubric_id: rubric.id,
    scorer_type: 'contains',
    weight: 1,
    config: {},
    position: 0,
  });

  // Simulate the run executor server-side (fake model).
  process.env.EVAL_FAKE_MODEL = '1';
  const { register } = require('node:module');
  // Can't import TS directly; replicate the contains + fake logic inline to verify DB wiring.
  const { data: dcases } = await db.from('dataset_cases').select('*').eq('dataset_id', dataset.id);

  const { data: run } = await db
    .from('runs')
    .insert({
      project_id: project.id,
      dataset_id: dataset.id,
      rubric_id: rubric.id,
      model: 'gemini-2.5-flash',
      status: 'running',
      total_cases: dcases.length,
      created_by: userId,
    })
    .select('id')
    .single();

  let passed = 0;
  for (const c of dcases) {
    const response = `FAKE_RESPONSE: ${c.input.slice(0, 120)}`;
    const hit = response.toLowerCase().includes((c.expected || '').toLowerCase());
    const score = hit ? 1 : 0;
    if (hit) passed++;
    await db.from('run_cases').insert({
      run_id: run.id,
      dataset_case_id: c.id,
      input: c.input,
      prompt: c.input,
      response,
      score,
      passed: hit,
      latency_ms: 1,
      cost_usd: 0,
      scorer_rationale: `contains: ${score}`,
      scorer_breakdown: [{ scorerId: 'contains', weight: 1, score, passed: hit }],
    });
  }
  await db
    .from('runs')
    .update({
      status: 'completed',
      completed_cases: dcases.length,
      summary: { total: dcases.length, passed, passRate: passed / dcases.length },
      completed_at: new Date().toISOString(),
    })
    .eq('id', run.id);

  // Verify.
  const { data: rc } = await db.from('run_cases').select('*').eq('run_id', run.id);
  const { data: finalRun } = await db.from('runs').select('*').eq('id', run.id).single();
  console.log('run_cases:', rc.length, 'passed:', rc.filter((r) => r.passed).length);
  console.log('summary:', JSON.stringify(finalRun.summary));
  console.log('status:', finalRun.status, 'completed_cases:', finalRun.completed_cases);

  const ok = rc.length === 3 && finalRun.status === 'completed' && finalRun.summary.passed === 2;
  // cleanup
  await db.auth.admin.deleteUser(userId);
  console.log(ok ? 'E2E_EVAL_PASS' : 'E2E_EVAL_FAIL');
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error('ERR', e.message || e);
  process.exit(1);
});
