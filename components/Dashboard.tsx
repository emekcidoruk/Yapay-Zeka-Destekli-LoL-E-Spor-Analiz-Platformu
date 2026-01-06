
import React, { useState, useEffect } from 'react';
import { MatchData, AnalysisResult } from '../types';
import { analyzeMatch } from '../services/geminiService';
import { TEAM_STATS } from '../data/matchHistory';

interface DashboardProps {
  match: MatchData;
}

const Dashboard: React.FC<DashboardProps> = ({ match: initialMatch }) => {
  const [activeMatch, setActiveMatch] = useState<MatchData>(initialMatch);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);

  const availableTeams = Object.keys(TEAM_STATS).sort();

  useEffect(() => {
    setActiveMatch(initialMatch);
  }, [initialMatch]);

  useEffect(() => {
    const performAnalysis = async () => {
      setLoading(true);
      setErrorType(null);
      setAnalysis(null);
      try {
        const result = await analyzeMatch(activeMatch);
        setAnalysis(result);
      } catch (err: any) {
        if (err.message === "QUOTA_EXCEEDED") {
          setErrorType("QUOTA");
        } else {
          setErrorType("GENERAL");
        }
      } finally {
        setLoading(false);
      }
    };
    performAnalysis();
  }, [activeMatch]);

  const handleTeamChange = (side: 'blue' | 'red', teamName: string) => {
    const teamInfo = TEAM_STATS[teamName];
    const newMatch = JSON.parse(JSON.stringify(activeMatch));
    
    if (side === 'blue') {
      newMatch.blueTeam.name = teamName;
      newMatch.blueTeam.logo = teamInfo.logo;
      newMatch.blueTeam.color = teamInfo.color;
    } else {
      newMatch.redTeam.name = teamName;
      newMatch.redTeam.logo = teamInfo.logo;
      newMatch.redTeam.color = teamInfo.color;
    }
    newMatch.id = `custom-${newMatch.blueTeam.name}-${newMatch.redTeam.name}`;
    setActiveMatch(newMatch);
  };

  const blueData = TEAM_STATS[activeMatch.blueTeam.name];
  const redData = TEAM_STATS[activeMatch.redTeam.name];

  const LANE_CONFIG = [
    { key: 'TOP', label: 'TOP' },
    { key: 'JUNGLE', label: 'JNG' },
    { key: 'MID', label: 'MID' },
    { key: 'ADC', label: 'ADC' },
    { key: 'SUPPORT', label: 'SUP' }
  ];

  // Helper to safely find lane analysis with fuzzy matching
  const getLaneAnalysis = (targetKey: string) => {
    if (!analysis?.laneMatchups) return null;
    
    const target = targetKey.toUpperCase();
    
    return analysis.laneMatchups.find(l => {
      const current = (l.lane || '').toUpperCase();
      
      // Direct match
      if (current === target) return true;
      
      // Fuzzy matches for common variations
      if (target === 'ADC' && (current.includes('BOT') || current.includes('AD') || current.includes('CARRY'))) return true;
      if (target === 'JUNGLE' && (current.includes('JNG') || current.includes('JUNG'))) return true;
      if (target === 'SUPPORT' && (current.includes('SUP'))) return true;
      if (target === 'MID' && (current.includes('MIDDLE'))) return true;
      if (target === 'TOP' && (current.includes('TOP'))) return true;
      
      return false;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24">
      
      {/* KOTA HATASI UYARISI */}
      {errorType === "QUOTA" && (
        <div className="bg-amber-500/10 border border-amber-500/50 p-6 rounded-3xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-amber-500 font-display font-bold text-sm tracking-widest uppercase">API Kotası Aşıldı</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Şu an çok fazla analiz talebi alıyoruz. Lütfen 1 dakika bekleyin veya 
                <a href="https://ai.google.dev/usage" target="_blank" className="text-amber-400 underline ml-1">kota panelinizi</a> 
                kontrol edin. Ücretsiz planda dakikalık istek limiti bulunmaktadır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCOUTER SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 border-indigo-500/30 flex items-center gap-4 group transition-all hover:bg-indigo-500/5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 p-2 border border-indigo-500/50 flex-shrink-0">
            <img src={blueData?.logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Mavi Operasyonel Güç</span>
            <select 
              value={activeMatch.blueTeam.name}
              onChange={(e) => handleTeamChange('blue', e.target.value)}
              className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none cursor-pointer text-slate-100"
            >
              {availableTeams.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border-rose-500/30 flex items-center gap-4 group transition-all hover:bg-rose-500/5">
          <div className="flex-1 text-right">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">Kırmızı Operasyonel Güç</span>
            <select 
              value={activeMatch.redTeam.name}
              onChange={(e) => handleTeamChange('red', e.target.value)}
              className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none cursor-pointer text-slate-100 text-right"
            >
              {availableTeams.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 p-2 border border-rose-500/50 flex-shrink-0">
            <img src={redData?.logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>

      {/* BATTLE DISPLAY */}
      <div className="relative glass-panel rounded-[3.5rem] p-10 md:p-16 shadow-2xl overflow-hidden border-slate-800 ring-1 ring-white/5">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          {/* Blue Side */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="relative mb-6">
              <div className="absolute -inset-8 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-950 rounded-full p-8 border-2 border-indigo-500/40 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative">
                <img src={blueData?.logo} className="w-full h-full object-contain" />
              </div>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter mb-2 italic uppercase">{activeMatch.blueTeam.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {analysis?.teamStyles.blue.map(style => (
                <span key={style} className="text-[8px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-tighter">{style}</span>
              ))}
            </div>
          </div>

          {/* Center VS */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
              <span className="text-2xl font-display font-black italic text-slate-100 relative z-10">VS</span>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
              {loading ? 'Yükleniyor...' : 'Veri Hazır'}
            </div>
          </div>

          {/* Red Side */}
          <div className="flex-1 text-center md:text-right flex flex-col items-center md:items-end">
            <div className="relative mb-6">
              <div className="absolute -inset-8 bg-rose-500/20 blur-[60px] rounded-full animate-pulse"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-950 rounded-full p-8 border-2 border-rose-500/40 shadow-[0_0_50px_rgba(225,29,72,0.3)] relative">
                <img src={redData?.logo} className="w-full h-full object-contain" />
              </div>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tighter mb-2 italic uppercase">{activeMatch.redTeam.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {analysis?.teamStyles.red.map(style => (
                <span key={style} className="text-[8px] font-black px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-tighter">{style}</span>
              ))}
            </div>
          </div>
        </div>

        {/* PROBABILITY BAR */}
        <div className="mt-16 relative">
          {loading && (
             <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-black tracking-widest text-slate-400 uppercase animate-bounce">
                  Yapay Zeka Savaş Simülasyonu Yapıyor...
                </div>
             </div>
          )}
          <div className={`transition-all duration-1000 ${loading ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <div className="flex justify-between mb-4 text-[10px] font-black tracking-widest uppercase">
              <span className="text-indigo-400">Tahmini Galibiyet %{analysis?.winProbability.blue || 50}</span>
              <span className="text-rose-400">Tahmini Galibiyet %{analysis?.winProbability.red || 50}</span>
            </div>
            <div className="h-6 w-full bg-slate-950 rounded-2xl p-1 border border-slate-800 flex overflow-hidden shadow-2xl">
              <div className="h-full bg-gradient-to-r from-indigo-800 to-indigo-500 transition-all duration-1000 ease-out flex items-center justify-start pl-4" style={{width: `${analysis?.winProbability.blue || 50}%`}}>
                <div className="w-1 h-2 bg-white/50 rounded-full"></div>
              </div>
              <div className="h-full bg-gradient-to-l from-rose-800 to-rose-500 transition-all duration-1000 ease-out flex items-center justify-end pr-4" style={{width: `${analysis?.winProbability.red || 50}%`}}>
                <div className="w-1 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TACTICAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GAME TIMELINE */}
        <div className="glass-panel rounded-[2.5rem] p-8 border-slate-800 flex flex-col gap-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            STRATEJİK ZAMAN ÇİZELGESİ
          </h3>
          
          <div className="space-y-6 relative">
            <div className="absolute left-[13px] top-2 bottom-2 w-px bg-slate-800"></div>
            
            {[
              { label: 'Erken Oyun', data: analysis?.tacticalBreakdown.earlyGame, color: 'text-emerald-400' },
              { label: 'Orta Oyun', data: analysis?.tacticalBreakdown.midGame, color: 'text-amber-400' },
              { label: 'Oyun Sonu', data: analysis?.tacticalBreakdown.lateGame, color: 'text-rose-400' }
            ].map((phase, idx) => (
              <div key={idx} className="relative pl-10">
                <div className={`absolute left-0 top-1 w-7 h-7 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-[10px] font-black ${phase.color}`}>
                  {idx + 1}
                </div>
                <h4 className={`text-[10px] font-black uppercase tracking-wider mb-1 ${phase.color}`}>{phase.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic">{phase.data || (loading ? 'Simülasyon yükleniyor...' : 'Veri yok')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CORE ANALYSIS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-[2.5rem] p-8 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div> 
                NEXUS AI ÖZETİ
              </h3>
              {analysis?.mvp && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                   <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Kritik Oyuncu: {analysis.mvp}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-8 border-l-4 border-indigo-500/40 pl-6 py-2">
              {analysis?.summary || (loading ? 'Maç verileri Nexus motorları tarafından işleniyor...' : 'Lütfen analiz bekleyin.')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 block group-hover:translate-x-1 transition-transform">Zafer Formülü</span>
                <p className="text-xs text-slate-400 leading-relaxed">{analysis?.winCondition || '...'}</p>
              </div>
              <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3 block group-hover:translate-x-1 transition-transform">Stratejik Avantaj</span>
                <p className="text-xs text-slate-400 leading-relaxed">{analysis?.pros[0] || '...'}</p>
              </div>
            </div>
          </div>

          {/* LANE DOMINANCE MAP */}
          <div className="glass-panel rounded-[2.5rem] p-8 border-slate-800">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest mb-10 text-slate-500 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               KORİDOR DOMİNASYON HARİTASI
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {LANE_CONFIG.map(({ key: laneKey, label: displayLabel }) => {
                const laneInfo = getLaneAnalysis(laneKey);
                
                const advantage = laneInfo?.advantage?.toUpperCase() || 'EVEN';
                const isBlue = advantage.includes('BLUE');
                const isRed = advantage.includes('RED');
                
                return (
                  <div key={laneKey} className="group relative flex flex-col items-center">
                    <div className="mb-4 text-[9px] font-black text-slate-500">{displayLabel}</div>
                    
                    <div className={`w-full h-1.5 rounded-full mb-4 transition-all duration-500 ${
                      isBlue ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' :
                      isRed ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]' :
                      'bg-slate-800'
                    }`}></div>
                    
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all cursor-help relative overflow-hidden ${
                      isBlue ? 'bg-indigo-500/10 border-indigo-500/50' :
                      isRed ? 'bg-rose-500/10 border-rose-500/50' :
                      'bg-slate-900 border-slate-800'
                    }`}>
                       <div className={`font-display font-black text-xs ${
                         isBlue ? 'text-indigo-400' : 
                         isRed ? 'text-rose-400' : 
                         'text-slate-600'
                       }`}>
                         {isBlue ? 'B' : isRed ? 'R' : '='}
                       </div>
                       
                       {/* TOOLTIP */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48 z-50">
                          <div className="bg-slate-950 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <div className="text-[10px] font-black text-white mb-2 pb-1 border-b border-white/10">{laneKey} Koridoru</div>
                            <p className="text-[9px] text-slate-400 leading-relaxed normal-case font-medium italic">
                              {laneInfo?.reason || 'Veri analiz ediliyor...'}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-700 rotate-45 mx-auto -mt-1"></div>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
