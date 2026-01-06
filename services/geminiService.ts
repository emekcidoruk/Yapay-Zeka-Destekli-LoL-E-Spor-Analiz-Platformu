
import { GoogleGenAI, Type } from "@google/genai";
import { MatchData, AnalysisResult } from "../types";
import { TEAM_STATS } from "../data/matchHistory";

const analysisCache: Record<string, AnalysisResult> = {};

const getCompactContext = () => {
  const teams = Object.keys(TEAM_STATS).map(t => ({
    n: t, 
    wr: TEAM_STATS[t].winRate, 
    tr: TEAM_STATS[t].tier,
    pl: TEAM_STATS[t].players
  }));
  return `Context: ${JSON.stringify(teams)}`;
};

/**
 * Kota kontrolü yapan yardımcı fonksiyon
 */
const handleApiError = (error: any) => {
  console.error("Gemini Error Detail:", error);
  const errorMsg = error?.message || "";
  if (errorMsg.includes("429") || errorMsg.includes("QUOTA") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
    throw new Error("QUOTA_EXCEEDED");
  }
  throw error;
};

export const analyzeMatch = async (match: MatchData): Promise<AnalysisResult> => {
  // Cache key version bumped to v3 to force re-analysis with new strict prompt
  const cacheKey = `v3-${match.blueTeam.name}-${match.redTeam.name}`;
  if (analysisCache[cacheKey]) return analysisCache[cacheKey];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `Sen elit bir LoL e-spor analistisin. 
    Mavi: ${match.blueTeam.name}, Kırmızı: ${match.redTeam.name} eşleşmesini analiz et.
    Context: ${getCompactContext()}
    
    Analizinde şunları sağla:
    1. Oyunun 3 ana evresi (Early, Mid, Late) için stratejik öngörü.
    2. Her takım için 3 adet taktiksel oyun tarzı etiketi (örn: 'Scaling', 'Heavy Engage', 'Objective Focused').
    3. Koridor bazlı detaylı avantaj analizi. 
       - "lane" alanı için KESİNLİKLE şu değerleri kullan: 'TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'.
       - "advantage" alanı için KESİNLİKLE şu değerleri kullan: 'BLUE', 'RED', 'EVEN'.
    
    Yanıt kesinlikle JSON olmalı.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winCondition: { type: Type.STRING },
            mvp: { type: Type.STRING },
            criticalMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            winProbability: {
              type: Type.OBJECT,
              properties: { blue: { type: Type.NUMBER }, red: { type: Type.NUMBER } },
              required: ["blue", "red"]
            },
            laneMatchups: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  lane: { type: Type.STRING, description: "Must be one of: TOP, JUNGLE, MID, ADC, SUPPORT" },
                  advantage: { type: Type.STRING, description: "Must be one of: BLUE, RED, EVEN" },
                  reason: { type: Type.STRING }
                }
              }
            },
            tacticalBreakdown: {
              type: Type.OBJECT,
              properties: {
                earlyGame: { type: Type.STRING },
                midGame: { type: Type.STRING },
                lateGame: { type: Type.STRING }
              }
            },
            teamStyles: {
              type: Type.OBJECT,
              properties: {
                blue: { type: Type.ARRAY, items: { type: Type.STRING } },
                red: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["summary", "winCondition", "mvp", "winProbability", "laneMatchups", "tacticalBreakdown", "teamStyles"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as AnalysisResult;
    analysisCache[cacheKey] = result;
    return result;
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const analyzeDraft = async (bluePicks: string[], redPicks: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `LoL Draft Analizi: Mavi: ${bluePicks.join(", ")} vs Kırmızı: ${redPicks.join(", ")}. Stratejik derinlikli Türkçe analiz yap.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text;
  } catch (error) { 
    return handleApiError(error);
  }
};

export const chatWithAnalyst = async (history: any[], teamA?: string, teamB?: string, playerA?: string, playerB?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = `Mavi: ${teamA || 'N/A'}, Kırmızı: ${teamB || 'N/A'}. Oyuncular: ${playerA || 'N/A'} vs ${playerB || 'N/A'}.`;
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history.slice(0, -1),
      config: { systemInstruction: `Sen Nexus analistisin. Profesyonel Türkçe konuş. Context: ${context}` }
    });
    const result = await chat.sendMessage({ message: history[history.length - 1].parts[0].text });
    return result.text;
  } catch (error) { 
    return handleApiError(error);
  }
};
