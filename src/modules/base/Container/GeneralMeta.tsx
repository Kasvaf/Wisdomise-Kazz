import { type Params } from '@sentry/react/types/types';
import { Helmet } from 'react-helmet-async';
import { useLocation, useMatches } from 'react-router-dom';
import { APP_PANEL } from 'config/constants';

interface Handle {
  crumb?: string | React.ReactNode | ((params: Params<string>) => string);
}

export function GeneralMeta() {
  const { pathname } = useLocation();
  const matches = useMatches();
  const items = matches
    .filter(x => (x.handle as Handle | undefined)?.crumb)
    .map(item => {
      const { crumb } = item.handle as Handle;
      return typeof crumb === 'function' ? crumb(item.params) : crumb;
    });
  const currentPageTitle = items.at(-1);
  /* eslint-disable i18next/no-literal-string */
  return (
    <Helmet>
      <title>{currentPageTitle || 'Dashboard'} | Wisdomise</title>
      <link rel="canonical" href={`${APP_PANEL}${pathname}`} />
      <meta
        name="description"
        content="Wisdomise is an AI-powered auto trading and portfolio management solution"
      />
    </Helmet>
  );
}
