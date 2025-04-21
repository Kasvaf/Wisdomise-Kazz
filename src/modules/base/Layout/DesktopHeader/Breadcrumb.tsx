import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from 'antd';
import { type Params, useLocation, useMatches, Link } from 'react-router-dom';

interface Handle {
  crumb?: string | React.ReactNode | ((params: Params<string>) => string);
  alt?: string;
  href?: string;
}

const Breadcrumb: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { pathname } = useLocation();
  const matches = useMatches();
  const items = matches
    .filter(x => (x.handle as Handle | undefined)?.crumb)
    .map(item => {
      const { crumb, alt, href } = item.handle as Handle;
      const itemHref = href ?? item.pathname;
      return {
        href: itemHref === pathname ? undefined : itemHref,
        title: typeof crumb === 'function' ? crumb(item.params) : crumb,
        alt,
      };
    });

  const itemRender: BreadcrumbProps['itemRender'] = ({
    href,
    title,
    alt,
  }: any) =>
    href && href !== pathname && alt !== pathname ? (
      <Link to={href}>{title}</Link>
    ) : (
      <span>{title}</span>
    );

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
