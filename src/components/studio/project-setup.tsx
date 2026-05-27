'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, Check, Bot, ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAgentStore } from '@/lib/stores/agent-store';
import { MODEL_OPTIONS, FAILURE_MODES, ALL_DOMAIN_IDS } from '@/lib/types';
import type { TargetModel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { uid } from '@/lib/utils';

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

  const setupWizardOpen = useUIStore((s) => s.setupWizardOpen);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setGlobalState = useUIStore((s) => s.setGlobalState);
  const setProject = useProjectStore((s) => s.setProject);
  const initializeDomains = useDomainStore((s) => s.initializeDomains);
  const setDomainStatus = useDomainStore((s) => s.setDomainStatus);
  const addMessage = useAgentStore((s) => s.addMessage);

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
      role: 'system',
      content: `Project "${name}" created. Targeting ${model.modelName}. Starting evaluation with ${ALL_DOMAIN_IDS[0].replace(/_/g, ' ')}.`,
      timestamp: Date.now(),
    });

    // Close wizard with fade
    setClosing(true);
    setTimeout(() => {
      setSetupWizardOpen(false);
      setGlobalState('canvas_idle');
      setClosing(false);
    }, 400);
  }, [name, model, workflow, setProject, initializeDomains, setDomainStatus, addMessage, setSetupWizardOpen, setGlobalState]);

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

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
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
              <div className="wizard-shimmer" />
              <Badge variant="accent">AI-Generated Taxonomy</Badge>
              <p className="wizard-hypothesis-text">
                Based on your workflow involving {name || 'this model'}, we hypothesize
                that {model?.modelName || 'the target model'} may exhibit weaknesses in
                instruction following under ambiguous authority chains and safety boundary
                edge cases.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                <Badge variant="warning">Bad Heuristic</Badge>
                <Badge variant="error">Authority Invariant</Badge>
              </div>
              <Button variant="primary" size="lg" full onClick={handleComplete}>
                Accept & Start Probing <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
