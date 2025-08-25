
export enum Feature {
  CropDoctor = 'CropDoctor',
  MarketAccess = 'MarketAccess',
  FertilizerOptimizer = 'FertilizerOptimizer',
  CropRecommendation = 'CropRecommendation',
  ContractFarming = 'ContractFarming',
  FinancialNeeds = 'FinancialNeeds',
  GovtSchemes = 'GovtSchemes',
  WeatherAlerts = 'WeatherAlerts',
  ExpertGuidance = 'ExpertGuidance',
}

export interface DiagnosisResult {
  isHealthy: boolean;
  diseaseName: string;
  description: string;
  treatment: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DailyForecast {
  day: string;
  temp_max: number;
  temp_min: number;
  condition: string;
}

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    wind_speed: number;
    humidity: number;
  };
  forecast: DailyForecast[];
}

export interface FertilizerRecommendation {
  npkRatio: string;
  recommendations: {
    stage: string;
    fertilizer: string;
    amount: string;
  }[];
  notes: string[];
  organicAlternatives: string[];
}

export interface MarketPrice {
  crop: string;
  variety: string;
  market: string;
  price: number;
  change: number;
}

export interface CropRecommendationResult {
  cropName: string;
  reasoning: string;
  estimatedProfitability: string;
  suitableRegions: string[];
}
