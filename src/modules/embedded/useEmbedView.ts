import { useLocation } from 'react-router-dom';

export function useEmbedView() {
  const location = useLocation();

  return {
    isEmbeddedView: location.pathname.includes('embedded'),
  };
}
