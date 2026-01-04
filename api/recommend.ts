import { getAlgorithmRecommendations } from '../services/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { stats, problemType } = req.body || {};
    if (!stats) return res.status(400).json({ error: 'Missing stats' });

    const recs = await getAlgorithmRecommendations(stats, problemType);
    res.status(200).json({ recommendations: recs });
  } catch (err: any) {
    console.error('Recommend error:', err?.message || err);
    res.status(500).json({ error: 'Recommendation failed' });
  }
}
