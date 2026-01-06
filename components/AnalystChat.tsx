
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAnalyst } from '../services/geminiService';
import { TEAM_STATS } from '../data/matchHistory';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AnalystChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Merhaba! Ben senin AI Nexus Analistinim. Takım ve oyuncu seçerek derinlemesine bir kıyaslama yapabiliriz. Hangi eşleşmeyi analiz edelim?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamA, setTeamA] = useState<string>('');
  const [teamB, setTeamB] = useState<string>('');
  const [playerA, setPlayerA] = useState<string>('');
  const [playerB, setPlayerB] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const availableTeams = Object.keys(TEAM_STATS).sort();
  const ROLES = ['TOP', 'JNG', 'MID', 'ADC', 'SUP'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAnalyst(
        [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ], 
        teamA || undefined, 
        teamB || undefined,
        playerA || undefined,
        playerB || undefined
      );
      setMessages(prev => [...prev, { role: 'model', content: response || 'Üzgünüm, bir hata oluştu.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Nexus bağlantısında bir sorun yaşıyorum. Lütfen daha sonra tekrar dene." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (team: string) => {
    if (teamA === team) { setTeamA(''); setPlayerA(''); }
    else if (teamB === team) { setTeamB(''); setPlayerB(''); }
    else if (!teamA) { setTeamA(team); setPlayerA(''); }
    else { setTeamB(team); setPlayerB(''); }
  };

  const PlayerSelector = ({ teamName, selectedPlayer, onSelect, side }: { teamName: string, selectedPlayer: string, onSelect: (p: string) => void, side: 'blue' | 'red' }) => {
    const teamData = TEAM_STATS[teamName];
    if (!teamData) return null;

    return (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Kadrodan Oyuncu Seç</p>
        <div className="grid grid-cols-1 gap-1.5">
          {teamData.players.map((player, idx) => (
            <button
              key={player}
              onClick={() => onSelect(selectedPlayer === player ? '' : player)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                selectedPlayer === player 
                  ? (side === 'blue' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-rose-600 border-rose-400 text-white shadow-lg')
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="opacity-40 font-black w-6">{ROLES[idx]}</span>
                <span>{player}</span>
              </div>
              {selectedPlayer === player && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        
        {/* Left Selection Column */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-xl">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            TAKIM SEÇİMİ
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
            {availableTeams.map(team => (
              <div key={team} className="space-y-1">
                <button 
                  onClick={() => handleTeamClick(team)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between gap-3 ${
                    teamA === team ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' :
                    teamB === team ? 'bg-rose-600 border-rose-500 text-white shadow-lg' :
                    'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <span>{team}</span>
                  {(teamA === team || teamB === team) && (
                    <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">
                      {teamA === team ? 'MAVİ' : 'KIRMIZI'}
                    </span>
                  )}
                </button>
                
                {teamA === team && <PlayerSelector teamName={team} selectedPlayer={playerA} onSelect={setPlayerA} side="blue" />}
                {teamB === team && <PlayerSelector teamName={team} selectedPlayer={playerB} onSelect={setPlayerB} side="red" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Column */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          {/* VS Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
            
            <div className="flex items-center gap-12 relative z-10 w-full justify-around">
              <div className="text-center flex flex-col items-center gap-2">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">MAVİ TARAF</p>
                <h4 className={`text-2xl font-display font-black transition-all ${teamA ? 'text-white' : 'text-slate-700 italic'}`}>
                  {teamA || "TAKIM 1"}
                </h4>
                {playerA && (
                  <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-black animate-in zoom-in duration-300">
                    {playerA}
                  </div>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-lg">
                <span className="text-lg font-black italic text-slate-600">VS</span>
              </div>

              <div className="text-center flex flex-col items-center gap-2">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">KIRMIZI TARAF</p>
                <h4 className={`text-2xl font-display font-black transition-all ${teamB ? 'text-white' : 'text-slate-700 italic'}`}>
                  {teamB || "TAKIM 2"}
                </h4>
                {playerB && (
                  <div className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-400 text-[10px] font-black animate-in zoom-in duration-300">
                    {playerB}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none border border-indigo-500' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-[1.5rem] rounded-tl-none px-6 py-4 border border-slate-700 animate-pulse">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900/90 border-t border-slate-800/50 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={teamA && teamB ? `${playerA || teamA} vs ${playerB || teamB} üzerine analiz iste...` : "Önce takımları seçin..."}
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-indigo-500/50 rounded-2xl px-6 py-5 pr-24 outline-none transition-all text-slate-100 placeholder:text-slate-600 text-sm shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 px-7 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale rounded-xl text-white font-black transition-all flex items-center justify-center shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
              <p className="text-[9px] text-slate-600 mt-3 text-center font-bold uppercase tracking-widest italic">Nexus AI Oyuncu & Takım Analiz Modülü</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystChat;
