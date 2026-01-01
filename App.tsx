
import React, { useReducer, useEffect, useCallback } from 'react';
import { AppState, ImageStyle, GenerationSettings, GeneratedImage } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Workspace from './components/Workspace';
import HistoryPanel from './components/HistoryPanel';
import { generateAIImage } from './services/geminiService';

const initialState: AppState = {
  activeTab: 'generate',
  prompt: '',
  history: JSON.parse(localStorage.getItem('visionary_history') || '[]'),
  isGenerating: false,
  error: null,
  isAssistantRunning: false,
  settings: {
    modelId: 'gemini-2.5-flash-image',
    aspectRatio: '1:1',
    style: ImageStyle.PHOTOREALISTIC,
    guidanceScale: 7.5,
    negativePrompt: 'blurry, distorted, low quality, text, watermark',
    steps: 30,
    seed: -1
  }
};

type Action = 
  | { type: 'SET_TAB'; payload: AppState['activeTab'] }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_HISTORY'; payload: GeneratedImage }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GenerationSettings> }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_ASSISTANT'; payload: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'SET_PROMPT': return { ...state, prompt: action.payload };
    case 'SET_GENERATING': return { ...state, isGenerating: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload };
    case 'SET_ASSISTANT': return { ...state, isAssistantRunning: action.payload };
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_HISTORY':
      const newHistory = [action.payload, ...state.history];
      localStorage.setItem('visionary_history', JSON.stringify(newHistory));
      return { ...state, history: newHistory };
    case 'TOGGLE_FAVORITE':
      const toggledHistory = state.history.map(img => 
        img.id === action.payload ? { ...img, isFavorite: !img.isFavorite } : img
      );
      localStorage.setItem('visionary_history', JSON.stringify(toggledHistory));
      return { ...state, history: toggledHistory };
    default: return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleGenerate = useCallback(async () => {
    if (!state.prompt.trim()) {
      dispatch({ type: 'SET_ERROR', payload: "Please enter a prompt." });
      return;
    }

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const imageUrl = await generateAIImage(state.prompt, state.settings);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: state.prompt,
        timestamp: Date.now(),
        style: state.settings.style,
        aspectRatio: state.settings.aspectRatio,
        isFavorite: false,
        metadata: {
          model: state.settings.modelId,
          seed: state.settings.seed === -1 ? Math.floor(Math.random() * 1000000) : state.settings.seed,
          guidanceScale: state.settings.guidanceScale
        }
      };
      dispatch({ type: 'ADD_HISTORY', payload: newImage });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || "Failed to generate image." });
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, [state.prompt, state.settings]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar 
        activeTab={state.activeTab} 
        setTab={(tab) => dispatch({ type: 'SET_TAB', payload: tab })} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          settings={state.settings} 
          updateSettings={(s) => dispatch({ type: 'UPDATE_SETTINGS', payload: s })}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <Workspace 
            state={state}
            dispatch={dispatch}
            onGenerate={handleGenerate}
          />
          
          {state.activeTab === 'history' && (
            <HistoryPanel 
              history={state.history}
              toggleFavorite={(id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id })}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
