import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import TelegramContainer from 'modules/autoTrader/TelegramContainer';
import { TelegramLayout } from 'modules/autoTrader/TelegramLayout';
import GameAuthGuard from 'modules/autoTrader/GameAuthGuard';

const PageOnboarding = React.lazy(
  () => import('modules/autoTrader/PageOnboarding'),
);

const PageClaimReward = React.lazy(
  () => import('modules/autoTrader/PageClaimReward'),
);

const PageHotCoins = React.lazy(
  () => import('modules/autoTrader/PageHotCoins'),
);

const PagePositions = React.lazy(
  () => import('modules/autoTrader/PagePositions'),
);

const PageTransactions = React.lazy(
  () => import('modules/autoTrader/PageTransactions'),
);

const PageCoinDetail = React.lazy(
  () => import('modules/autoTrader/PageCoinDetail'),
);

const PageTrade = React.lazy(() => import('modules/autoTrader/PageTrade'));

const useMiniAppRoutes = () => {
  return [
    {
      element: <TelegramContainer />,
      path: '',
      children: [
        { path: '', element: <Navigate to="hot-coins" /> },
        {
          path: 'onboarding',
          element: <PageOnboarding />,
        },
        {
          path: '',
          element: <TelegramLayout />,
          children: [
            {
              path: 'trader-claim-reward',
              element: (
                <GameAuthGuard>
                  <PageClaimReward />
                </GameAuthGuard>
              ),
            },
            {
              path: 'trader-positions',
              element: <PagePositions />,
            },
            {
              path: 'trader-hot-coins',
              children: [
                { path: '', element: <PageHotCoins /> },
                { path: ':slug', element: <PageCoinDetail /> },
                { path: ':slug/transactions', element: <PageTransactions /> },
              ],
            },
            {
              path: 'market',
              children: [
                {
                  path: ':slug',
                  children: [
                    { path: '', element: <PageTrade /> },
                    { path: 'positions/:slug', element: <PageTrade /> },
                  ],
                },
              ],
            },
          ],
        },
        { path: '*', element: <Navigate to="/trader-hot-coins" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useMiniAppRoutes;
