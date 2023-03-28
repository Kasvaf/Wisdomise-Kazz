import { ReactNode } from 'react';

export interface Tab {
  id: TabLabels;
  description: string | ReactNode;
  hash: 'WisdomiseAI' | 'AIautoTrader';
  label: string;
  icon: ReactNode;
  actionLabel?: string;
  hidden?: boolean;
  comingSoon?: boolean;
  defaultUrl: string;
  button?: boolean;
  className?: string;
  subMenu?: Tab[];
}

// export enum TabLabels {
//   dashboard = 'dashboard',
//   signals = 'signals',
//   analytics = 'analytics',
//   referral = 'referral',
//   autoTrader = 'auto trader',
//   catalog = 'catalog',
//   transactions = 'transactions',
// }

export enum TabLabels {
  dashboard = 'dashboard',
  WisdomiseAI = 'Wisdomise AI',
  signals = 'signals',
  backtest = 'Backtests ',
  AIautoTrader = 'AI auto trader',
  strategyCatalog = 'Strategy Catalog',
  advanceTrading = 'Advanced Trading',
  sentiment = 'sentiment',
  referralProgram = 'Referral Program',
}

export interface Tabs {
  [TabLabels.dashboard]: Tab;
  [TabLabels.WisdomiseAI]: Tab;
  [TabLabels.signals]: Tab;
  [TabLabels.backtest]: Tab;
  [TabLabels.AIautoTrader]: Tab;
  [TabLabels.strategyCatalog]: Tab;
  [TabLabels.advanceTrading]: Tab;
  [TabLabels.referralProgram]: Tab;
}

// export interface Tabs {
//   [TabLabels.dashboard]: Tab;
//   [TabLabels.signals]: Tab;
//   [TabLabels.analytics]: Tab;
//   [TabLabels.referral]: Tab;
//   [TabLabels.autoTrader]: Tab;
//   [TabLabels.catalog]: Tab;
//   [TabLabels.transactions]: Tab;
// }

export interface DataRendererType {
  walletConnected: boolean;
  data: unknown[];
  view: ReactNode;
  message?: string;
}
