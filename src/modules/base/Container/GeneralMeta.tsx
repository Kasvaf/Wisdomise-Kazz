import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { APP_PANEL } from 'config/constants';

export function GeneralMeta() {
  const { pathname, search } = useLocation();

  return (
    <Helmet>
      <title>GoatX</title>
      <link rel="canonical" href={`${APP_PANEL}${pathname}?${search}`} />
      {/* <meta */}
      {/*   name="description" */}
      {/*   content="Wisdomise is an AI-powered auto trading and portfolio management solution" */}
      {/* /> */}
    </Helmet>
  );
}
