import ReactGA from 'react-ga4';

export default function configAnalytics() {
  // ** GA config
  const gaId = import.meta.env.VITE_GA;
  if (gaId) {
    ReactGA.initialize(gaId);
  }
}
