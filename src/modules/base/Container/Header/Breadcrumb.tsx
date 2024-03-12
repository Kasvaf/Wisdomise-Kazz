import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from 'antd';
import { type Params, useLocation, useMatches, Link } from 'react-router-dom';

interface Handle {
  crumb?: string | React.ReactNode | ((params: Params<string>) => string);
}

const itemRender: BreadcrumbProps['itemRender'] = ({ href, title }) =>
  href ? <Link to={href}>{title}</Link> : <span>{title}</span>;

const Breadcrumb: React.FC<{ className?: string }> = ({ className }) => {
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
