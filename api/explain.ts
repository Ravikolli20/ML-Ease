import { getModelExplanation } from '../services/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { modelName, metrics, problemType } = req.body || {};
    if (!modelName || !metrics) {
      return res.status(400).json({ error: 'Missing modelName or metrics' });
    }

    const explanation = await getModelExplanation(modelName, metrics, problemType);
    res.status(200).json({ explanation });
  } catch (err: any) {
    console.error('Explain error:', err?.message || err);
    res.status(500).json({ error: 'Explanation failed' });
  }
}
