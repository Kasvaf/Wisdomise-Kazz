import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useCustomVersion() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const requestDebugModeChange = searchParams.has('debug');
    const requestProductionModeChange = searchParams.has('production');

    if (requestDebugModeChange || requestProductionModeChange) {
      if (requestDebugModeChange) {
        const debugModeValue =
          searchParams.get('debug') === 'false' ? 'false' : 'true';
        localStorage.setItem('debug', debugModeValue);
        searchParams.delete('debug');
      }
      if (requestProductionModeChange) {
        const productionModeValue =
          searchParams.get('production') === 'false' ? 'false' : 'true';
        localStorage.setItem('production2', productionModeValue);
        searchParams.delete('production');
      }

      setSearchParams(searchParams);
      window.location.reload();
    }
  }, [searchParams, setSearchParams]);
}
