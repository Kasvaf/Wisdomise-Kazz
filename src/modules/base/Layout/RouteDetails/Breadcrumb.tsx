import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from 'antd';
import { Fragment, useMemo } from 'react';
import { useMatches, Link, useSearchParams } from 'react-router-dom';
import { type RouteHandle } from 'modules/base/routes/types';

const Breadcrumb: React.FC<{
  className?: string;
}> = ({ className }) => {
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const items = useMemo(() => {
    return matches
      .filter(x => (x.handle as RouteHandle | undefined)?.crumb)
      .flatMap(matchedRoute => {
        const { crumb } = matchedRoute.handle as RouteHandle;
        const crumbs =
          typeof crumb === 'function'
            ? crumb(matchedRoute.params, searchParams)
            : crumb;
        return Array.isArray(crumbs) ? crumbs : [crumbs];
      });
  }, [matches, searchParams]);

  const itemRender: BreadcrumbProps['itemRender'] = ({ href, title }: any) => (
    <Link to={href}>{title}</Link>
  );

  return (
    <>
      {items.map((item, index, self) =>
        index === self.length - 1 ? (
          <span key={item.href}>{item.text}</span>
        ) : (
          <Fragment key={item.href}>
            <Link to={item.href}>{item.text}</Link>
            <span className="text-white/10">/</span>
          </Fragment>
        ),
      )}
    </>
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
