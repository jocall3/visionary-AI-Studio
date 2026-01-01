
import React from 'react';
import { AppState, GenerationSettings } from '../types';
import { improvePromptWithAI } from '../services/geminiService';

interface WorkspaceProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  onGenerate: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ state, dispatch, onGenerate }) => {
  const handleAssistant = async () => {
    if (!state.prompt.trim()) return;
    dispatch({ type: 'SET_ASSISTANT', payload: true });
    try {
      const improved = await improvePromptWithAI(state.prompt);
      dispatch({ type: 'SET_PROMPT', payload: improved });
    } finally {
      dispatch({ type: 'SET_ASSISTANT', payload: false });
    }
  };

  const latestImage = state.history[0];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Prompt Area */}
      <div className="max-w-4xl w-full mx-auto space-y-4">
        <div className="relative">
          <textarea
            value={state.prompt}
            onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
            placeholder="Describe what you want to see..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-lg text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-600 outline-none resize-none transition-all shadow-inner h-32"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={handleAssistant}
              disabled={state.isAssistantRunning || !state.prompt}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {state.isAssistantRunning ? (
                <div className="w-4 h-4 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              Expand Prompt
            </button>
            <button 
              onClick={onGenerate}
              disabled={state.isGenerating || !state.prompt}
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {state.isGenerating ? (
                <>
                   <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                   Generating...
                </>
              ) : (
                <>
                  Generate
                  <span className="text-white/50 text-sm">⌘↵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{state.error}</span>
          </div>
        )}
      </div>

      {/* Result Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {state.isGenerating ? (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                 <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-slate-300">Summoning your vision...</p>
              <p className="text-slate-500 text-sm animate-pulse">Consulting the latent space neural networks</p>
            </div>
          </div>
        ) : latestImage ? (
          <div className="max-w-3xl w-full group relative">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <img 
                src={latestImage.url} 
                alt={latestImage.prompt} 
                className="w-full h-auto object-contain bg-black"
              />
              <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800">
                <p className="text-slate-300 font-medium leading-relaxed">
                  {latestImage.prompt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
                  <span>{latestImage.style}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span>{latestImage.aspectRatio}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span>{latestImage.metadata.model}</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
               <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl text-white transition-all shadow-xl">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               </button>
               <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl text-white transition-all shadow-xl">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-slate-400">Your generated creations will manifest here in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
