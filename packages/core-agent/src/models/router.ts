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
    if (this.providers.length === 0) throw new Error('No completion providers registered');
    const errors: string[] = [];
    for (const p of this.providers) {
      try {
        return await p.complete(role, prompt, opts);
      } catch (e: any) {
        errors.push(`${p.name}: ${e?.message || e}`);
      }
    }
    throw new Error(`All providers failed: ${errors.join(' | ')}`);
  }
}

export class EchoProvider implements CompletionProvider {
  name = 'echo-dev';
  async complete(): Promise<string> {
    // Minimal offline-friendly provider; replace with real LLMs via HTTP/ollama
    return 'Plan: Analyze -> Scaffold -> Build -> Test -> Package -> Report';
  }
}
