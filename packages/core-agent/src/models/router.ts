export type CompletionRole = 'planner' | 'coder' | 'tester' | 'reviewer' | 'security' | 'writer';

export interface CompletionProvider {
  name: string;
  complete(role: CompletionRole, prompt: string, opts?: { temperature?: number }): Promise<string>;
}

export class ModelRouterImpl {
  private providers: CompletionProvider[] = [];

  register(provider: CompletionProvider) {
    this.providers.push(provider);
  }

  async complete(role: CompletionRole, prompt: string, opts?: { temperature?: number }): Promise<string> {
    // v1: pick first provider; future: heuristics by role/size/cost
    const p = this.providers[0];
    if (!p) throw new Error('No completion providers registered');
    return p.complete(role, prompt, opts);
  }
}

export class EchoProvider implements CompletionProvider {
  name = 'echo-dev';
  async complete(): Promise<string> {
    // Minimal offline-friendly provider; replace with real LLMs via HTTP/ollama
    return 'Plan: Analyze -> Scaffold -> Build -> Test -> Package -> Report';
  }
}
