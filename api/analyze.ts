import type { IncomingMessage, ServerResponse } from 'http';
import { analyzeDataset } from '../services/mlLogic';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid payload. Expected { data: [] }' });
    }

    const stats = analyzeDataset(data);
    res.status(200).json({ message: 'Analysis complete', stats });
  } catch (err: any) {
    console.error('Analyze error:', err?.message || err);
    res.status(500).json({ error: 'Failed to analyze data' });
  }
}
