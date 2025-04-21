import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as IconHome } from './icons/home.svg';
import { ReactComponent as IconSocial } from './icons/social.svg';
import { ReactComponent as IconTechnical } from './icons/technical.svg';
import { ReactComponent as IconWhale } from './icons/whale.svg';
import { ReactComponent as IconTrench } from './icons/trench.svg';

interface MenuItem {
  text: string | ReactElement;
  link: string;
  hide?: boolean;
  badge?: 'beta' | 'new';
  onClick?: () => void;
}

export interface RootMenuItem extends MenuItem {
  name: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const useMenuItems = () => {
  const { t } = useTranslation('base');
  const items: RootMenuItem[] = [
    {
      name: 'coin-radar',
      icon: <IconHome />,
      text: (
        <div className="flex items-center gap-0.5">
          {t('menu.home.titleM')}
          <span className="mt-0.5 font-semibold">+</span>
        </div>
      ),
      link: '/coin-radar/overview',
    },
    {
      name: 'network-radar',
      icon: <IconTrench />,
      text: t('menu.trench.title'),
      link: '/coin-radar/network-radar',
    },
    {
      name: 'social-radar',
      icon: <IconSocial />,
      text: t('menu.social.title'),
      link: '/coin-radar/social-radar',
    },
    {
      name: 'technical-radar',
      icon: <IconTechnical />,
      text: t('menu.technical.title'),
      link: '/coin-radar/technical-radar',
    },
    {
      name: 'whale-radar',
      icon: <IconWhale />,
      text: t('menu.whale.title'),
      link: '/coin-radar/whale-radar',
    },
  ];
  return { items };
};

export default useMenuItems;
