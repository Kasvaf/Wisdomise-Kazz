import { useIsFetching } from '@tanstack/react-query';
import { useIsMounted } from 'usehooks-ts';

export const useIsWhalesFetching = () => {
  const isMounted = useIsMounted();

  const whalesLoading = useIsFetching({
    exact: false,
    queryKey: ['whales'],
  });
  const coinsLoading = useIsFetching({
    exact: false,
    queryKey: ['whales-coins'],
  });

  const count = coinsLoading + whalesLoading + (isMounted() ? 0 : 1);

  return count > 0;
};
