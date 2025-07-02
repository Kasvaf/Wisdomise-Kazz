import { type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageDiscovery from 'modules/discovery/PageDiscovery';
import {
  groupDiscoveryRouteMeta,
  unGroupDiscoveryRouteMeta,
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
              const { list, slug, detail, view } = unGroupDiscoveryRouteMeta(
                s.get('ui') ?? '',
              );
              const matchedListTitle = menuItems.find(x => x.meta.list === list)
                ?.crumb;
              if (slug && view !== 'list') {
                const readableSlug = slug
                  .split('-')
                  .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
                  .join(' ');
                return detail === 'whale'
                  ? [
                      {
                        text: t('menu.whale.title'),
                        href: `/discovery?ui=${groupDiscoveryRouteMeta({
                          list: 'whale-radar',
                        })}`,
                      },
                      {
                        text: readableSlug,
                        href: `/discovery?ui=${groupDiscoveryRouteMeta({
                          list: 'whale-radar',
                          slug,
                        })}`,
                      },
                    ]
                  : [
                      {
                        text: t('menu.coin.title'),
                        href: `/discovery?ui=${groupDiscoveryRouteMeta({
                          list: 'coin-radar',
                        })}`,
                      },
                      {
                        text: readableSlug,
                        href: `/discovery?ui=${groupDiscoveryRouteMeta({
                          list: 'coin-radar',
                          slug,
                        })}`,
                      },
                    ];
              }
              return [
                {
                  text: t('menu.home.title'),
                  href: `/discovery?ui=${groupDiscoveryRouteMeta({
                    list: 'coin-radar',
                  })}`,
                },
                {
                  text: matchedListTitle,
                  href: `/discovery?ui=${groupDiscoveryRouteMeta({
                    list,
                  })}`,
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
