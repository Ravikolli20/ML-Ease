import { trainModelMock } from '../services/mlLogic';
import { getModelExplanation } from '../services/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { algorithm, problemType, features, params } = req.body || {};
    if (!algorithm || !problemType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await trainModelMock(algorithm, problemType, features || [], params || {});
    // Attempt to generate an explanation (falls back gracefully)
    try {
      const explanation = await getModelExplanation(result.modelName, result.metrics, problemType);
      result.explanation = explanation;
    } catch (e) {
      console.warn('Model explanation failed:', e);
    }

    res.status(200).json({ message: 'Model trained', results: result });
  } catch (err: any) {
    console.error('Train error:', err?.message || err);
    res.status(500).json({ error: 'Training failed' });
  }
}
