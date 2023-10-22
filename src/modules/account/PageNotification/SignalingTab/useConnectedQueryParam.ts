import { useSearchParams } from 'react-router-dom';

export default function useConnectedQueryParam(): [boolean, () => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    Boolean(searchParams.get('connected')),
    () => {
      setSearchParams({}, { replace: true });
    },
  ];
}
