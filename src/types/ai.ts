export interface AiRelevantService {
  id: string;
  name: string;
  description: string | null;
  basePrice: string | null;
}

export interface ServiceAssistantResponse {
  answer: string;
  relevantServices: AiRelevantService[];
}

export interface ServiceRequestAiHelperResponse {
  improvedDescription: string;
  suggestedServiceId: string | null;
  suggestedServiceName: string | null;
  clarifyingQuestions: string[];
  disclaimer: string;
}