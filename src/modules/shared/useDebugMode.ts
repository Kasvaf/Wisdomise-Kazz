import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useDebugMode() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('debug')) {
      localStorage.setItem(
        'debug',
        searchParams.get('debug') === 'false' ? 'false' : 'true',
      );
      searchParams.delete('debug');
      setSearchParams(searchParams);
      window.location.reload();
    }
  }, [searchParams, setSearchParams]);
}
