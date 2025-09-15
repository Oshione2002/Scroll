import express from 'express';
import { ask } from '../rag/queryEngine';

const router = express.Router();

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
    const result = await ask(query);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
