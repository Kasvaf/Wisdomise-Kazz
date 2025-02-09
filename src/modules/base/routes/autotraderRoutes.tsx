import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import GameAuthGuard from 'modules/base/mini-app/GameAuthGuard';
import Container from '../Container';

const PageClaimReward = React.lazy(
  () => import('modules/autoTrader/PageClaimReward'),
);

const PageQuests = React.lazy(() => import('modules/autoTrader/PageQuests'));

const PageTournamentDetail = React.lazy(
  () => import('modules/autoTrader/PageQuests/PageTournamentDetail'),
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
          handle: { wallet: 'the-open-network' },
          element: (
            <GameAuthGuard>
              <PageClaimReward />
            </GameAuthGuard>
          ),
        },
        {
          path: 'trader-quests',
          children: [
            { path: '', element: <PageQuests /> },
            {
              path: 'tournaments',
              children: [{ path: ':id', element: <PageTournamentDetail /> }],
            },
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
          path: 'auto-trader/:slug',
          element: <PageTrade />,
          handle: {
            wallet: (params: any, query: any) => [
              params.slug,
              query.quote || 'tether',
            ],
          },
        },
        { path: '*', element: <Navigate to="/trader-hot-coins" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAutoTraderRoutes;
