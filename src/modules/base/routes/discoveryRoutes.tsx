import { type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageDiscovery from 'modules/discovery/PageDiscovery';
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
              const matchedList = s.get('list') ?? 'coin-radar';
              const matchedListTitle = menuItems.find(
                x => x.meta.list === matchedList,
              )?.crumb;
              const slug = s.get('slug');
              if (slug) {
                const readableSlug = slug
                  .split('-')
                  .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
                  .join(' ');
                return s.get('detail') === 'whale'
                  ? [
                      {
                        text: t('menu.whale.title'),
                        href: '/discovery?list=whale-radar',
                      },
                      {
                        text: readableSlug,
                        href: `/discovery?detail=whale&slug=${slug}`,
                      },
                    ]
                  : [
                      {
                        text: t('menu.coin.title'),
                        href: '/discovery?list=coin-radar',
                      },
                      {
                        text: readableSlug,
                        href: `/discovery?detail=coin&slug=${slug}`,
                      },
                    ];
              }
              return [
                {
                  text: t('menu.home.title'),
                  href: '/discovery?list=coin-radar',
                },
                {
                  text: matchedListTitle,
                  href: `/discovery?list=${matchedList}`,
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
