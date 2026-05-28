/* E2E for C6 export/import round-trip: create a project tree, export it to the
   versioned JSON shape, then import it back and confirm a full deep copy. */
const { createClient } = require('@supabase/supabase-js');

// Credentials come from the environment (no secrets committed). Run with:
//   node --env-file=.env.local scripts/e2e-export-import.cjs
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANON || !SERVICE) {
  console.error('Missing env: run with `node --env-file=.env.local scripts/e2e-export-import.cjs`');
  process.exit(1);
}
const password = 'Password123!';
const email = `e2eio_${Date.now()}@example.com`;

(async () => {
  const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
  const { data: u } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  await new Promise((r) => setTimeout(r, 500));
  const sb = createClient(URL, ANON, { auth: { persistSession: false } });
  await sb.auth.signInWithPassword({ email, password });
  const { data: members } = await sb.from('org_members').select('org_id, role').order('created_at');
  const orgId = (members.find((m) => m.role === 'owner') ?? members[0]).org_id;

  // Build a project tree.
  const { data: project } = await sb.from('projects').insert({
    org_id: orgId, name: 'IO Source', target_model: { provider: 'openai', modelSlug: 'gpt-4.1', modelName: 'GPT-4.1' },
    workflow_description: 'io test', global_progress: 33, created_by: u.user.id,
  }).select('*').single();
  const { data: dom } = await sb.from('domains').insert({
    project_id: project.id, domain_key: 'reasoning_logic', status: 'gate_passed', progress: 100,
    artifacts: [{ id: 'a1', name: 'x.json', type: 'json', size: 10, domainId: 'reasoning_logic', createdAt: 1 }],
    probe_summary: { weaknessTitle: 'W', variants: [] },
  }).select('*').single();
  const { data: ds } = await sb.from('datasets').insert({ project_id: project.id, name: 'set-1' }).select('*').single();
  await sb.from('dataset_cases').insert({ dataset_id: ds.id, input: 'q', expected: 'a', metadata: { k: 1 } });
  const { data: run } = await sb.from('runs').insert({
    project_id: project.id, domain_id: dom.id, dataset_id: ds.id, model: 'gpt-4.1', status: 'done', is_baseline: true, summary: { score: 0.9 },
  }).select('*').single();
  await sb.from('run_cases').insert({ run_id: run.id, input: 'q', response: 'r', score: 0.9, passed: true, latency_ms: 100, cost_usd: 0.001, scorer_rationale: 'ok' });
  console.log('✓ source tree built');

  // EXPORT (mirror exportProject)
  const [domR, dsR, runR] = await Promise.all([
    sb.from('domains').select('*').eq('project_id', project.id),
    sb.from('datasets').select('*').eq('project_id', project.id),
    sb.from('runs').select('*').eq('project_id', project.id),
  ]);
  const dcR = await sb.from('dataset_cases').select('*').in('dataset_id', dsR.data.map((d) => d.id));
  const rcR = await sb.from('run_cases').select('*').in('run_id', runR.data.map((r) => r.id));
  const idToKey = new Map(domR.data.map((d) => [d.id, d.domain_key]));
  const doc = {
    version: 1, exportedAt: new Date().toISOString(),
    project: { name: project.name, description: null, targetModel: project.target_model, workflowDescription: project.workflow_description, globalProgress: project.global_progress },
    domains: domR.data.map((d) => ({ domainKey: d.domain_key, status: d.status, progress: d.progress, artifacts: d.artifacts, probeSummary: d.probe_summary, scaffoldAgents: d.scaffold_agents, validationGates: d.validation_gates, sweepSummary: d.sweep_summary })),
    datasets: dsR.data.map((d) => ({ refId: d.id, name: d.name, cases: dcR.data.filter((c) => c.dataset_id === d.id).map((c) => ({ input: c.input, expected: c.expected, metadata: c.metadata })) })),
    runs: runR.data.map((r) => ({ domainKey: r.domain_id ? idToKey.get(r.domain_id) : null, datasetRefId: r.dataset_id, model: r.model, status: r.status, isBaseline: r.is_baseline, summary: r.summary, cases: rcR.data.filter((c) => c.run_id === r.id).map((c) => ({ input: c.input, response: c.response, score: c.score, passed: c.passed, latencyMs: c.latency_ms, costUsd: c.cost_usd, scorerRationale: c.scorer_rationale })) })),
  };
  console.log('✓ exported doc v' + doc.version, '| domains', doc.domains.length, '| datasets', doc.datasets.length, '| runs', doc.runs.length);

  // IMPORT (mirror importProject)
  const { data: np } = await sb.from('projects').insert({ org_id: orgId, name: doc.project.name + ' (copy)', target_model: doc.project.targetModel, workflow_description: doc.project.workflowDescription, global_progress: doc.project.globalProgress, created_by: u.user.id }).select('id').single();
  const keyToId = new Map();
  if (doc.domains.length) {
    const { data: nd } = await sb.from('domains').insert(doc.domains.map((d) => ({ project_id: np.id, domain_key: d.domainKey, status: d.status, progress: d.progress, artifacts: d.artifacts, probe_summary: d.probeSummary, scaffold_agents: d.scaffoldAgents, validation_gates: d.validationGates, sweep_summary: d.sweepSummary }))).select('id, domain_key');
    nd.forEach((d) => keyToId.set(d.domain_key, d.id));
  }
  const dsRefToId = new Map();
  for (const d of doc.datasets) {
    const { data: ndd } = await sb.from('datasets').insert({ project_id: np.id, name: d.name }).select('id').single();
    dsRefToId.set(d.refId, ndd.id);
    if (d.cases.length) await sb.from('dataset_cases').insert(d.cases.map((c) => ({ dataset_id: ndd.id, input: c.input, expected: c.expected, metadata: c.metadata })));
  }
  for (const r of doc.runs) {
    const { data: nr } = await sb.from('runs').insert({ project_id: np.id, domain_id: r.domainKey ? keyToId.get(r.domainKey) : null, dataset_id: r.datasetRefId ? dsRefToId.get(r.datasetRefId) : null, model: r.model, status: r.status, is_baseline: r.isBaseline, summary: r.summary, created_by: u.user.id }).select('id').single();
    if (r.cases.length) await sb.from('run_cases').insert(r.cases.map((c) => ({ run_id: nr.id, input: c.input, response: c.response, score: c.score, passed: c.passed, latency_ms: c.latencyMs, cost_usd: c.costUsd, scorer_rationale: c.scorerRationale })));
  }
  console.log('✓ imported as new project', np.id);

  // VERIFY deep copy
  const v = await Promise.all([
    sb.from('projects').select('*').eq('id', np.id).single(),
    sb.from('domains').select('*').eq('project_id', np.id),
    sb.from('datasets').select('*').eq('project_id', np.id),
    sb.from('runs').select('*').eq('project_id', np.id),
  ]);
  const [vp, vd, vds, vr] = v;
  const vdc = await sb.from('dataset_cases').select('*').in('dataset_id', vds.data.map((x) => x.id));
  const vrc = await sb.from('run_cases').select('*').in('run_id', vr.data.map((x) => x.id));
  const ok = vp.data.name === 'IO Source (copy)' && vp.data.target_model.modelSlug === 'gpt-4.1'
    && vd.data.length === 1 && vd.data[0].status === 'gate_passed' && vd.data[0].artifacts.length === 1
    && vds.data.length === 1 && vdc.data.length === 1 && vdc.data[0].input === 'q'
    && vr.data.length === 1 && vr.data[0].is_baseline === true && vr.data[0].domain_id === vd.data[0].id
    && vrc.data.length === 1 && vrc.data[0].score === 0.9;
  console.log(ok ? '✅ EXPORT/IMPORT ROUND-TRIP VERIFIED' : '❌ ROUND-TRIP MISMATCH');

  await admin.auth.admin.deleteUser(u.user.id);
  console.log('✓ cleaned up');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
