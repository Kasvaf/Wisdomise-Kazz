import { type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageApp from 'modules/app/PageApp';
import Container from '../Container';
import { useMenuItems } from '../Layout/MenuItems/useMenuItems';
import { type RouteHandle } from './types';

const useAppRoutes = () => {
  const menuItems = useMenuItems();
  const { t } = useTranslation('base');
  return [
    {
      path: '',
      element: <Container />,
      children: [
        {
          path: '',
          element: <PageApp />,
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
                        href: '/?list=whale-radar',
                      },
                      {
                        text: readableSlug,
                        href: `/?detail=whale&slug=${slug}`,
                      },
                    ]
                  : [
                      {
                        text: t('menu.coin.title'),
                        href: '/?list=coin-radar',
                      },
                      {
                        text: readableSlug,
                        href: `/?detail=coin&slug=${slug}`,
                      },
                    ];
              }
              return [
                {
                  text: t('menu.home.title'),
                  href: '/?list=coin-radar',
                },
                {
                  text: matchedListTitle,
                  href: `/?list=${matchedList}`,
                },
              ];
            },
          } satisfies RouteHandle,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAppRoutes;
