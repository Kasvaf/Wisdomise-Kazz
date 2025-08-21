import { APP_PANEL } from 'config/constants';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function GeneralMeta() {
  const { pathname, search } = useLocation();

  return (
    <Helmet>
      <title>GoatX</title>
      <link href={`${APP_PANEL}${pathname}?${search}`} rel="canonical" />
      {/* <meta */}
      {/*   name="description" */}
      {/*   content="Wisdomise is an AI-powered auto trading and portfolio management solution" */}
      {/* /> */}
    </Helmet>
  );
}
