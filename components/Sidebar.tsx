
import React from 'react';
import { MatchData } from '../types';
import { TEAM_STATS } from '../data/matchHistory';
import { AppTab } from '../App';

interface SidebarProps {
  matches: MatchData[];
  onSelectMatch: (match: MatchData) => void;
  selectedId: string;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ matches, onSelectMatch, selectedId, activeTab, onTabChange }) => {
  
  return (
    <aside className="w-20 md:w-72 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col h-full shrink-0 relative z-50">
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group relative overflow-hidden">
            <span className="font-display font-black text-xl text-white">N</span>
          </div>
          <div className="hidden md:block">
            <h1 className="font-display font-black text-sm tracking-[0.2em] bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NEXUS AI
            </h1>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 flex flex-col overflow-hidden">
        <div className="mb-8 space-y-2">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span className="hidden md:block font-bold text-[10px] uppercase tracking-widest">Maç Paneli</span>
          </button>
          
          <button 
            onClick={() => onTabChange('draft')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'draft' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="hidden md:block font-bold text-[10px] uppercase tracking-widest">Draft Analizi</span>
          </button>

          <button 
            onClick={() => onTabChange('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span className="hidden md:block font-bold text-[10px] uppercase tracking-widest">AI Analist</span>
          </button>
        </div>

        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 px-2">Kayıtlı Maçlar</p>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
            {matches.map(match => (
              <button
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                  selectedId === match.id 
                    ? 'bg-slate-800 border-indigo-500/50 shadow-xl' 
                    : 'border-transparent bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {selectedId === match.id && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]"></div>}
                <div className="text-[8px] font-black text-indigo-400 mb-1 uppercase opacity-60">{match.league}</div>
                <div className="text-[10px] font-bold text-slate-300 flex justify-between items-center">
                  <span>{match.blueTeam.name}</span>
                  <span className="text-slate-600">vs</span>
                  <span>{match.redTeam.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
