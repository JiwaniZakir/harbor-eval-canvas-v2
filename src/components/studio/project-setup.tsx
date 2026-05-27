'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, Check, Bot, ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAgentStore } from '@/lib/stores/agent-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { MODEL_OPTIONS, FAILURE_MODES, ALL_DOMAIN_IDS } from '@/lib/types';
import type { TargetModel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { uid } from '@/lib/utils';
import { generateHypothesis } from '@/lib/eval-pipeline';

const QUESTIONS = [
  {
    text: 'What is the primary use case for this model?',
    options: ['Customer support', 'Code generation', 'Research assistant', 'Content creation'],
  },
  {
    text: 'How critical are factual accuracy failures?',
    options: ['Critical - production system', 'Important - user-facing', 'Moderate - internal tool', 'Low - experimental'],
  },
  {
    text: 'What input modalities will be tested?',
    options: ['Text only', 'Text + code', 'Text + images', 'Multi-modal'],
  },
  {
    text: 'Expected conversation length?',
    options: ['Short (< 5 turns)', 'Medium (5-20 turns)', 'Long (20+ turns)', 'Variable'],
  },
  {
    text: 'Are there regulatory or compliance requirements?',
    options: ['Yes - strict', 'Some guidelines', 'Best practices only', 'None'],
  },
];

export function ProjectSetup() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [model, setModel] = useState<TargetModel | null>(null);
  const [workflow, setWorkflow] = useState('');
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [closing, setClosing] = useState(false);
  const [hypothesis, setHypothesis] = useState<{
    hypothesis: string;
    taxonomy: string;
    badHeuristic: string;
    authorityInvariant: string;
    suggestedDomains: string[];
  } | null>(null);
  const [generatingHypothesis, setGeneratingHypothesis] = useState(false);

  const setupWizardOpen = useUIStore((s) => s.setupWizardOpen);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setGlobalState = useUIStore((s) => s.setGlobalState);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const setProject = useProjectStore((s) => s.setProject);
  const initializeDomains = useDomainStore((s) => s.initializeDomains);
  const setDomainStatus = useDomainStore((s) => s.setDomainStatus);
  const addMessage = useAgentStore((s) => s.addMessage);
  const addToast = useToastStore((s) => s.addToast);

  const handleComplete = useCallback(() => {
    if (!model) return;

    // Set project
    setProject({
      name: name || 'Untitled Evaluation',
      targetModel: model,
      workflowDescription: workflow,
      globalProgress: 0,
      createdAt: Date.now(),
    });

    // Initialize domains
    initializeDomains();

    // Set first domain to probe_queued
    setDomainStatus(ALL_DOMAIN_IDS[0], 'probe_queued');

    // Add welcome message
    addMessage({
      id: uid(),
      role: 'assistant',
      content: `**Project "${name}" created** 🎉\n\nTargeting **${model.modelName}** (${model.provider}).\n\n${hypothesis ? `**Hypothesis:** ${hypothesis.hypothesis}\n\n**Taxonomy:** ${hypothesis.taxonomy}\n**Bad Heuristic:** ${hypothesis.badHeuristic}\n**Authority Invariant:** ${hypothesis.authorityInvariant}\n\n` : ''}Click any domain node on the canvas to start probing, or ask me a question about evaluation strategy.`,
      timestamp: Date.now(),
    });

    addToast(`Project "${name}" created`, 'success');

    // Close wizard with fade
    setClosing(true);
    setTimeout(() => {
      setSetupWizardOpen(false);
      setGlobalState('canvas_idle');
      setActiveTab('home');
      setClosing(false);
    }, 400);
  }, [name, model, workflow, hypothesis, setProject, initializeDomains, setDomainStatus, addMessage, setSetupWizardOpen, setGlobalState, setActiveTab, addToast]);

  const canContinue = () => {
    switch (step) {
      case 0: return name.trim().length >= 3;
      case 1: return model !== null;
      case 2: return true;
      case 3: return Object.keys(answers).length >= 3;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = async () => {
    if (step < 4) {
      const next = step + 1;
      setStep(next);

      // When moving to hypothesis step, generate it
      if (next === 4) {
        setGeneratingHypothesis(true);
        try {
          const result = await generateHypothesis(
            name,
            model?.modelName || 'Unknown model',
            workflow,
            Array.from(selectedChips),
            answers
          );
          setHypothesis(result);
        } catch (err) {
          // Fallback hypothesis if API fails
          setHypothesis({
            hypothesis: `Based on the workflow involving ${name || 'this model'}, we hypothesize that ${model?.modelName || 'the target model'} may exhibit weaknesses in instruction following under ambiguous authority chains and safety boundary edge cases.`,
            taxonomy: 'Authority Ambiguity',
            badHeuristic: 'The model relies on surface-level instruction parsing without resolving conflicting authority signals.',
            authorityInvariant: 'The model should maintain consistent behavior regardless of instruction framing or authority source.',
            suggestedDomains: ['instruction_following', 'safety_alignment', 'reasoning_logic'],
          });
        } finally {
          setGeneratingHypothesis(false);
        }
      }
    }
  };

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
    if (!workflow.includes(chip)) {
      setWorkflow((prev) => (prev ? `${prev}, ${chip}` : chip));
    }
  };

  const decideAll = () => {
    const allAnswers: Record<number, string> = {};
    QUESTIONS.forEach((q, i) => {
      allAnswers[i] = q.options[0];
    });
    setAnswers(allAnswers);
  };

  if (!setupWizardOpen) return null;

  return (
    <div
      className="wizard-overlay"
      style={{ opacity: closing ? 0 : 1, transition: 'opacity 300ms' }}
    >
      <div className="wizard-card" data-domain="instruction_following">
        <div className="wizard-glow" />

        {/* Step dots */}
        <div className="wizard-dots">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="wizard-dot" data-active={step === i || undefined} />
          ))}
        </div>

        {/* Step content */}
        <div className="wizard-step" key={step}>
          {step === 0 && (
            <>
              <h2 className="wizard-heading">What should we call this evaluation?</h2>
              <p className="wizard-subtext">
                Give your evaluation project a name to get started.
              </p>
              <Input
                inputSize="lg"
                placeholder="e.g., GPT-4.1 Safety Audit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div style={{ marginTop: 24 }}>
                <Button
                  variant="primary"
                  size="lg"
                  full
                  disabled={!canContinue()}
                  onClick={nextStep}
                >
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="wizard-heading">Which model are you evaluating?</h2>
              <p className="wizard-subtext">
                Select the target model for this evaluation run.
              </p>
              <div className="wizard-model-grid">
                {MODEL_OPTIONS.map((m) => (
                  <Card
                    key={m.modelSlug}
                    variant="interactive"
                    selected={model?.modelSlug === m.modelSlug}
                    onClick={() => setModel(m)}
                    className="wizard-model-card"
                  >
                    <div>
                      <div className="model-provider">{m.provider}</div>
                      <div className="model-slug">{m.modelSlug}</div>
                    </div>
                    {model?.modelSlug === m.modelSlug && (
                      <Check size={16} className="model-check" />
                    )}
                  </Card>
                ))}
              </div>
              <Button
                variant="primary"
                size="lg"
                full
                disabled={!canContinue()}
                onClick={nextStep}
              >
                Continue <ArrowRight size={16} />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="wizard-heading">Describe your workflow</h2>
              <p className="wizard-subtext">
                What does this model do? Click failure modes to add them.
              </p>
              <div className="wizard-chips">
                {FAILURE_MODES.map((mode) => (
                  <Badge
                    key={mode}
                    variant="default"
                    interactive
                    selected={selectedChips.has(mode)}
                    onClick={() => toggleChip(mode)}
                  >
                    {mode}
                  </Badge>
                ))}
              </div>
              <Textarea
                placeholder="Describe the model's typical workflow..."
                value={workflow}
                onChange={(e) => setWorkflow(e.target.value)}
                style={{ minHeight: 120 }}
              />
              <div style={{ marginTop: 16 }}>
                <Button variant="primary" size="lg" full onClick={nextStep}>
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="wizard-heading">Clarifying questions</h2>
              <p className="wizard-subtext">
                Help us tailor the evaluation to your needs.
              </p>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {QUESTIONS.map((q, qi) => (
                  <div key={qi} className="wizard-question">
                    <div className="wizard-question-avatar">
                      <Bot size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="wizard-question-bubble">{q.text}</div>
                      <div className="wizard-options">
                        {q.options.map((opt) => (
                          <Card
                            key={opt}
                            variant="interactive"
                            selected={answers[qi] === opt}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [qi]: opt }))
                            }
                            className=""
                          >
                            <span style={{ fontSize: 12, fontFamily: 'var(--font-figtree)' }}>
                              {opt}
                            </span>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Button variant="secondary" size="md" onClick={decideAll}>
                  Decide all
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  full
                  disabled={!canContinue()}
                  onClick={nextStep}
                >
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="wizard-hypothesis">
              <h2 className="wizard-heading">Evaluation hypothesis</h2>

              {generatingHypothesis ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}>
                  <Spinner size="lg" />
                  <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 13, color: 'var(--fg-40)' }}>
                    Generating evaluation hypothesis with AI...
                  </p>
                  <div className="wizard-shimmer" />
                </div>
              ) : hypothesis ? (
                <>
                  <Badge variant="accent">{hypothesis.taxonomy}</Badge>
                  <p className="wizard-hypothesis-text">
                    {hypothesis.hypothesis}
                  </p>
                  <div style={{ marginTop: 12, marginBottom: 12, padding: '12px 16px', background: 'var(--fg-5)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 600, fontSize: 12, color: 'var(--fg-50)', marginBottom: 4 }}>
                      Bad Heuristic
                    </div>
                    <div style={{ fontFamily: 'var(--font-figtree)', fontSize: 13, color: 'var(--fg-70)', marginBottom: 12 }}>
                      {hypothesis.badHeuristic}
                    </div>
                    <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 600, fontSize: 12, color: 'var(--fg-50)', marginBottom: 4 }}>
                      Authority Invariant
                    </div>
                    <div style={{ fontFamily: 'var(--font-figtree)', fontSize: 13, color: 'var(--fg-70)' }}>
                      {hypothesis.authorityInvariant}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                    <Badge variant="warning">Bad Heuristic</Badge>
                    <Badge variant="error">Authority Invariant</Badge>
                  </div>
                  <Button variant="primary" size="lg" full onClick={handleComplete}>
                    Accept & Start Probing <ArrowRight size={16} />
                  </Button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 13, color: 'var(--fg-40)' }}>
                    Could not generate hypothesis. You can still proceed.
                  </p>
                  <Button variant="primary" size="lg" full onClick={handleComplete} style={{ marginTop: 16 }}>
                    Start Probing <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
