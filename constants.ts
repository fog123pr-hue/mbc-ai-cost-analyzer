
import { VideoStyle, Resolution, Urgency, ProductionParams } from './types';

export const INITIAL_PARAMS: ProductionParams = {
  style: VideoStyle.STOCK_FOOTAGE,
  lengthSeconds: 60,
  resolution: Resolution.FHD,
  urgency: Urgency.STANDARD,
  useAiTools: true,
  hasScript: false,
  hasVoiceover: false,
  complexity: 3,
};

export const CURRENCY_SYMBOL = '₩';
