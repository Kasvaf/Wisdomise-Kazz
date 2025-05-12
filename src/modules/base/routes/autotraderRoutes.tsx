import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import GameAuthGuard from 'modules/base/mini-app/GameAuthGuard';
import PageLeague from 'modules/quest/PageLeague';
import Container from '../Container';
import { ActiveNetworkProvider } from '../active-network';
import { type RouteHandle } from './types';

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
      handle: {
        crumb: {
          text: 'Auto Trader',
          href: '/trader/positions',
        },
      } satisfies RouteHandle,
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
          handle: {
            crumb: {
              text: 'Claim Reward',
              href: '/trader/claim-reward',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'quests',
          children: [
            {
              path: '',
              element: <PageQuests />,
              handle: {
                crumb: {
                  text: 'Earn & Win',
                  href: '/trader/quests',
                },
              } satisfies RouteHandle,
            },
            {
              path: 'tournaments',
              children: [
                {
                  path: '',
                  element: <PageTournaments />,
                  handle: {
                    crumb: {
                      text: 'Tournaments',
                      href: '/trader/tournaments',
                    },
                  } satisfies RouteHandle,
                },
                {
                  path: ':id',
                  element: <PageTournamentDetail />,
                  handle: {
                    crumb: p => ({
                      text: 'Tournaments',
                      href: `/trader/tournaments/${p.id as string}`,
                    }),
                  } satisfies RouteHandle,
                },
              ],
            },
            {
              path: 'league',
              children: [{ path: '', element: <PageLeague /> }],
            },
          ],
        },
        {
          path: 'positions',
          element: <PagePositions />,
          handle: {
            crumb: {
              text: 'Positions',
              href: '/trader/positions',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'bot',
          children: [
            {
              path: ':slug',
              element: <PageTrade />,
              handle: {
                crumb: p => ({
                  text: 'Trade',
                  href: `/trader/bot/${p.slug as string}`,
                }),
              } satisfies RouteHandle,
            },
            {
              path: ':slug/transactions',
              element: <PageTransactions />,
              handle: {
                crumb: p => ({
                  text: 'Transactions',
                  href: `/trader/bot/${p.slug as string}/transactions`,
                }),
              } satisfies RouteHandle,
            },
          ],
        },
        { path: '*', element: <Navigate to="/coin-radar/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAutoTraderRoutes;
