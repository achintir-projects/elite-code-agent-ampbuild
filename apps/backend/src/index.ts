import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { WebSocketServer, type WebSocket } from 'ws';
import { Orchestrator, ModelRouterImpl, EchoProvider, OpenAICompatProvider } from '@elite/core-agent';
import { scaffold } from './services/prototyper.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

const modelRouter = new ModelRouterImpl();

// Register multiple providers if present: prioritize Z.AI glm-4.5, then OpenAI, DeepSeek, Ollama
const providers: Array<{ base?: string; key?: string; model?: string; label: 'zai' | 'openai' | 'deepseek' | 'ollama' }> = [
  { base: process.env.ZAI_BASE_URL, key: process.env.ZAI_API_KEY, model: process.env.ZAI_MODEL, label: 'zai' },
  { base: process.env.OPENAI_BASE_URL, key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, label: 'openai' },
  { base: process.env.DEEPSEEK_BASE_URL, key: process.env.DEEPSEEK_API_KEY, model: process.env.DEEPSEEK_MODEL, label: 'deepseek' },
  { base: process.env.OLLAMA_BASE_URL, key: process.env.OLLAMA_API_KEY, model: process.env.OLLAMA_MODEL, label: 'ollama' },
];

for (const p of providers) {
  if (p.base) {
    const defaultModel = p.model || (p.label === 'zai' ? 'glm-4.5' : p.label === 'deepseek' ? 'deepseek-chat' : p.label === 'openai' ? 'gpt-4o-mini' : 'deepseek-coder');
    modelRouter.register(new OpenAICompatProvider({ baseURL: p.base, apiKey: p.key, model: defaultModel }));
    console.log(`Model provider registered: ${p.label}`, { base: p.base, model: defaultModel });
  }
}
if ((providers.filter((p) => !!p.base).length) === 0) {
  modelRouter.register(new EchoProvider());
  console.log('Model provider: Echo (dev)');
}

const orchestrator = new Orchestrator({
  modelRouter,
  toolbelt: { async invoke(tool: string, args: Record<string, unknown>) { return { ok: true, stdout: `tool ${tool} ran`, stderr: '' }; } },
});

app.post('/api/agent/run', async (req: Request, res: Response) => {
  const { goal, cwd } = req.body || {};
  if (!goal || !cwd) return res.status(400).json({ error: 'goal and cwd are required' });

  // Rapid prototyping path
  const dest = await scaffold(goal, cwd)
  if (dest) return res.json({ success: true, artifacts: [dest], report: `Scaffolded to ${dest}` })

  // Full orchestrator path
  const result = await orchestrator.run({ goal, cwd });
  res.json(result);
});

const server = app.listen(process.env.PORT || 8787, () => console.log('backend listening'));

const wss = new WebSocketServer({ server });
wss.on('connection', (ws: WebSocket) => {
  ws.send(JSON.stringify({ type: 'hello', t: Date.now() }));
});
