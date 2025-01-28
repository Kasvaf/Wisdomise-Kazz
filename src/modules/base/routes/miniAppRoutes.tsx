import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import TelegramContainer from 'modules/autoTrader/layout/TelegramContainer';
import TelegramLayout from 'modules/autoTrader/layout/TelegramLayout';
import GameAuthGuard from 'modules/autoTrader/layout/GameAuthGuard';

const PageHome = React.lazy(() => import('modules/autoTrader/PageHome'));

const PageClaimReward = React.lazy(
  () => import('modules/autoTrader/PageClaimReward'),
);

const TournamentsLayout = React.lazy(
  () => import('modules/autoTrader/PageTournaments/TournamentsLayout'),
);

const PageTournaments = React.lazy(
  () => import('modules/autoTrader/PageTournaments'),
);

const PageTournamentDetail = React.lazy(
  () => import('modules/autoTrader/PageTournaments/PageTournamentDetail'),
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

const PageAlerts = React.lazy(() => import('modules/alert/PageAlerts'));

const useMiniAppRoutes = () => {
  const qs = location.search.includes('utm_campaign') ? location.search : '';

  return [
    {
      element: <TelegramContainer />,
      path: '',
      children: [
        { path: '', element: <Navigate to={'trader-home' + qs} /> },
        {
          path: '',
          element: <TelegramLayout />,
          children: [
            {
              path: 'trader-home',
              element: <PageHome />,
            },
            {
              path: 'trader-alerts',
              element: <PageAlerts />,
            },
            {
              path: 'trader-claim-reward',
              element: (
                <GameAuthGuard>
                  <PageClaimReward />
                </GameAuthGuard>
              ),
            },
            {
              path: 'trader-tournaments',
              element: <TournamentsLayout />,
              children: [
                { path: '', element: <PageTournaments /> },
                { path: ':id', element: <PageTournamentDetail /> },
              ],
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
              path: 'market/:slug',
              element: <PageTrade />,
              handle: { wallet: true },
            },
          ],
        },
        { path: '*', element: <Navigate to="/trader-hot-coins" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useMiniAppRoutes;
