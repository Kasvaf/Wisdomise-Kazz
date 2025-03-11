import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import GameAuthGuard from 'modules/base/mini-app/GameAuthGuard';
import Container from '../Container';
import { ActiveNetworkProvider } from '../active-network';

const PageGameReward = React.lazy(
  () => import('modules/autoTrader/PageGameRewards'),
);

const PageQuests = React.lazy(() => import('modules/quest/PageQuests'));

const PageTournamentDetail = React.lazy(
  () => import('modules/quest/PageTournaments/PageTournamentDetail'),
);

const PageTournaments = React.lazy(
  () => import('modules/quest/PageTournaments'),
);

const PageLeague = React.lazy(() => import('modules/quest/PageLeague'));

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
      path: '',
      children: [
        { path: '', element: <Navigate to={'coin-radar/overview' + qs} /> },
        {
          path: 'trader-claim-reward',
          element: (
            <ActiveNetworkProvider network="the-open-network" setOnLayout>
              <GameAuthGuard>
                <PageGameReward />
              </GameAuthGuard>
            </ActiveNetworkProvider>
          ),
        },
        {
          path: 'trader-quests',
          children: [
            { path: 'overview', element: <PageQuests /> },
            {
              path: 'tournaments',
              children: [
                { path: '', element: <PageTournaments /> },
                { path: ':id', element: <PageTournamentDetail /> },
              ],
            },
            {
              path: 'league',
              children: [{ path: '', element: <PageLeague /> }],
            },
          ],
        },
        {
          path: 'trader-positions',
          element: <PagePositions />,
        },
        {
          path: 'auto-trader',
          children: [
            {
              path: ':slug',
              element: <PageTrade />,
            },
            { path: ':slug/transactions', element: <PageTransactions /> },
          ],
        },
        { path: '*', element: <Navigate to="/coin-radar/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAutoTraderRoutes;
