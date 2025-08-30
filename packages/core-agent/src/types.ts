export type ToolInvocation = {
  tool: string;
  args: Record<string, unknown>;
};

export type ToolResult = {
  ok: boolean;
  stdout?: string;
  stderr?: string;
  artifacts?: Record<string, string>; // path -> description
};

export type AgentMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface AgentContext {
  cwd: string;
  repoSummary?: string;
  memory: {
    task: Record<string, unknown>;
    repo: Record<string, unknown>;
    tool: Record<string, unknown>;
  };
  determinism: {
    temperature: number;
    toolCap: number;
    seed: number;
  };
}

export interface PlanStep {
  id: string;
  title: string;
  description?: string;
  patches?: string; // unified diff
  tools?: ToolInvocation[];
}

export interface RunResult {
  success: boolean;
  artifacts: string[];
  report: string;
}
