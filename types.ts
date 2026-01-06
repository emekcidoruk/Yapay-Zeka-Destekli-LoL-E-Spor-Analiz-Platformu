
export interface PlayerStats {
  id: string;
  name: string;
  role: 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
  champion: string;
  kda: string;
  cs: number;
  gold: string;
  dmgDealt: number;
  visionScore: number;
}

export interface TeamData {
  name: string;
  color: string;
  kills: number;
  towers: number;
  dragons: number;
  barons: number;
  players: PlayerStats[];
  logo: string;
}

export interface MatchData {
  id: string;
  league: string;
  blueTeam: TeamData;
  redTeam: TeamData;
  winner: 'BLUE' | 'RED';
  duration: string;
  date: string;
}

export interface AnalysisResult {
  summary: string;
  winCondition: string;
  criticalMistakes: string[];
  mvp: string;
  pros: string[];
  cons: string[];
  winProbability: {
    blue: number;
    red: number;
  };
  laneMatchups: {
    lane: string;
    advantage: 'BLUE' | 'RED' | 'EVEN';
    reason: string;
  }[];
  tacticalBreakdown: {
    earlyGame: string;
    midGame: string;
    lateGame: string;
  };
  teamStyles: {
    blue: string[];
    red: string[];
  };
}
