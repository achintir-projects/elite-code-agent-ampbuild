import { AgentContext, PlanStep, RunResult } from '../types.js';
import { Orchestrator, ModelRouter, Toolbelt } from '../orchestrator.js';
import { writeRunRecord } from '../record/runRecord.js';
import { applyPatch } from '../patch/patchApplier.js';

export async function runLoop(params: {
  request: { goal: string; constraints?: Record<string, unknown>; cwd: string };
  ctx: AgentContext;
  modelRouter: ModelRouter;
  toolbelt: Toolbelt;
}): Promise<RunResult> {
  const { request, ctx, modelRouter, toolbelt } = params;
  const record = {
    startedAt: new Date().toISOString(),
    goal: request.goal,
    steps: [] as any[],
    artifacts: [] as string[],
  };
  try {
    // 1) Plan
    const planText = await modelRouter.complete('planner', `Plan the following goal end-to-end with steps and tools. Goal: ${request.goal}`);
    const steps: PlanStep[] = parsePlan(planText);

    // 2) Execute steps sequentially for v1
    for (const step of steps) {
      const stepEntry: any = { id: step.id, title: step.title, tools: [], patches: !!step.patches };
      if (step.patches) {
        const ok = await applyPatch(request.cwd, step.patches);
        stepEntry.patchesApplied = ok;
      }
      if (step.tools) {
        for (const inv of step.tools) {
          const res = await toolbelt.invoke(inv.tool, inv.args);
          stepEntry.tools.push({ inv, res });
        }
      }
      record.steps.push(stepEntry);
    }

    // 3) Ask tester to summarize results
    const report = await modelRouter.complete('tester', `Given the execution log, determine success and next steps. Log: ${JSON.stringify(record).slice(0, 4000)}`);
    const success = /pass|succeed|all good/i.test(report);

    const result: RunResult = { success, artifacts: record.artifacts, report };
    await writeRunRecord(ctx.cwd, record, result);
    return result;
  } catch (e: any) {
    const result: RunResult = { success: false, artifacts: [], report: `Error: ${e?.message || e}` };
    await writeRunRecord(ctx.cwd, record, result);
    return result;
  }
}

function parsePlan(text: string): PlanStep[] {
  // Minimal, structured as lines: ID: Title | TOOL: {...} | PATCH: diff
  const lines = text.split(/\r?\n/).filter(Boolean);
  const steps: PlanStep[] = [];
  let i = 0;
  for (const line of lines) {
    i++;
    steps.push({ id: `s${i}`, title: line.trim() });
  }
  return steps;
}
