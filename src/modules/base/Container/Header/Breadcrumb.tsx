import { clsx } from 'clsx';
import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from 'antd';
import { type Params, useLocation, useMatches, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { MAIN_LANDING } from 'config/constants';
import Logo from 'assets/WisdomiseLogo.svg';
import useIsMobile from 'utils/useIsMobile';
import { useSubscription } from 'api';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useMenuItems from '../useMenuItems';
import { ReactComponent as ProIcon } from './pro.svg';

interface Handle {
  crumb?: string | React.ReactNode | ((params: Params<string>) => string);
}

const itemRender: BreadcrumbProps['itemRender'] = ({ href, title }) =>
  href ? <Link to={href}>{title}</Link> : <span>{title}</span>;

const useRouteParent = () => {
  const { pathname } = useLocation();
  const { items } = useMenuItems();
  const itemsByPath = useMemo(() => {
    return Object.fromEntries(
      items.flatMap(
        parent =>
          parent.children?.map(child => [child.link, { child, parent }]) ?? [],
      ),
    );
  }, [items]);
  return itemsByPath[pathname];
};

const Breadcrumb: React.FC<{
  showLogo?: boolean;
  className?: string;
}> = ({ showLogo, className }) => {
  const { pathname } = useLocation();
  const isLoggedIn = useIsLoggedIn();
  const matches = useMatches();
  const items = matches
    .filter(x => (x.handle as Handle | undefined)?.crumb)
    .map(item => {
      const { crumb } = item.handle as Handle;
      return {
        href: item.pathname === pathname ? undefined : item.pathname,
        title: typeof crumb === 'function' ? crumb(item.params) : crumb,
      };
    });
  const subscription = useSubscription();

  const { i18n } = useTranslation();
  const { parent, child } = useRouteParent() ?? {};
  if (useIsMobile()) {
    if (parent && child && !showLogo) {
      return (
        <div className={clsx('ml-2 flex items-center text-white', className)}>
          {child.text}
        </div>
      );
    }

    return (
      <a
        href={MAIN_LANDING(i18n.language)}
        className={clsx('flex shrink-0 items-center gap-1', className)}
      >
        <img src={Logo} />
        {subscription.level !== 0 && isLoggedIn && (
          <ProIcon className="hidden shrink-0" />
        )}
      </a>
    );
  }

  return items.length > 1 ? (
    <AntBreadcrumb
      items={items}
      itemRender={itemRender}
      separator={<span className="text-white/10">/</span>}
      className={className}
    />
  ) : null;
};

export default Breadcrumb;
