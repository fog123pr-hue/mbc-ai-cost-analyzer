
export enum VideoStyle {
  LIVE_ACTION = 'Live Action (촬영)',
  ANIMATION_2D = '2D Animation',
  ANIMATION_3D = '3D Animation',
  STOCK_FOOTAGE = 'Stock + Motion Graphics',
  AI_AVATAR = 'AI Avatar (가상인간)',
}

export enum Resolution {
  FHD = 'FHD (1080p)',
  UHD = '4K (UHD)',
  MOBILE = 'Vertical (Shorts/Reels)',
}

export enum Urgency {
  STANDARD = 'Standard (보통)',
  EXPRESS = 'Express (빠름)',
  RUSH = 'Rush (매우 빠름)',
}

export interface ProductionParams {
  style: VideoStyle;
  lengthSeconds: number;
  resolution: Resolution;
  urgency: Urgency;
  useAiTools: boolean;
  hasScript: boolean;
  hasVoiceover: boolean;
  complexity: number; // 1 to 5
}

export interface CostBreakdown {
  category: string;
  amount: number;
  description: string;
}

export interface EstimationResult {
  totalCost: number;
  currency: string;
  breakdown: CostBreakdown[];
  timelineDays: number;
  aiSavings: number;
  analysis: string;
}
