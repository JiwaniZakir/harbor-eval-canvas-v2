/* ================================================================
   C6: Shared, serializable types + constants for project export/import.
   Kept out of the `'use server'` action module so they can be imported
   from client components (a server-action file may only export async
   functions).
   ================================================================ */

export const EXPORT_VERSION = 1 as const;

export interface ProjectExport {
  version: number;
  exportedAt: string;
  project: {
    name: string;
    description: string | null;
    targetModel: unknown;
    workflowDescription: string | null;
    globalProgress: number;
  };
  domains: Array<{
    domainKey: string;
    status: string | null;
    progress: number;
    artifacts: unknown;
    probeSummary: unknown;
    scaffoldAgents: unknown;
    validationGates: unknown;
    sweepSummary: unknown;
  }>;
  datasets: Array<{
    refId: string;
    name: string;
    cases: Array<{
      input: string | null;
      expected: string | null;
      metadata: unknown;
    }>;
  }>;
  runs: Array<{
    domainKey: string | null;
    datasetRefId: string | null;
    model: string | null;
    status: string | null;
    isBaseline: boolean;
    summary: unknown;
    cases: Array<{
      input: string | null;
      response: string | null;
      score: number | null;
      passed: boolean | null;
      latencyMs: number | null;
      costUsd: number | null;
      scorerRationale: string | null;
    }>;
  }>;
}
