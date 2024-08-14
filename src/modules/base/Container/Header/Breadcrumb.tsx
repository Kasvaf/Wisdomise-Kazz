import { clsx } from 'clsx';
import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from 'antd';
import {
  type Params,
  useLocation,
  useMatches,
  Link,
  NavLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxChevronDown, bxChevronUp } from 'boxicons-quasar';
import { useEffect, useMemo, useState } from 'react';
import { MAIN_LANDING } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import useIsMobile from 'utils/useIsMobile';
import Icon from 'shared/Icon';
import useMenuItems from '../useMenuItems';

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

export const usePageSiblings = () => {
  const [showSiblings, setShowSiblings] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (el) {
      setHeight(el.getBoundingClientRect().height);
    } else {
      setHeight(0);
    }
  }, [el]);

  const { parent, child } = useRouteParent() ?? {};
  const PageSiblings =
    parent && child && showSiblings ? (
      <div
        ref={setEl}
        className="flex flex-col border-y border-white/5 py-3 pl-6 text-white"
      >
        {parent.children?.map(x => (
          <NavLink
            key={x.link}
            to={x.link}
            className={clsx('py-3', x === child && 'text-info')}
            onClick={() => setShowSiblings(false)}
          >
            {x.text}
          </NavLink>
        ))}
      </div>
    ) : null;

  return { PageSiblings, showSiblings, setShowSiblings, height };
};

const Breadcrumb: React.FC<{
  showSiblings?: boolean;
  onShowSiblings?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}> = ({ className, showSiblings, onShowSiblings }) => {
  const { pathname } = useLocation();
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

  const { i18n } = useTranslation();
  const { parent, child } = useRouteParent() ?? {};
  if (useIsMobile()) {
    if (parent && child) {
      return (
        <div
          className={clsx('ml-2 mt-3 flex items-center text-white', className)}
          onClick={() => onShowSiblings?.(x => !x)}
        >
          <div>{child.text}</div>
          <Icon name={showSiblings ? bxChevronUp : bxChevronDown} />
        </div>
      );
    }

    return (
      <a href={MAIN_LANDING(i18n.language)} className="mt-2">
        <img src={Logo} />
      </a>
    );
  }

  return items.length > 1 ? (
    <AntBreadcrumb
      items={items}
      itemRender={itemRender}
      separator={<span className="text-white/10">/</span>}
      className={clsx('mt-3', className)}
    />
  ) : null;
};

export default Breadcrumb;
