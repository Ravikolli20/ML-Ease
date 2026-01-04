
import { trainModelMock, analyzeDataset } from './mlLogic';
import { getAlgorithmRecommendations, getModelExplanation, simulatePrediction } from './geminiService';
import { mockDb, Project } from './mockDb';
import { ProblemType, TrainingResult } from '../types';

/**
 * ML Ease API Gateway
 * This service abstracts the "Backend" logic. 
 * In a real-world scenario, these would be fetch() calls to your FastAPI/Node server.
 */
export const api = {
  // Data Operations
  processUpload: async (data: any[]) => {
    return analyzeDataset(data);
  },

  // ML Operations
  trainModel: async (algorithm: string, problemType: ProblemType, features: string[], params: any) => {
    const result = await trainModelMock(algorithm, problemType, features, params);
    // Use the Interpretable AI to explain the model behavior
    const explanation = await getModelExplanation(result.modelName, result.metrics, problemType);
    return { ...result, explanation };
  },

  // AI Operations
  getRecommendations: async (stats: any, problemType: ProblemType) => {
    return getAlgorithmRecommendations(stats, problemType);
  },

  getSimulation: async (modelName: string, inputs: any, problemType: ProblemType) => {
    return simulatePrediction(modelName, inputs, problemType);
  },

  // Persistence Operations
  /**
   * Fixed: Added userId parameter to correctly call mockDb.saveProject
   */
  saveProject: (userId: string, project: Project) => mockDb.saveProject(userId, project),
  /**
   * Fixed: Added userId parameter to correctly call mockDb.getProjects
   */
  getProjects: (userId: string) => mockDb.getProjects(userId),
  /**
   * Fixed: Added userId parameter and call to existing mockDb.deleteProject
   */
  deleteProject: (userId: string, id: string) => mockDb.deleteProject(userId, id)
};
