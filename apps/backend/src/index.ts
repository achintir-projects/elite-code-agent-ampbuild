import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { WebSocketServer, type WebSocket } from 'ws';
import { Orchestrator, ModelRouterImpl, EchoProvider, OpenAICompatProvider } from '@elite/core-agent';
import { scaffold } from './services/prototyper.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

const modelRouter = new ModelRouterImpl();

const base = process.env.OPENAI_BASE_URL || process.env.OLLAMA_BASE_URL;
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || process.env.OLLAMA_MODEL || 'deepseek-coder';

if (base) {
  modelRouter.register(new OpenAICompatProvider({ baseURL: base, apiKey, model }));
  console.log('Model provider: OpenAI-compatible', { base, model });
} else {
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
