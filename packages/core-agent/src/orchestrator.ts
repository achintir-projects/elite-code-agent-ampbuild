import { PlanStep, RunResult, AgentContext } from './types.js';
import { runLoop } from './runner/loop.js';

export type AgentRequest = {
  goal: string;
  constraints?: Record<string, unknown>;
  cwd: string;
};

export class Orchestrator {
  constructor(private readonly opts: { modelRouter: ModelRouter; toolbelt: Toolbelt }) {}

  async run(req: AgentRequest): Promise<RunResult> {
    const ctx: AgentContext = {
      cwd: req.cwd,
      memory: { task: {}, repo: {}, tool: {} },
      determinism: { temperature: 0.2, toolCap: 200, seed: 42 },
    };
    return runLoop({ request: req, ctx, modelRouter: this.opts.modelRouter, toolbelt: this.opts.toolbelt });
  }
}

export interface Toolbelt {
  invoke(tool: string, args: Record<string, unknown>): Promise<{ ok: boolean; stdout?: string; stderr?: string }>;
}

export interface ModelRouter {
  complete(role: 'planner' | 'coder' | 'tester' | 'reviewer' | 'security' | 'writer', prompt: string, opts?: { temperature?: number }): Promise<string>;
}
