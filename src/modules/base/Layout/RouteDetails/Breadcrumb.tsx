import type { RouteHandle } from 'modules/base/routes/types';
import { Fragment, useMemo } from 'react';
import { Link, useMatches, useSearchParams } from 'react-router-dom';

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

  return (
    <div className={className}>
      {items.map((item, index, self) =>
        index === self.length - 1 ? (
          <span key={`${index}${item.href}`}>{item.text}</span>
        ) : (
          <Fragment key={`${index}${item.href}`}>
            <Link to={item.href}>{item.text}</Link>
            <span className="text-white/10">/</span>
          </Fragment>
        ),
      )}
    </div>
  );
};

export default Breadcrumb;
