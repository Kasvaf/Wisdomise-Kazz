// Trend Icons
import { ReactComponent as Hype } from './hype.svg';
import { ReactComponent as WeeklySocialBeloved } from './weekly_social_beloved.svg';
import { ReactComponent as MonthlySocialBeloved } from './monthly_social_beloved.svg';
import { ReactComponent as UptrendConfirmation } from './uptrend_confirmation.svg';
import { ReactComponent as DowntrendConfirmation } from './downtrend_confirmation.svg';
import { ReactComponent as BullishCheap } from './bullish_cheap.svg';
import { ReactComponent as BearishOverprices } from './bearish_overpriced.svg';
import { ReactComponent as OversoldOpportunity } from './oversold_opportunity.svg';
import { ReactComponent as OverboughtRisk } from './overbought_risk.svg';
import { ReactComponent as StrongBullishDivergence } from './strong_bullish_divergence.svg';
import { ReactComponent as StrongBearishDivergence } from './strong_bearish_divergence.svg';
// Security Icons
import { ReactComponent as Trusted } from './trusted.svg';
import { ReactComponent as Warning } from './warning.svg';
import { ReactComponent as Risk } from './risk.svg';
// Custom Icons
import { ReactComponent as NewBorn } from './new_born.svg';
import { ReactComponent as CoinGecko } from './coingecko.svg';

const trendIcons = {
  hype: Hype,
  weekly_social_beloved: WeeklySocialBeloved,
  monthly_social_beloved: MonthlySocialBeloved,
  long_term_uptrend_confirmation: UptrendConfirmation,
  long_term_downtrend_confirmation: DowntrendConfirmation,
  long_term_bullish_cheap: BullishCheap,
  long_term_bearish_overpriced: BearishOverprices,
  long_term_oversold_opportunity: OversoldOpportunity,
  long_term_overbought_risk: OverboughtRisk,
  short_term_uptrend_confirmation: UptrendConfirmation,
  short_term_downtrend_confirmation: DowntrendConfirmation,
  short_term_bullish_cheap: BullishCheap,
  short_term_bearish_overpriced: BearishOverprices,
  short_term_oversold_opportunity: OversoldOpportunity,
  short_term_overbought_risk: OverboughtRisk,
  strong_bullish_divergence: StrongBullishDivergence,
  strong_bearish_divergence: StrongBearishDivergence,
  new_born: NewBorn,
  coingecko: CoinGecko,
};

export const securityIcons = {
  trusted: Trusted,
  warning: Warning,
  risk: Risk,
};

export const icons = {
  ...trendIcons,
  ...securityIcons,
};
