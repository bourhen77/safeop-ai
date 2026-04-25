import { Router } from 'express';
import { chat, checkOllamaStatus } from '../services/llm.js';

const router = Router();

router.post('/', async (req, res) => {
  const { message, history, patientContext } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message requis' });
  }
  try {
    const result = await chat(message, history || [], patientContext || null);
    res.json(result);
  } catch (err) {
    console.error('[chat route]', err);
    res.status(500).json({ error: 'Erreur LLM', details: err.message });
  }
});

router.get('/health', async (req, res) => {
  const ollama = await checkOllamaStatus();
  res.json({
    status: 'ok',
    ollama,
    claude: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

export default router;
