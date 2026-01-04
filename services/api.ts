
import { trainModelMock, analyzeDataset } from './mlLogic';
import { mockDb, Project } from './mockDb';
import { ProblemType, TrainingResult } from '../types';

/**
 * ML Ease API Gateway
 * This service abstracts the "Backend" logic. In production these call your server endpoints (Vercel serverless functions).
 */
const jsonPost = async (path: string, body: any) => {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const api = {
  // Data Operations
  processUpload: async (data: any[]) => {
    return analyzeDataset(data);
  },

  // ML Operations - call server-side /api/train which runs training & optional explanation
  trainModel: async (algorithm: string, problemType: ProblemType, features: string[], params: any) => {
    const res = await jsonPost('/api/train', { algorithm, problemType, features, params });
    return res.results;
  },

  // AI Operations
  getRecommendations: async (stats: any, problemType: ProblemType) => {
    const res = await jsonPost('/api/recommend', { stats, problemType });
    return res.recommendations;
  },

  getSimulation: async (modelName: string, inputs: any, problemType: ProblemType) => {
    const res = await jsonPost('/api/simulate', { modelName, inputs, problemType });
    return res.simulation;
  },

  // Persistence Operations
  saveProject: (userId: string, project: Project) => mockDb.saveProject(userId, project),
  getProjects: (userId: string) => mockDb.getProjects(userId),
  deleteProject: (userId: string, id: string) => mockDb.deleteProject(userId, id)
};
