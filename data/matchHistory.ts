
export const RAW_MATCH_HISTORY = [
  // T1 vs Gen.G (LCK Derby)
  { team: "T1", opponent: "Gen.G", tournament: "LCK 2025 Spring Finals", date: "2025-04-12", result: "Loss", duration: "32:15" },
  { team: "T1", opponent: "Gen.G", tournament: "LCK 2024 Summer Finals", date: "2024-09-08", result: "Loss", duration: "29:40" },
  { team: "T1", opponent: "Gen.G", tournament: "MSI 2024 Semis", date: "2024-05-18", result: "Win", duration: "35:10" },
  { team: "T1", opponent: "Gen.G", tournament: "Worlds 2023 Semis", date: "2023-11-12", result: "Win", duration: "31:20" },
  { team: "Gen.G", opponent: "T1", tournament: "LCK 2023 Summer", date: "2023-08-20", result: "Win", duration: "28:50" },

  // G2 vs Fnatic (LEC Classics)
  { team: "G2 Esports", opponent: "Fnatic", tournament: "LEC 2025 Spring", date: "2025-03-15", result: "Win", duration: "26:45" },
  { team: "G2 Esports", opponent: "Fnatic", tournament: "LEC 2024 Season Finals", date: "2024-09-01", result: "Win", duration: "31:12" }
];

const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

export const TEAM_STATS: Record<string, { winRate: string; avgDuration: string; tier: string; logo: string; color: string; players: string[] }> = {
  "T1": { 
    winRate: "78%", avgDuration: "29:15", tier: "S-Tier", color: "#E4002B",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/T1_logo.svg/1200px-T1_logo.svg.png",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"]
  },
  "Gen.G": { 
    winRate: "82%", avgDuration: "30:45", tier: "S-Tier", color: "#AA8A00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Gen.G_logo.svg/1200px-Gen.G_logo.svg.png",
    players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"]
  },
  "G2 Esports": { 
    winRate: "72%", avgDuration: "29:50", tier: "S-Tier", color: "#000000",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
    players: ["BrokenBlade", "Yike", "Caps", "Hans Sama", "Mikyx"]
  },
  "Bilibili Gaming": { 
    winRate: "75%", avgDuration: "31:10", tier: "S-Tier", color: "#00A1D6",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Bilibili_Gaming_logo.svg/1200px-Bilibili_Gaming_logo.svg.png",
    players: ["Bin", "Xun", "knight", "Elk", "ON"]
  },
  "Fnatic": { 
    winRate: "62%", avgDuration: "30:55", tier: "S-Tier", color: "#FF4E00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Fnatic_logo.svg/1200px-Fnatic_logo.svg.png",
    players: ["Oscarinin", "Razork", "Humanoid", "Noah", "Jun"]
  },
  "Cloud9": { 
    winRate: "65%", avgDuration: "32:10", tier: "A-Tier", color: "#00AEEF",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Cloud9_logo.svg/1200px-Cloud9_logo.svg.png",
    players: ["Thanatos", "Blaber", "Jojopyun", "Berserker", "Vulcan"]
  },
  "Team Liquid": { 
    winRate: "58%", avgDuration: "31:45", tier: "S-Tier", color: "#00275D",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Team_Liquid_logo.svg/1200px-Team_Liquid_logo.svg.png",
    players: ["Impact", "UmTi", "APA", "Yeon", "CoreJJ"]
  },
  "Hanwha Life": { 
    winRate: "68%", avgDuration: "31:20", tier: "S-Tier", color: "#FF6B00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hanwha_Life_Esports_logo.svg/1200px-Hanwha_Life_Esports_logo.svg.png",
    players: ["Doran", "Peanut", "Zeka", "Viper", "Delight"]
  },
  "JD Gaming": { 
    winRate: "70%", avgDuration: "32:05", tier: "S-Tier", color: "#C8102E",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png",
    players: ["Flandre", "Kanavi", "Yagao", "Ruler", "Missing"]
  }
};

// Fill missing players for other teams
Object.keys(TEAM_STATS).forEach(team => {
  if (!TEAM_STATS[team].players) {
    TEAM_STATS[team].players = ROLES.map(role => `${team} ${role} Pro`);
  }
});
