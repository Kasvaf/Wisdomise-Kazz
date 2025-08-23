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
          path: ':slug1',
          element: <PageDiscoveryListView />,
          handle: {
            crumb: p => {
              const list = p.slug1 as (typeof LISTS)[number] | undefined;
              if (!list) return [];
              return [
                {
                  text: t('menu.home.title'),
                  href: `/`,
                },
                {
                  text: readableParam(list),
                  href: `/${list}`,
                },
              ];
            },
          } satisfies RouteHandle,
        },
        {
          id: 'DiscoveryDetailView',
          path: ':detail/:slug1/:slug2?/:slug3?',
          element: <PageDiscoveryDetailView />,
          handle: {
            crumb: p => {
              const detail = p.detail as (typeof DETAILS)[number] | undefined;
              if (!detail) return [];
              const slugs = [p.slug1, p.slug2, p.slug3].filter(
                x => !!x,
              ) as string[];
              return [
                {
                  text: readableParam(detail),
                  href: '/',
                },
                ...slugs.map(
                  x =>
                    ({
                      text: readableParam(x),
                      href: `/${detail}/${slugs.join('/')}`,
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
