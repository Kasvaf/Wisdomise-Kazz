import * as React from 'react';
import { type RouteObject } from 'react-router-dom';
import TelegramContainer from 'modules/autoTrader/TelegramContainer';

const PageWaitlist = React.lazy(
  () => import('modules/autoTrader/PageWaitlist'),
);

const PageClaimReward = React.lazy(
  () => import('modules/autoTrader/PageClaimReward'),
);

const useMiniAppRoutes = () => {
  return [
    {
      element: <TelegramContainer />,
      path: '',
      children: [
        {
          path: '',
          element: <PageWaitlist />,
        },
        {
          path: 'claim-reward',
          element: <PageClaimReward />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useMiniAppRoutes;
