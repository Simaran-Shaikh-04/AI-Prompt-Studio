export interface Question {
  id: string;
  question: string;
  helperText: string;
  placeholder?: string;
}

export interface OptimizationProfile {
  id: 'token-saving' | 'architectural' | 'mvp-prototype' | 'comprehensive';
  name: string;
  description: string;
  icon: string;
  tokenFocus: string;
  claudeBias: string;
}

export interface PromptAnalysis {
  efficiencyScore: number; // 0-100
  tokenEstimation: {
    systemPromptTokens: number;
    estimatedSavings: number;
    reductionPercentage: number;
  };
  pros: string[];
  cons: string[];
  recommendations: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string; // Text content if text, base64 if image
  previewUrl?: string; // Client object URL for local display
}

export interface GenerationState {
  appIdea: string;
  isLoadingQuestions: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  selectedProfileId: 'token-saving' | 'architectural' | 'mvp-prototype' | 'comprehensive';
  generatedPrompt: string;
  isGeneratingPrompt: boolean;
  analysis: PromptAnalysis | null;
  attachments?: Attachment[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  appIdea: string;
  optimizedPrompt: string;
  profileId: string;
  answers: Record<string, string>;
  attachments?: Attachment[];
}
