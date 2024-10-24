import { useParams } from 'react-router-dom';
import { unparam } from '../../../api/feature-flags';

const proPaths = new Set([
  '/insight/alerts',
  '/insight/whales',
  '/insight/whales/[network]/[address]',
]);

export function useIsPro() {
  const params = useParams<Record<string, string>>();

  return (pathname: string) => {
    if (pathname[0] === '/') {
      return proPaths.has(unparam(pathname, params));
    }

    throw new Error('Such pathname name is not in our conventions!');
  };
}
