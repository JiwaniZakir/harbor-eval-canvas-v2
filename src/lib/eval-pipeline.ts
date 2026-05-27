/* ================================================================
   Eval Pipeline - Client-side orchestrator
   Drives the full eval creation flow: probe -> scaffold -> validate
   Communicates with API routes and updates Zustand stores
   ================================================================ */

import { useAgentStore } from '@/lib/stores/agent-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { DOMAIN_META } from '@/lib/types';
import type { DomainId, ProbeSummary, Artifact } from '@/lib/types';
import { uid } from '@/lib/utils';

// --- Chat Streaming ---

export async function sendChatMessage(
  userMessage: string,
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void
) {
  const messages = useAgentStore.getState().messages;
  const project = useProjectStore.getState().project;
  const focusedDomain = useUIStore.getState().focusedDomainId;

  const msgHistory = messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Add the new user message
  msgHistory.push({ role: 'user', content: userMessage });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: msgHistory,
        context: {
          projectName: project?.name,
          targetModel: project?.targetModel?.modelName,
          focusedDomain: focusedDomain,
          globalState: useUIStore.getState().globalState,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      onError(err.error || 'Chat request failed');
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError('No response stream');
      return;
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onDone(fullText);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              onChunk(fullText);
            }
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }

    onDone(fullText);
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Network error');
  }
}

// --- Hypothesis Generation ---

export async function generateHypothesis(
  projectName: string,
  targetModel: string,
  workflow: string,
  failureModes: string[],
  answers: Record<number, string>
): Promise<{
  hypothesis: string;
  taxonomy: string;
  badHeuristic: string;
  authorityInvariant: string;
  suggestedDomains: string[];
}> {
  const res = await fetch('/api/generate-hypothesis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, targetModel, workflow, failureModes, answers }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to generate hypothesis');
  }

  return res.json();
}

// --- Domain Probe ---

export async function runDomainProbe(domainId: DomainId): Promise<void> {
  const { setDomainStatus, setProbeSummary } = useDomainStore.getState();
  const { addMessage, setStreaming } = useAgentStore.getState();
  const { setActiveTab } = useUIStore.getState();
  const project = useProjectStore.getState().project;
  const { addToast } = useToastStore.getState();

  if (!project) return;

  const meta = DOMAIN_META[domainId];

  // Switch to agent tab to show progress
  setActiveTab('agent');

  // Update status
  setDomainStatus(domainId, 'probing');
  setStreaming(true);

  addMessage({
    id: uid(),
    role: 'assistant',
    content: `Starting probe for **${meta.label}** domain...\n\nGenerating 5 probe variants to test ${project.targetModel.modelName}'s weaknesses in this area.`,
    timestamp: Date.now(),
  });

  try {
    const res = await fetch('/api/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainId,
        domainLabel: meta.label,
        targetModel: project.targetModel.modelName,
        projectName: project.name,
        workflow: project.workflowDescription || '',
        hypothesis: '',
      }),
    });

    if (!res.ok) {
      throw new Error('Probe generation failed');
    }

    const result = await res.json();

    // Map to our ProbeSummary type
    const probeSummary: ProbeSummary = {
      weaknessTitle: result.weaknessTitle || `${meta.label} weakness`,
      variants: (result.variants || []).map((v: { name: string; estimatedFailureRate: number }) => ({
        name: v.name,
        failureRate: v.estimatedFailureRate,
        status: 'complete' as const,
      })),
      aggregateFailureRate: result.aggregateFailureRate,
      verdict: result.verdict,
      label: result.weaknessTitle,
    };

    setProbeSummary(domainId, probeSummary);
    setDomainStatus(domainId, 'probe_complete');

    // Add result message
    const verdictEmoji = result.verdict === 'promote' ? '🔴' : result.verdict === 'redesign' ? '🟡' : '🟢';
    addMessage({
      id: uid(),
      role: 'assistant',
      content: `**Probe complete for ${meta.label}** ${verdictEmoji}\n\n**Weakness:** ${result.weaknessTitle}\n**Aggregate failure rate:** ${(result.aggregateFailureRate * 100).toFixed(1)}%\n**Verdict:** ${result.verdict}\n\n${result.summary || ''}\n\nVariants tested:\n${probeSummary.variants.map((v) => `- **${v.name}**: ${(v.failureRate * 100).toFixed(0)}% failure`).join('\n')}`,
      timestamp: Date.now(),
    });

    addToast(`Probe complete: ${meta.label}`, result.verdict === 'promote' ? 'success' : 'info');

    // Auto-promote if verdict is promote
    if (result.verdict === 'promote') {
      setTimeout(() => {
        setDomainStatus(domainId, 'promoted');
        addMessage({
          id: uid(),
          role: 'assistant',
          content: `**${meta.label}** promoted for scaffolding. Click the domain node or type "scaffold ${meta.shortLabel}" to generate evaluation artifacts.`,
          timestamp: Date.now(),
        });
      }, 1000);
    }
  } catch (err) {
    setDomainStatus(domainId, 'probe_complete');
    addMessage({
      id: uid(),
      role: 'assistant',
      content: `Probe for ${meta.label} encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. The domain has been marked for review.`,
      timestamp: Date.now(),
    });
    addToast(`Probe failed: ${meta.label}`, 'error');
  } finally {
    setStreaming(false);
  }
}

// --- Domain Scaffold ---

export async function runDomainScaffold(domainId: DomainId): Promise<void> {
  const { setDomainStatus, setScaffoldAgents, addArtifact, domainStates } = useDomainStore.getState();
  const { addMessage, setStreaming } = useAgentStore.getState();
  const project = useProjectStore.getState().project;
  const { addToast } = useToastStore.getState();

  if (!project) return;

  const meta = DOMAIN_META[domainId];
  const domainState = domainStates[domainId];
  const probeSummary = domainState.probeSummary;

  if (!probeSummary) {
    addToast('No probe results found. Run a probe first.', 'warning');
    return;
  }

  setDomainStatus(domainId, 'scaffolding');
  setStreaming(true);

  addMessage({
    id: uid(),
    role: 'assistant',
    content: `Starting scaffold for **${meta.label}**...\n\nGenerating evaluation artifacts: Fixtures, Environment, Verifier, Instructions, Contamination Check.`,
    timestamp: Date.now(),
  });

  try {
    const res = await fetch('/api/scaffold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainId,
        domainLabel: meta.label,
        targetModel: project.targetModel.modelName,
        probeSummary: {
          weaknessTitle: probeSummary.weaknessTitle,
          aggregateFailureRate: probeSummary.aggregateFailureRate ?? 0,
          verdict: probeSummary.verdict ?? 'promote',
        },
      }),
    });

    if (!res.ok) throw new Error('Scaffold generation failed');

    const result = await res.json();

    // Create scaffold agents
    const agents = (result.artifacts || []).map((a: { agent: string; filename: string }) => ({
      name: a.agent,
      artifactLabel: a.filename,
      status: 'complete' as const,
    }));
    setScaffoldAgents(domainId, agents);

    // Create artifact entries
    for (const artifact of result.artifacts || []) {
      const ext = artifact.filename.split('.').pop() || 'txt';
      addArtifact(domainId, {
        id: uid(),
        name: artifact.filename,
        type: ext as Artifact['type'],
        size: new TextEncoder().encode(artifact.content).length,
        domainId,
        createdAt: Date.now(),
        content: artifact.content,
      });
    }

    setDomainStatus(domainId, 'scaffold_complete');

    addMessage({
      id: uid(),
      role: 'assistant',
      content: `**Scaffold complete for ${meta.label}** ✅\n\n${(result.artifacts || []).length} artifacts generated:\n${(result.artifacts || []).map((a: { agent: string; filename: string; description: string }) => `- **${a.agent}**: \`${a.filename}\` - ${a.description}`).join('\n')}\n\n${result.summary || ''}\n\nReady for validation. Click the domain or type "validate ${meta.shortLabel}".`,
      timestamp: Date.now(),
    });

    addToast(`Scaffold complete: ${meta.label}`, 'success');
  } catch (err) {
    setDomainStatus(domainId, 'scaffold_complete');
    addMessage({
      id: uid(),
      role: 'assistant',
      content: `Scaffold for ${meta.label} failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      timestamp: Date.now(),
    });
    addToast(`Scaffold failed: ${meta.label}`, 'error');
  } finally {
    setStreaming(false);
  }
}

// --- Domain Validation ---

export async function runDomainValidation(domainId: DomainId): Promise<void> {
  const { setDomainStatus, setValidationGates, setSweepSummary, domainStates, setDomainProgress } = useDomainStore.getState();
  const { addMessage, setStreaming } = useAgentStore.getState();
  const project = useProjectStore.getState().project;
  const { addToast } = useToastStore.getState();

  if (!project) return;

  const meta = DOMAIN_META[domainId];
  const domainState = domainStates[domainId];
  const probeSummary = domainState.probeSummary;

  if (!probeSummary) {
    addToast('No probe results found. Run a probe first.', 'warning');
    return;
  }

  setDomainStatus(domainId, 'validation_gate');
  setStreaming(true);

  addMessage({
    id: uid(),
    role: 'assistant',
    content: `Running validation gates for **${meta.label}**...\n\n- Oracle Sweep\n- Nop Sweep\n- Spoiler Lint`,
    timestamp: Date.now(),
  });

  try {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainId,
        domainLabel: meta.label,
        targetModel: project.targetModel.modelName,
        artifactCount: domainState.artifacts.length,
        probeSummary: {
          weaknessTitle: probeSummary.weaknessTitle,
          aggregateFailureRate: probeSummary.aggregateFailureRate ?? 0,
        },
      }),
    });

    if (!res.ok) throw new Error('Validation failed');

    const result = await res.json();

    // Set validation gates
    const gates = (result.gates || []).map((g: { name: string; type: string; passed: boolean }) => ({
      name: g.name,
      type: g.type as 'oracle' | 'nop' | 'spoiler',
      status: g.passed ? 'passed' as const : 'failed' as const,
    }));
    setValidationGates(domainId, gates);

    // Set sweep results
    if (result.sweepResult) {
      setSweepSummary(domainId, {
        taskSlug: `${domainId}_eval`,
        passAt3: result.sweepResult.passAt3,
        trials: result.sweepResult.trials || [],
      });
    }

    // Determine final status
    if (result.allPassed) {
      setDomainStatus(domainId, 'gate_passed');
      setDomainProgress(domainId, 100);

      setTimeout(() => {
        setDomainStatus(domainId, 'published');
        addMessage({
          id: uid(),
          role: 'assistant',
          content: `**${meta.label} evaluation published!** 🎉\n\nAll validation gates passed. The evaluation is ready for use.\n\n**pass@3:** ${(result.sweepResult?.passAt3 * 100 || 0).toFixed(0)}%`,
          timestamp: Date.now(),
        });
        addToast(`${meta.label} evaluation published!`, 'success');

        // Update global progress
        updateGlobalProgress();
      }, 1500);
    } else {
      setDomainStatus(domainId, 'gate_failed');
      addMessage({
        id: uid(),
        role: 'assistant',
        content: `**Validation issues for ${meta.label}** ⚠️\n\n${(result.gates || []).map((g: { name: string; passed: boolean; details: string }) => `- **${g.name}**: ${g.passed ? '✅ Passed' : '❌ Failed'} - ${g.details}`).join('\n')}\n\n${result.summary || ''}`,
        timestamp: Date.now(),
      });
      addToast(`Validation issues: ${meta.label}`, 'warning');
    }
  } catch (err) {
    setDomainStatus(domainId, 'gate_failed');
    addMessage({
      id: uid(),
      role: 'assistant',
      content: `Validation for ${meta.label} failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      timestamp: Date.now(),
    });
    addToast(`Validation failed: ${meta.label}`, 'error');
  } finally {
    setStreaming(false);
  }
}

// --- Helper: Update Global Progress ---

function updateGlobalProgress() {
  const { domainStates } = useDomainStore.getState();
  const { updateProgress } = useProjectStore.getState();

  const domains = Object.values(domainStates);
  const completedCount = domains.filter(
    (d) => d.status === 'published' || d.status === 'gate_passed'
  ).length;

  const progress = Math.round((completedCount / domains.length) * 100);
  updateProgress(progress);
}

// --- Auto Pipeline: Run full pipeline for a domain ---

export async function runFullPipeline(domainId: DomainId): Promise<void> {
  await runDomainProbe(domainId);

  // Wait a beat then scaffold
  await new Promise((r) => setTimeout(r, 2000));

  const state = useDomainStore.getState().domainStates[domainId];
  if (state.status === 'promoted' || state.status === 'probe_complete') {
    await runDomainScaffold(domainId);

    // Wait a beat then validate
    await new Promise((r) => setTimeout(r, 2000));

    const state2 = useDomainStore.getState().domainStates[domainId];
    if (state2.status === 'scaffold_complete') {
      await runDomainValidation(domainId);
    }
  }
}
