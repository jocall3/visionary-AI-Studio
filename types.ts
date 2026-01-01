
export enum ImageStyle {
  PHOTOREALISTIC = 'Photorealistic',
  ANIME = 'Anime',
  DIGITAL_ART = 'Digital Art',
  PAINTING = 'Painting',
  CONCEPT_ART = 'Concept Art',
  CYBERPUNK = 'Cyberpunk',
  SURREAL = 'Surreal',
  MINIMALIST = 'Minimalist',
  VINTAGE = 'Vintage',
  SCIFI = 'Sci-Fi'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  style: ImageStyle;
  aspectRatio: string;
  isFavorite: boolean;
  metadata: {
    model: string;
    seed: number;
    guidanceScale: number;
  };
}

export interface GenerationSettings {
  modelId: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  style: ImageStyle;
  guidanceScale: number;
  negativePrompt: string;
  steps: number;
  seed: number;
}

export interface AppState {
  activeTab: 'generate' | 'history' | 'templates' | 'settings';
  prompt: string;
  history: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
  settings: GenerationSettings;
  isAssistantRunning: boolean;
}
