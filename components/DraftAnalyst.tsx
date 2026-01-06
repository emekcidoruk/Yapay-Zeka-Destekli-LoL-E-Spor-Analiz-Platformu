
import React, { useState } from 'react';
import { analyzeDraft } from '../services/geminiService';
import { CHAMPIONS, DD_VERSION } from '../data/champions';

const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
const ROLE_ICONS = {
  'TOP': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', // Basit kare placeholder, UI'da custom SVG kullanacağız
  'JUNGLE': '',
  'MID': '',
  'ADC': '',
  'SUPPORT': ''
};

interface SelectionState {
  side: 'blue' | 'red';
  index: number;
}

const DraftAnalyst: React.FC = () => {
  const [bluePicks, setBluePicks] = useState<string[]>(['', '', '', '', '']);
  const [redPicks, setRedPicks] = useState<string[]>(['', '', '', '', '']);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  
  // Selection Modal State
  const [selectingSlot, setSelectingSlot] = useState<SelectionState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);
    setAnalysis(null);
    setErrorType(null);
    try {
      const result = await analyzeDraft(
        bluePicks.filter(p => p),
        redPicks.filter(p => p)
      );
      setAnalysis(result);
    } catch (err: any) {
      if (err.message === "QUOTA_EXCEEDED") setErrorType("QUOTA");
      else setAnalysis("Analiz sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const openSelection = (side: 'blue' | 'red', index: number) => {
    setSelectingSlot({ side, index });
    setSearchTerm('');
    // Otomatik olarak o slotun rolünü filtrele
    setSelectedRoleFilter(ROLES[index]);
  };

  const selectChampion = (champName: string) => {
    if (!selectingSlot) return;

    if (selectingSlot.side === 'blue') {
      const newPicks = [...bluePicks];
      newPicks[selectingSlot.index] = champName;
      setBluePicks(newPicks);
    } else {
      const newPicks = [...redPicks];
      newPicks[selectingSlot.index] = champName;
      setRedPicks(newPicks);
    }
    setSelectingSlot(null);
  };

  const getChampionImage = (name: string) => {
    const champ = CHAMPIONS.find(c => c.name === name);
    if (!champ) return '';
    return `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${champ.id}.png`;
  };

  // Filter Logic
  const filteredChampions = CHAMPIONS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || c.roles.includes(selectedRoleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-24 relative">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tighter">HEX-TECH DRAFT</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Profesyonel Pick & Ban Analiz Simülasyonu</p>
      </div>

      {/* KOTA HATASI UYARISI */}
      {errorType === "QUOTA" && (
        <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-2xl mb-6 flex items-center gap-4 animate-bounce">
          <div className="text-amber-500">⚠️</div>
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">API Kotası Doldu. Lütfen kısa bir süre bekleyin.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        
        {/* BLUE TEAM COLUMN */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-3 mb-2 pl-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>
            <h3 className="text-indigo-400 font-display font-bold text-sm tracking-[0.2em]">MAVİ TAKIM</h3>
          </div>
          
          <div className="space-y-3">
            {bluePicks.map((pick, i) => (
              <div key={`blue-${i}`} className="relative group">
                <button
                  onClick={() => openSelection('blue', i)}
                  className={`w-full h-16 rounded-xl border flex items-center overflow-hidden transition-all duration-300 relative ${
                    pick 
                    ? 'bg-slate-900 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-16 h-full bg-slate-950 flex items-center justify-center border-r border-slate-800 shrink-0 relative">
                     <span className="text-[9px] font-black text-slate-600 -rotate-90 absolute w-full text-center tracking-widest">{ROLES[i]}</span>
                  </div>
                  
                  {pick ? (
                    <>
                      <img src={getChampionImage(pick)} alt={pick} className="absolute left-0 top-0 h-full w-16 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/50 to-slate-900/80"></div>
                      <span className="ml-4 pl-14 font-display font-bold text-lg text-white z-10 uppercase tracking-wider">{pick}</span>
                    </>
                  ) : (
                    <span className="ml-4 text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Şampiyon Seç...</span>
                  )}
                  
                  <div className="absolute right-4 text-slate-600 group-hover:text-white transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER ACTION AREA */}
        <div className="shrink-0 flex flex-col items-center justify-center pt-8">
           <div className="w-px h-32 bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>
           <button
            onClick={handleAnalyze}
            disabled={loading}
            className="group relative px-8 py-8 rounded-full bg-slate-950 border-4 border-slate-800 hover:border-slate-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 my-4"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <span className={`block font-display font-black text-xs tracking-widest text-slate-200 transition-all ${loading ? 'animate-pulse' : ''}`}>
              {loading ? 'ANALİZ...' : 'VS'}
            </span>
          </button>
           <div className="w-px h-32 bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>
        </div>

        {/* RED TEAM COLUMN */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-end gap-3 mb-2 pr-2">
            <h3 className="text-rose-400 font-display font-bold text-sm tracking-[0.2em]">KIRMIZI TAKIM</h3>
            <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]"></div>
          </div>
          
          <div className="space-y-3">
            {redPicks.map((pick, i) => (
              <div key={`red-${i}`} className="relative group">
                <button
                  onClick={() => openSelection('red', i)}
                  className={`w-full h-16 rounded-xl border flex flex-row-reverse items-center overflow-hidden transition-all duration-300 relative ${
                    pick 
                    ? 'bg-slate-900 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-rose-500/30 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-16 h-full bg-slate-950 flex items-center justify-center border-l border-slate-800 shrink-0 relative">
                     <span className="text-[9px] font-black text-slate-600 rotate-90 absolute w-full text-center tracking-widest">{ROLES[i]}</span>
                  </div>
                  
                  {pick ? (
                    <>
                      <img src={getChampionImage(pick)} alt={pick} className="absolute right-0 top-0 h-full w-16 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/50 to-slate-900/80"></div>
                      <span className="mr-4 pr-14 font-display font-bold text-lg text-white z-10 uppercase tracking-wider">{pick}</span>
                    </>
                  ) : (
                    <span className="mr-4 text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Şampiyon Seç...</span>
                  )}
                  
                  <div className="absolute left-4 text-slate-600 group-hover:text-white transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULT */}
      {analysis && (
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-slate-700 animate-in slide-in-from-top-6 duration-700 shadow-2xl relative overflow-hidden mt-8">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-white to-rose-500"></div>
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-xl">
               <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             <div>
               <h3 className="font-display font-black text-xl text-white tracking-wide">STRATEJİK RAPOR</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Yapay Zeka Destekli Kompozisyon Analizi</p>
             </div>
           </div>
          <div className="text-slate-300 text-sm leading-8 whitespace-pre-wrap font-medium">
            {analysis}
          </div>
        </div>
      )}

      {/* CHAMPION SELECTION MODAL */}
      {selectingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Şampiyon Seçimi</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {selectingSlot.side === 'blue' ? 'Mavi Takım' : 'Kırmızı Takım'} - {ROLES[selectingSlot.index]}
                </p>
              </div>
              <button 
                onClick={() => setSelectingSlot(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-950/30">
              <div className="flex-1 relative">
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Şampiyon ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {['ALL', ...ROLES].map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                      selectedRoleFilter === role 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {role === 'ALL' ? 'Tümü' : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {filteredChampions.map(champ => (
                  <button
                    key={champ.id}
                    onClick={() => selectChampion(champ.name)}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-800 hover:border-indigo-500 transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${champ.id}.png`} 
                      alt={champ.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1 pt-6">
                      <p className="text-[10px] text-center font-bold text-white truncate px-1">{champ.name}</p>
                    </div>
                  </button>
                ))}
                {filteredChampions.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500">
                    <p>Şampiyon bulunamadı.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DraftAnalyst;
