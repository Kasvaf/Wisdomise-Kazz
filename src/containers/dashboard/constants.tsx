import ADA from "@images/coins/ada.svg";
import BNB from "@images/coins/bnb.svg";
import BTC from "@images/coins/btc.svg";
import DOGE from "@images/coins/doge.svg";
import ETH from "@images/coins/eth.svg";
import LTC from "@images/coins/ltc.svg";
import TRX from "@images/coins/trx.svg";
import XRP from "@images/coins/xrp.svg";
import USDT from "@images/coins/usdt.svg";
import BUSD from "@images/coins/busd.svg";

import { ReactComponent as DashboardIcon } from "@images/nav/dashboard.svg";
import { ReactComponent as CatalogIcon } from "@images/nav/portfolio.svg";
// import { ReactComponent as Analytics } from "@images/nav/analytics.svg";
import { ReactComponent as SignalsIcon } from "@images/nav/signals.svg";
import { ReactComponent as TradingIcon } from "@images/nav/trading.svg";
// import { ReactComponent as ReferralIcon } from '@images/nav/referral.svg';

import { TablePaginationConfig } from "antd";
import { TabLabels } from "./types";

export const K_FORMAT = "0.0a";

export const coins: { [key: string]: { name: string; icon: string } } = {
  ADA: {
    name: "ADA",
    icon: ADA,
  },
  BNB: {
    name: "BNB",
    icon: BNB,
  },
  BTC: {
    name: "BTC",
    icon: BTC,
  },
  DOGE: {
    name: "DOGE",
    icon: DOGE,
  },
  ETH: {
    name: "ETH",
    icon: ETH,
  },
  LTC: {
    name: "LTC",
    icon: LTC,
  },
  TRX: {
    name: "TRON",
    icon: TRX,
  },
  XRP: {
    name: "XRP",
    icon: XRP,
  },
  USDT: {
    name: "USDT",
    icon: USDT,
  },
  BUSD: {
    name: "BUSD",
    icon: BUSD,
  },
};

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_FORMAT_ALT = "MMM DD, YYYY";
export const TIME_FORMAT = " h:mm:ss A";

export const SignalNotificationTypes = [
  {
    label: "NEW",
    value: "newSignal",
  },
  {
    label: "UPDATED",
    value: "updatedSignal",
  },
  {
    label: "CLOSE",
    value: "closeSignal",
  },
];

export const paginationConfig: TablePaginationConfig = {
  pageSize: 10,
  showSizeChanger: false,
  position: ["bottomLeft"],
  className: "sticky md:relative",
};

export const previewPaginationConfig: TablePaginationConfig = {
  position: [],
};

// Dashboard navbar tabs config
export const tabs: any = {
  [TabLabels.dashboard]: {
    id: TabLabels.dashboard,
    description: "Explore Horos features to start generating wealth",
    hash: "dash",
    label: "Dashboard",
    icon: <DashboardIcon fill="#d9d9d9" className="dashboard-icon h-6 w-6" />,
    defaultUrl: "dashboard",
  },

  [TabLabels.strategyCatalog]: {
    id: TabLabels.strategyCatalog,
    description:
      "Compare analytics and benchmark the performance of your portfolio based on the selected asset and strategy",
    hash: "catalog",
    label: "Strategy Catalog",
    icon: <CatalogIcon className="dashboard-icon h-6 w-6" />,
    actionLabel: "Learn more",
    defaultUrl: "strategyCatalog",
  },

  // [TabLabels.signals]: {
  //   id: TabLabels.signals,
  //   description: (
  //     <span>
  //       Horos AI Market Signaler (Horos AMS) is vigilantly watching the market
  //       <br />
  //       to identify opportune market signals
  //     </span>
  //   ),
  //   hash: 'sign',
  //   label: 'AI Market Predictions',
  //   icon: <SignalsIcon className="dashboard-icon" />,
  //   actionLabel: 'Scan now',
  //   defaultUrl: 'signals',
  // },

  // [TabLabels.analytics]: {
  //   id: TabLabels.analytics,
  //   description: (
  //     <span>
  //       Horos AI Market Signaler (Horos AMS) is vigilantly watching the market
  //       <br />
  //       to identify opportune market signals
  //     </span>
  //   ),
  //   hash: 'sign',
  //   label: 'analytics',
  //   icon: <SignalsIcon className="dashboard-icon" />,
  //   actionLabel: 'Scan now',
  //   defaultUrl: 'analytics',
  // },

  [TabLabels.WisdomiseAI]: {
    id: TabLabels.WisdomiseAI,
    description: "",
    hash: "WisdomiseAI",
    label: "Intelligence services",
    icon: <SignalsIcon className="dashboard-icon h-6 w-6" />,
    defaultUrl: "s",
    subMenu: [
      // {
      //   id: TabLabels.signals,
      //   hash: "sign",
      //   label: "AI Signals",
      //   icon: <Analytics className="dashboard-icon h-6 w-6" />,
      //   actionLabel: "Scan now",
      //   defaultUrl: "signals",
      // },
      {
        id: TabLabels.backtest,
        hash: "Backtest",
        label: "Backtest ",
        icon: <SignalsIcon className="dashboard-icon h-6 w-6" />,
        actionLabel: "Backtest",
        defaultUrl: "backtest",
      },
      // {
      //   id: TabLabels.sentiment,
      //   hash: 'sentiment',
      //   label: 'Market Sentiment',
      //   icon: <Analytics className="dashboard-icon h-6 w-6" />,
      //   actionLabel: 'sentiment',
      //   defaultUrl: 'sentiment',
      //   comingSoon: true,
      // },
      // {
      //   id: TabLabels.transactions,
      //   description: 'Explore Horos features to start generating wealth',
      //   hash: 'dash',
      //   label: 'transactions',
      //   icon: <TransactionIcon className="dashboard-icon" />,
      //   defaultUrl: 'transactions',
      // },
      // {
      //   id: TabLabels.catalog,
      //   description:
      //     'Compare analytics and benchmark the performance of your portfolio based on the selected asset and strategy',
      //   hash: 'catalog',
      //   label: 'catalog',
      //   icon: <SignalsIcon className="dashboard-icon" />,
      //   actionLabel: 'Learn more',
      //   defaultUrl: 'catalog',
      // },
    ],
  },

  [TabLabels.advanceTrading]: {
    id: TabLabels.advanceTrading,
    description: (
      <span>
        Wisdomise AI Market Signaler (Horos AMS) is vigilantly watching the
        market
        <br />
        to identify opportune market signals
      </span>
    ),
    hash: "sign",
    label: "Advanced Trading",
    icon: <TradingIcon className="dashboard-icon h-6 w-6" />,
    actionLabel: "Scan now",
    defaultUrl: "analytics",
    comingSoon: true,
  },

  // [TabLabels.AIautoTrader]: {
  //   id: TabLabels.AIautoTrader,
  //   description: '',
  //   hash: 'AIautoTrader',
  //   label: 'AI Auto Trader',
  //   icon: <SignalsIcon className="dashboard-icon h-6 w-6" />,
  //   defaultUrl: 'x',
  //   subMenu: [

  //     {
  //       id: TabLabels.advanceTrading,
  //       description: (
  //         <span>
  //           Wisdomise AI Market Signaler (Horos AMS) is vigilantly watching the
  //           market
  //           <br />
  //           to identify opportune market signals
  //         </span>
  //       ),
  //       hash: 'sign',
  //       label: 'Advanced Trading',
  //       icon: <TradingIcon className="dashboard-icon h-6 w-6" />,
  //       actionLabel: 'Scan now',
  //       defaultUrl: 'analytics',
  //       comingSoon: true,
  //     },
  //   ],
  // },

  // [TabLabels.settings]: {
  //   id: TabLabels.settings,
  //   description: 'Set and edit Horos preferences and notifications',
  //   hash: 'settings',
  //   label: 'Settings',
  //   icon: <CogIcon className="dashboard-icon" />,
  //   hidden: true,
  //   defaultUrl: 'settings/general',
  // },
  // [TabLabels.logout]: {
  //   id: TabLabels.logout,
  //   description: '',
  //   hash: 'logout',
  //   label: 'Log out',
  //   icon: <LogoutIcon className="dashboard-icon" />,
  //   hidden: true,
  //   button: true,
  //   defaultUrl: '',
  //   className: 'text-error fill-error',
  // },
};
