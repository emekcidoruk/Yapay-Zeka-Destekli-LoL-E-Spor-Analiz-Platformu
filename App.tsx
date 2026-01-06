
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AnalystChat from './components/AnalystChat';
import DraftAnalyst from './components/DraftAnalyst';
import { MatchData, PlayerStats } from './types';

const generateGenericPlayers = (teamName: string): PlayerStats[] => {
  const roles: ('TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT')[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
  return roles.map((role, i) => ({
    id: `${teamName}-${role}`,
    name: `${teamName} Player ${i+1}`,
    role,
    champion: 'Champion',
    kda: '0/0/0',
    cs: 250,
    gold: '12k',
    dmgDealt: 15000,
    visionScore: 30
  }));
};

const MOCK_MATCHES: MatchData[] = [
  {
    id: 't1-tes-2025',
    league: 'Worlds 2025 Finals',
    blueTeam: {
      name: 'T1', color: '#E4002B', kills: 18, towers: 9, dragons: 3, barons: 1, logo: '',
      players: [
        { id: 't1-z', name: 'Zeus', role: 'TOP', champion: 'Aatrox', kda: '4/1/6', cs: 310, gold: '16k', dmgDealt: 28000, visionScore: 35 },
        { id: 't1-o', name: 'Oner', role: 'JUNGLE', champion: 'Sejuani', kda: '2/1/12', cs: 210, gold: '13k', dmgDealt: 12000, visionScore: 70 },
        { id: 't1-f', name: 'Faker', role: 'MID', champion: 'Azir', kda: '6/0/8', cs: 340, gold: '18k', dmgDealt: 35000, visionScore: 45 },
        { id: 't1-g', name: 'Gumayusi', role: 'ADC', champion: 'Varus', kda: '5/1/7', cs: 380, gold: '19k', dmgDealt: 42000, visionScore: 30 },
        { id: 't1-k', name: 'Keria', role: 'SUPPORT', champion: 'Renata Glasc', kda: '1/1/15', cs: 45, gold: '11k', dmgDealt: 8000, visionScore: 110 }
      ]
    },
    redTeam: {
      name: 'Top Esports', color: '#FF4C00', kills: 8, towers: 2, dragons: 1, barons: 0, logo: '',
      players: generateGenericPlayers('Top Esports')
    },
    winner: 'BLUE',
    duration: '30:12',
    date: '2025-11-02'
  },
  {
    id: 'g2-t1-2025',
    league: 'RB League of Its Own',
    blueTeam: {
      name: 'G2 Esports', color: '#000000', kills: 28, towers: 11, dragons: 3, barons: 1, logo: '',
      players: generateGenericPlayers('G2 Esports')
    },
    redTeam: {
      name: 'T1', color: '#E4002B', kills: 15, towers: 4, dragons: 2, barons: 0, logo: '',
      players: generateGenericPlayers('T1')
    },
    winner: 'BLUE',
    duration: '28:33',
    date: '2025-11-29'
  }
];

export type AppTab = 'dashboard' | 'chat' | 'draft';

const App: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(MOCK_MATCHES[0]);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-inter">
      <Sidebar 
        matches={MOCK_MATCHES} 
        onSelectMatch={(match) => {
          setSelectedMatch(match);
          setActiveTab('dashboard');
        }} 
        selectedId={selectedMatch?.id || ''}
        activeTab={activeTab}
        // @ts-ignore
        onTabChange={setActiveTab}
      />
      
      <main className="flex-1 relative overflow-y-auto scroll-smooth">
        {/* Decorative background elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-rose-600/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto p-4 md:p-10 relative z-10">
          {activeTab === 'dashboard' && selectedMatch && <Dashboard match={selectedMatch} />}
          {activeTab === 'chat' && <AnalystChat />}
          {activeTab === 'draft' && <DraftAnalyst />}
        </div>
      </main>
    </div>
  );
};

export default App;
