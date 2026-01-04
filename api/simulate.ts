import { simulatePrediction } from '../services/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { modelName, inputs, problemType } = req.body || {};
    if (!modelName || !inputs) return res.status(400).json({ error: 'Missing modelName or inputs' });

    const sim = await simulatePrediction(modelName, inputs, problemType);
    res.status(200).json({ simulation: sim });
  } catch (err: any) {
    console.error('Simulate error:', err?.message || err);
    res.status(500).json({ error: 'Simulation failed' });
  }
}
