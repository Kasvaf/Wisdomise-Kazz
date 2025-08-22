import type { DETAILS, LISTS } from 'modules/discovery/constants';
import PageDiscoveryDetailView from 'modules/discovery/PageDiscoveryDetailView';
import PageDiscoveryListView from 'modules/discovery/PageDiscoveryListView';
import { useTranslation } from 'react-i18next';
import type { RouteObject } from 'react-router-dom';
import Container from '../Container';
import type { Crumb, RouteHandle } from './types';

const readableParam = (x: string) => {
  return x
    .split('-')
    .map(y => `${y[0].toUpperCase()}${y.slice(1)}`)
    .join(' ');
};

const useDiscoveryRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      path: 'discovery',
      element: <Container />,
      children: [
        {
          id: 'DiscoveryListView',
          path: ':list',
          element: <PageDiscoveryListView />,
          handle: {
            crumb: p => {
              const list = p.list as keyof typeof LISTS | undefined;
              if (!list) return [];
              return [
                {
                  text: t('menu.home.title'),
                  href: `/`,
                },
                {
                  text: readableParam(list),
                  href: `/list/${list}`,
                },
              ];
            },
          } satisfies RouteHandle,
        },
        {
          id: 'DiscoveryDetailView',
          path: ':detail/:param1/:param2?/:param3?',
          element: <PageDiscoveryDetailView />,
          handle: {
            crumb: p => {
              const detail = p.detail as keyof typeof DETAILS | undefined;
              if (!detail) return [];
              const params = [p.param1, p.param2, p.param3].filter(
                x => !!x,
              ) as string[];
              return [
                {
                  text: readableParam(detail),
                  href: '/',
                },
                ...params.map(
                  x =>
                    ({
                      text: readableParam(x),
                      href: `/${detail}/${params.join('/')}`,
                    }) as Crumb,
                ),
              ];
            },
          } satisfies RouteHandle,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
