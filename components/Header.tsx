
import React from 'react';
import { GenerationSettings, ImageStyle } from '../types';

interface HeaderProps {
  settings: GenerationSettings;
  updateSettings: (settings: Partial<GenerationSettings>) => void;
}

const Header: React.FC<HeaderProps> = ({ settings, updateSettings }) => {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Style</span>
          <select 
            value={settings.style}
            onChange={(e) => updateSettings({ style: e.target.value as ImageStyle })}
            className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            {Object.values(ImageStyle).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ratio</span>
          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
            {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => updateSettings({ aspectRatio: ratio as any })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  settings.aspectRatio === ratio 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 ring-indigo-500/50 transition-all">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
