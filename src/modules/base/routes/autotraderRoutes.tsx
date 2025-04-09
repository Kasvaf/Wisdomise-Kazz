import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import GameAuthGuard from 'modules/base/mini-app/GameAuthGuard';
import Container from '../Container';
import { ActiveNetworkProvider } from '../active-network';

const PageGameReward = React.lazy(
  () => import('modules/autoTrader/PageGameRewards'),
);

const PageQuests = React.lazy(() => import('modules/autoTrader/PageQuests'));

const PageTournamentDetail = React.lazy(
  () =>
    import('../../autoTrader/PageQuests/PageTournaments/PageTournamentDetail'),
);

const PageTournaments = React.lazy(
  () => import('modules/autoTrader/PageQuests/PageTournaments'),
);

const PagePositions = React.lazy(
  () => import('modules/autoTrader/PagePositions'),
);

const PageTransactions = React.lazy(
  () => import('modules/autoTrader/PageTransactions'),
);

const PageTrade = React.lazy(() => import('modules/autoTrader/PageTrade'));

const useAutoTraderRoutes = () => {
  const qs = location.search.includes('utm_campaign') ? location.search : '';

  return [
    {
      element: <Container />,
      path: 'trader',
      handle: { crumb: 'Auto Trader', alt: '/trader/positions' },
      children: [
        {
          path: '',
          element: <Navigate to={'/trader/positions' + qs} replace />,
        },
        {
          path: 'claim-reward',
          element: (
            <ActiveNetworkProvider network="the-open-network" setOnLayout>
              <GameAuthGuard>
                <PageGameReward />
              </GameAuthGuard>
            </ActiveNetworkProvider>
          ),
          handle: { crumb: 'Claim Reward' },
        },
        {
          path: 'quests',
          children: [
            {
              path: '',
              element: <PageQuests />,
              handle: { crumb: 'Quests' },
            },
            {
              path: 'tournaments',
              children: [
                {
                  path: '',
                  element: <PageTournaments />,
                  handle: { crumb: 'Tournaments' },
                },
                {
                  path: ':id',
                  element: <PageTournamentDetail />,
                  handle: { crumb: 'Tournaments' },
                },
              ],
            },
          ],
        },
        {
          path: 'positions',
          element: <PagePositions />,
          handle: { crumb: 'Positions' },
        },
        {
          path: 'bot',
          children: [
            {
              path: ':slug',
              element: <PageTrade />,
              handle: { crumb: 'Trade' },
            },
            {
              path: ':slug/transactions',
              element: <PageTransactions />,
              handle: { crumb: 'Transactions' },
            },
          ],
        },
        { path: '*', element: <Navigate to="/coin-radar/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAutoTraderRoutes;
