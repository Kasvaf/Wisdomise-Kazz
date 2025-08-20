import { type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageDiscovery from 'modules/discovery/PageDiscovery';
import {
  createDiscoverySearchParams,
  parseDiscoverySearchParams,
} from 'modules/discovery/useDiscoveryRouteMeta';
import Container from '../Container';
import { useMenuItems } from '../Layout/MenuItems/useMenuItems';
import { type RouteHandle } from './types';

const useDiscoveryRoutes = () => {
  const menuItems = useMenuItems();
  const { t } = useTranslation('base');
  return [
    {
      path: 'discovery',
      element: <Container />,
      children: [
        {
          path: '',
          element: <PageDiscovery />,
          handle: {
            crumb: (_p, s) => {
              const { list, slug, detail, view } =
                parseDiscoverySearchParams(s);
              const matchedListTitle = menuItems.find(
                x => x.meta.list === list,
              )?.crumb;
              if (slug && view !== 'list') {
                const readableSlug = slug
                  .split('-')
                  .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
                  .join(' ');
                return detail === 'whale'
                  ? [
                      {
                        text: t('menu.whale.title'),
                        href: `/discovery?${createDiscoverySearchParams({
                          list: 'whale-radar',
                        }).toString()}`,
                      },
                      {
                        text: readableSlug,
                        href: `/discovery?${createDiscoverySearchParams({
                          list: 'whale-radar',
                          slug,
                        }).toString()}`,
                      },
                    ]
                  : detail === 'wallet'
                    ? [
                        {
                          text: 'Wallets',
                          href: '',
                        },
                        {
                          text: slug,
                          href: '',
                        },
                      ]
                    : [
                        {
                          text: t('menu.coin.title'),
                          href: `/discovery?${createDiscoverySearchParams({
                            list: 'coin-radar',
                          }).toString()}`,
                        },
                        {
                          text: readableSlug,
                          href: `/discovery?${createDiscoverySearchParams({
                            list: 'coin-radar',
                            slug,
                          }).toString()}`,
                        },
                      ];
              }
              return [
                {
                  text: t('menu.home.title'),
                  href: `/discovery?${createDiscoverySearchParams({
                    list: 'coin-radar',
                  }).toString()}`,
                },
                {
                  text: matchedListTitle,
                  href: `/discovery?${createDiscoverySearchParams({
                    list,
                  }).toString()}`,
                },
              ];
            },
          } satisfies RouteHandle,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
