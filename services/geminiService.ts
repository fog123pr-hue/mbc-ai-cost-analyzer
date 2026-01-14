
import { GoogleGenAI, Type } from "@google/genai";
import { ProductionParams, EstimationResult } from "../types";

export const estimateProductionCost = async (params: ProductionParams): Promise<EstimationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    영상 제작 전문가로서 다음의 파라미터를 바탕으로 상세한 영상 제작 원가 및 예상 견적을 계산해줘.
    
    파라미터:
    - 스타일: ${params.style}
    - 영상 길이: ${params.lengthSeconds}초
    - 해상도: ${params.resolution}
    - 긴급도: ${params.urgency}
    - AI 도구 활용 여부: ${params.useAiTools ? '예' : '아니오'}
    - 시나리오 유무: ${params.hasScript ? '있음' : '없음'}
    - 나레이션(Voiceover) 유무: ${params.hasVoiceover ? '있음' : '없음'}
    - 복잡도: ${params.complexity}/5
    
    요구사항:
    1. 한국 원화(KRW) 기준으로 계산할 것.
    2. AI 도구 활용 시 인건비 절감 효과를 반영할 것.
    3. 기획, 촬영/소스 확보, 편집, CG/효과, 사운드 믹싱 등으로 세부 항목을 나눌 것.
    4. 분석 내용(analysis)에는 비용 산출 근거를 구체적으로 설명할 것.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalCost: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["category", "amount", "description"]
            }
          },
          timelineDays: { type: Type.NUMBER },
          aiSavings: { type: Type.NUMBER },
          analysis: { type: Type.STRING }
        },
        required: ["totalCost", "currency", "breakdown", "timelineDays", "aiSavings", "analysis"]
      }
    }
  });

  return JSON.parse(response.text);
};
