import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';

export default function useAnalytics() {
  // ** hotjar and GA config
  useEffect(() => {
    const hjid = import.meta.env.VITE_HJID;
    const hjsv = import.meta.env.VITE_HJSV;
    if (hjid && hjsv) {
      hotjar.initialize(hjid, hjsv);
    }

    const gaId = import.meta.env.VITE_GA;
    if (gaId) {
      ReactGA.initialize(gaId);
    }
  }, []);
}
