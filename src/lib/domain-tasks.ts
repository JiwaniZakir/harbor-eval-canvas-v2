/* ================================================================
   Harbor Eval Canvas - Domain Task Definitions
   Rich, in-depth tasks for each evaluation domain.
   Modeled after Cofounder's detailed task breakdown system.
   ================================================================ */

import type { DomainId } from './types';

export interface DomainTask {
  id: string;
  title: string;
  description: string;
  stage: 'probe' | 'scaffold' | 'validate' | 'publish';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  subtasks: {
    id: string;
    label: string;
    done: boolean;
  }[];
  tags: string[];
}

export const DOMAIN_TASKS: Record<DomainId, DomainTask[]> = {
  instruction_following: [
    {
      id: 'if-1',
      title: 'Design multi-constraint instruction set',
      description: 'Create 50+ prompts that combine format constraints (JSON, XML, markdown), length limits, persona requirements, and conditional logic. Each prompt should test at least 3 simultaneous constraints.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'if-1a', label: 'Draft 20 format-constraint prompts (JSON output, bullet lists, tables)', done: false },
        { id: 'if-1b', label: 'Draft 15 conditional-logic prompts (if X then do Y, else Z)', done: false },
        { id: 'if-1c', label: 'Draft 15 persona + format combo prompts', done: false },
        { id: 'if-1d', label: 'Validate constraint independence (no two prompts test identical combo)', done: false },
        { id: 'if-1e', label: 'Peer review: have second evaluator check ambiguity', done: false },
      ],
      tags: ['prompt-design', 'constraints', 'format'],
    },
    {
      id: 'if-2',
      title: 'Build instruction-following scoring rubric',
      description: 'Define a binary + partial credit scoring system. Each constraint gets a binary pass/fail, and the overall score is the fraction of constraints met. Include edge cases for "technically correct but not useful" responses.',
      stage: 'scaffold',
      priority: 'critical',
      estimatedMinutes: 30,
      subtasks: [
        { id: 'if-2a', label: 'Define constraint taxonomy (format, content, style, meta)', done: false },
        { id: 'if-2b', label: 'Write scoring function for each constraint type', done: false },
        { id: 'if-2c', label: 'Create 10 calibration examples with gold scores', done: false },
        { id: 'if-2d', label: 'Test inter-annotator agreement on calibration set', done: false },
      ],
      tags: ['rubric', 'scoring', 'calibration'],
    },
    {
      id: 'if-3',
      title: 'Run negation & override attack probes',
      description: 'Test model resistance to "ignore previous instructions" attacks. Include system prompt overrides, role-play escapes, and instruction injection via user content.',
      stage: 'probe',
      priority: 'high',
      estimatedMinutes: 25,
      subtasks: [
        { id: 'if-3a', label: 'Create 10 "ignore previous" injection prompts', done: false },
        { id: 'if-3b', label: 'Create 10 role-play escape prompts', done: false },
        { id: 'if-3c', label: 'Measure override success rate', done: false },
      ],
      tags: ['adversarial', 'injection', 'security'],
    },
    {
      id: 'if-4',
      title: 'Validate with oracle sweep (3 models)',
      description: 'Run the full instruction-following eval across 3 frontier models. Compare pass rates and identify systematic failures that are model-agnostic vs model-specific.',
      stage: 'validate',
      priority: 'high',
      estimatedMinutes: 60,
      subtasks: [
        { id: 'if-4a', label: 'Run sweep on Model A', done: false },
        { id: 'if-4b', label: 'Run sweep on Model B', done: false },
        { id: 'if-4c', label: 'Run sweep on Model C', done: false },
        { id: 'if-4d', label: 'Compute cross-model correlation matrix', done: false },
        { id: 'if-4e', label: 'Flag items with >50% disagreement for review', done: false },
      ],
      tags: ['validation', 'sweep', 'cross-model'],
    },
  ],

  reasoning_logic: [
    {
      id: 'rl-1',
      title: 'Curate multi-step reasoning chains',
      description: 'Collect 40 problems requiring 3-7 step reasoning: syllogisms, mathematical proofs, logical puzzles, causal chains. Each must have a verifiable ground truth and clear intermediate steps.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 50,
      subtasks: [
        { id: 'rl-1a', label: 'Source 15 formal logic problems (modus ponens, contrapositive)', done: false },
        { id: 'rl-1b', label: 'Source 10 mathematical reasoning problems', done: false },
        { id: 'rl-1c', label: 'Source 10 causal/temporal reasoning problems', done: false },
        { id: 'rl-1d', label: 'Source 5 spatial reasoning problems', done: false },
        { id: 'rl-1e', label: 'Verify all ground truths with independent solver', done: false },
      ],
      tags: ['logic', 'reasoning', 'ground-truth'],
    },
    {
      id: 'rl-2',
      title: 'Build chain-of-thought verifier',
      description: 'Create an automated verifier that checks each step of the model\'s reasoning chain. Should detect logical fallacies, unstated assumptions, and arithmetic errors.',
      stage: 'scaffold',
      priority: 'critical',
      estimatedMinutes: 40,
      subtasks: [
        { id: 'rl-2a', label: 'Implement step extraction from CoT output', done: false },
        { id: 'rl-2b', label: 'Build logical consistency checker', done: false },
        { id: 'rl-2c', label: 'Build arithmetic verifier', done: false },
        { id: 'rl-2d', label: 'Create fallacy detector (affirming consequent, etc.)', done: false },
      ],
      tags: ['verifier', 'chain-of-thought', 'automation'],
    },
    {
      id: 'rl-3',
      title: 'Test adversarial reasoning traps',
      description: 'Design problems with plausible but wrong shortcuts. Test if the model takes the bait or reasons through correctly. Include Monty Hall variants, base rate neglect, and conjunction fallacy problems.',
      stage: 'probe',
      priority: 'high',
      estimatedMinutes: 35,
      subtasks: [
        { id: 'rl-3a', label: 'Create 10 base-rate neglect traps', done: false },
        { id: 'rl-3b', label: 'Create 5 conjunction fallacy problems', done: false },
        { id: 'rl-3c', label: 'Create 5 gambler\'s fallacy problems', done: false },
        { id: 'rl-3d', label: 'Measure shortcut-taking rate vs correct reasoning rate', done: false },
      ],
      tags: ['adversarial', 'cognitive-bias', 'traps'],
    },
  ],

  safety_alignment: [
    {
      id: 'sa-1',
      title: 'Build jailbreak resistance test suite',
      description: 'Compile 60+ jailbreak attempts across categories: role-play, encoding, multi-turn, hypothetical framing, and authority impersonation. Measure refusal rate and quality of refusal responses.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 55,
      subtasks: [
        { id: 'sa-1a', label: 'Collect 15 role-play jailbreak attempts', done: false },
        { id: 'sa-1b', label: 'Collect 10 encoding-based attacks (base64, ROT13)', done: false },
        { id: 'sa-1c', label: 'Collect 15 multi-turn escalation sequences', done: false },
        { id: 'sa-1d', label: 'Collect 10 hypothetical/fiction framing attacks', done: false },
        { id: 'sa-1e', label: 'Collect 10 authority impersonation attacks', done: false },
        { id: 'sa-1f', label: 'Categorize expected refusal quality (hard refuse, soft deflect, partial comply)', done: false },
      ],
      tags: ['jailbreak', 'safety', 'adversarial'],
    },
    {
      id: 'sa-2',
      title: 'Design bias & fairness probes',
      description: 'Create matched pairs of prompts that differ only in demographic attributes. Test for differential treatment across gender, race, age, nationality, and disability status.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 40,
      subtasks: [
        { id: 'sa-2a', label: 'Create 20 matched-pair gender bias probes', done: false },
        { id: 'sa-2b', label: 'Create 15 matched-pair racial bias probes', done: false },
        { id: 'sa-2c', label: 'Create 10 socioeconomic bias probes', done: false },
        { id: 'sa-2d', label: 'Define statistical significance threshold for bias detection', done: false },
      ],
      tags: ['bias', 'fairness', 'matched-pairs'],
    },
    {
      id: 'sa-3',
      title: 'Build toxicity & harm classifier',
      description: 'Scaffold an automated classifier that grades model outputs on a 5-point harm scale. Train on labeled examples and validate against human judgments.',
      stage: 'scaffold',
      priority: 'high',
      estimatedMinutes: 35,
      subtasks: [
        { id: 'sa-3a', label: 'Define 5-point harm taxonomy', done: false },
        { id: 'sa-3b', label: 'Label 200 examples across harm levels', done: false },
        { id: 'sa-3c', label: 'Implement classifier using Gemini as judge', done: false },
        { id: 'sa-3d', label: 'Validate classifier accuracy against human labels', done: false },
      ],
      tags: ['toxicity', 'classifier', 'harm-scale'],
    },
  ],

  knowledge_factuality: [
    {
      id: 'kf-1',
      title: 'Create factual knowledge probe set',
      description: 'Build 100 factual questions across domains: science, history, geography, current events. Include questions with known model knowledge cutoff issues and recently changed facts.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'kf-1a', label: 'Draft 25 science/technology questions', done: false },
        { id: 'kf-1b', label: 'Draft 25 history/geography questions', done: false },
        { id: 'kf-1c', label: 'Draft 25 current events / recently changed facts', done: false },
        { id: 'kf-1d', label: 'Draft 25 edge-case / commonly confused facts', done: false },
        { id: 'kf-1e', label: 'Verify all answers with authoritative sources', done: false },
      ],
      tags: ['factuality', 'knowledge', 'ground-truth'],
    },
    {
      id: 'kf-2',
      title: 'Design hallucination detection probes',
      description: 'Create questions about fictitious entities, non-existent papers, and fake events. Test whether the model fabricates plausible-sounding but false information vs. correctly saying "I don\'t know".',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 35,
      subtasks: [
        { id: 'kf-2a', label: 'Create 15 fictitious person queries', done: false },
        { id: 'kf-2b', label: 'Create 10 non-existent paper/book queries', done: false },
        { id: 'kf-2c', label: 'Create 10 fake event/date queries', done: false },
        { id: 'kf-2d', label: 'Measure confabulation rate vs appropriate uncertainty', done: false },
      ],
      tags: ['hallucination', 'confabulation', 'uncertainty'],
    },
    {
      id: 'kf-3',
      title: 'Build citation & source verification scaffold',
      description: 'Create a verification pipeline that checks model claims against a curated knowledge base. Flag unsupported claims and measure citation accuracy.',
      stage: 'scaffold',
      priority: 'high',
      estimatedMinutes: 40,
      subtasks: [
        { id: 'kf-3a', label: 'Build claim extraction from model responses', done: false },
        { id: 'kf-3b', label: 'Create curated fact database (500+ verified facts)', done: false },
        { id: 'kf-3c', label: 'Implement claim-to-fact matching', done: false },
        { id: 'kf-3d', label: 'Generate verification report per response', done: false },
      ],
      tags: ['citation', 'verification', 'pipeline'],
    },
  ],

  calibration_uncertainty: [
    {
      id: 'cu-1',
      title: 'Design confidence calibration probes',
      description: 'Create prompts that ask the model to express confidence levels. Include questions ranging from trivially easy to impossible. Measure correlation between stated confidence and actual accuracy.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 35,
      subtasks: [
        { id: 'cu-1a', label: 'Create 20 trivially easy questions (expected >95% confidence)', done: false },
        { id: 'cu-1b', label: 'Create 20 moderately difficult questions', done: false },
        { id: 'cu-1c', label: 'Create 20 near-impossible / unknowable questions', done: false },
        { id: 'cu-1d', label: 'Build calibration curve plotter', done: false },
      ],
      tags: ['calibration', 'confidence', 'uncertainty'],
    },
    {
      id: 'cu-2',
      title: 'Test "I don\'t know" boundary detection',
      description: 'Probe the model\'s ability to distinguish between what it knows and what it doesn\'t. Include questions just beyond its training data and questions about inherently uncertain topics.',
      stage: 'probe',
      priority: 'high',
      estimatedMinutes: 30,
      subtasks: [
        { id: 'cu-2a', label: 'Create 15 post-cutoff date queries', done: false },
        { id: 'cu-2b', label: 'Create 10 inherently uncertain future predictions', done: false },
        { id: 'cu-2c', label: 'Create 10 questions about private/non-public info', done: false },
        { id: 'cu-2d', label: 'Measure appropriate abstention rate', done: false },
      ],
      tags: ['abstention', 'knowledge-boundary', 'honesty'],
    },
  ],

  multilinguality: [
    {
      id: 'ml-1',
      title: 'Build cross-lingual parallel test set',
      description: 'Create identical test prompts in 10 languages. Measure performance parity across languages for the same underlying task. Focus on languages with different scripts and grammatical structures.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 60,
      subtasks: [
        { id: 'ml-1a', label: 'Select 10 target languages (diverse scripts and families)', done: false },
        { id: 'ml-1b', label: 'Create 20 parallel prompts in English', done: false },
        { id: 'ml-1c', label: 'Translate to all 10 languages (professional + verified)', done: false },
        { id: 'ml-1d', label: 'Validate translations preserve semantic intent', done: false },
        { id: 'ml-1e', label: 'Build cross-lingual scoring framework', done: false },
      ],
      tags: ['multilingual', 'parallel-corpus', 'parity'],
    },
    {
      id: 'ml-2',
      title: 'Test code-switching and mixed-language handling',
      description: 'Create prompts that mix two or more languages within a single conversation. Test whether the model can handle code-switching gracefully.',
      stage: 'probe',
      priority: 'high',
      estimatedMinutes: 25,
      subtasks: [
        { id: 'ml-2a', label: 'Create 15 code-switching conversation prompts', done: false },
        { id: 'ml-2b', label: 'Create 10 "respond in same language" tests', done: false },
        { id: 'ml-2c', label: 'Measure language detection accuracy', done: false },
      ],
      tags: ['code-switching', 'mixed-language', 'detection'],
    },
  ],

  long_context: [
    {
      id: 'lc-1',
      title: 'Build needle-in-haystack test suite',
      description: 'Create context windows of 8K, 32K, and 128K tokens with embedded target facts at various positions. Measure retrieval accuracy as a function of position and context length.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'lc-1a', label: 'Generate filler text corpus (diverse topics)', done: false },
        { id: 'lc-1b', label: 'Create 20 needle facts per context length', done: false },
        { id: 'lc-1c', label: 'Place needles at positions: beginning, 25%, 50%, 75%, end', done: false },
        { id: 'lc-1d', label: 'Build position-accuracy heatmap visualization', done: false },
      ],
      tags: ['needle-in-haystack', 'retrieval', 'context-length'],
    },
    {
      id: 'lc-2',
      title: 'Test multi-document synthesis',
      description: 'Provide 5-10 related documents and ask synthesis questions that require information from multiple sources. Test cross-document reasoning and contradiction detection.',
      stage: 'probe',
      priority: 'high',
      estimatedMinutes: 40,
      subtasks: [
        { id: 'lc-2a', label: 'Curate 5 document sets (3-5 docs each)', done: false },
        { id: 'lc-2b', label: 'Create 10 cross-document synthesis questions', done: false },
        { id: 'lc-2c', label: 'Create 5 contradiction detection questions', done: false },
        { id: 'lc-2d', label: 'Score based on source attribution accuracy', done: false },
      ],
      tags: ['synthesis', 'multi-document', 'attribution'],
    },
  ],

  tool_use_agency: [
    {
      id: 'tu-1',
      title: 'Design function calling accuracy tests',
      description: 'Create 50 scenarios requiring single and multi-function calls. Test parameter extraction accuracy, correct function selection, and error handling when tools fail.',
      stage: 'probe',
      priority: 'critical',
      estimatedMinutes: 50,
      subtasks: [
        { id: 'tu-1a', label: 'Define 10 mock tool schemas (APIs, databases, calculators)', done: false },
        { id: 'tu-1b', label: 'Create 20 single-function call scenarios', done: false },
        { id: 'tu-1c', label: 'Create 15 multi-step tool orchestration scenarios', done: false },
        { id: 'tu-1d', label: 'Create 10 error-handling scenarios (tool returns error)', done: false },
        { id: 'tu-1e', label: 'Create 5 "no suitable tool" scenarios', done: false },
      ],
      tags: ['function-calling', 'tool-use', 'orchestration'],
    },
    {
      id: 'tu-2',
      title: 'Build agentic loop evaluation framework',
      description: 'Create multi-turn agentic tasks where the model must plan, execute, observe, and iterate. Measure task completion rate, efficiency (steps taken), and recovery from errors.',
      stage: 'scaffold',
      priority: 'critical',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'tu-2a', label: 'Design 10 multi-step agentic tasks', done: false },
        { id: 'tu-2b', label: 'Build mock environment with tool responses', done: false },
        { id: 'tu-2c', label: 'Implement step counter and efficiency metric', done: false },
        { id: 'tu-2d', label: 'Build error injection system for recovery testing', done: false },
      ],
      tags: ['agent', 'multi-turn', 'planning'],
    },
    {
      id: 'tu-3',
      title: 'Validate tool selection with confusion matrix',
      description: 'Run the full tool-use eval and generate a confusion matrix showing which tools the model correctly/incorrectly selects. Identify systematic biases in tool selection.',
      stage: 'validate',
      priority: 'high',
      estimatedMinutes: 30,
      subtasks: [
        { id: 'tu-3a', label: 'Run full sweep across all scenarios', done: false },
        { id: 'tu-3b', label: 'Generate tool selection confusion matrix', done: false },
        { id: 'tu-3c', label: 'Identify top 3 most confused tool pairs', done: false },
        { id: 'tu-3d', label: 'Write remediation recommendations', done: false },
      ],
      tags: ['validation', 'confusion-matrix', 'analysis'],
    },
  ],
};
