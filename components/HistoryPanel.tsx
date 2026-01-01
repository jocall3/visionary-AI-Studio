
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  toggleFavorite: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, toggleFavorite }) => {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100">Gallery</h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{history.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-2 opacity-50">
             <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
             <p className="text-sm font-medium text-slate-400">No generated images yet.</p>
          </div>
        ) : (
          history.map((img) => (
            <div key={img.id} className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {img.prompt}
                </p>
                <div className="mt-2 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{img.style}</span>
                   <button 
                     onClick={() => toggleFavorite(img.id)}
                     className={`transition-colors ${img.isFavorite ? 'text-rose-500' : 'text-slate-600 hover:text-slate-400'}`}
                   >
                     <svg className="w-4 h-4" fill={img.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
