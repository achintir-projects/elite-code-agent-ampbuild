import { CompletionProvider, CompletionRole } from './router.js';

export class OpenAICompatProvider implements CompletionProvider {
  name = 'openai-compat';
  constructor(private readonly opts: { baseURL: string; apiKey?: string; model?: string }) {}

  async complete(role: CompletionRole, prompt: string, opts?: { temperature?: number }): Promise<string> {
    const url = `${this.opts.baseURL.replace(/\/$/, '')}/v1/chat/completions`;
    const body = {
      model: this.opts.model || 'deepseek-coder',
      temperature: opts?.temperature ?? 0.2,
      messages: [
        { role: 'system', content: `You are the ${role} agent.` },
        { role: 'user', content: prompt }
      ]
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.opts.apiKey ? { Authorization: `Bearer ${this.opts.apiKey}` } : {})
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}: ${await res.text()}`);
    const json: any = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error('LLM response missing content');
    return content as string;
  }
}
