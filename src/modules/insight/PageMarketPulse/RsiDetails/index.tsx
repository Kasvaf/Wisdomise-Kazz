import { clsx } from 'clsx';
import { type FC } from 'react';
import { useRsiDivergence, useRsiOverness } from 'api/market-pulse';
import Spinner from 'shared/Spinner';
import { RsiInfo } from './RsiInfo';
import { RsiTables } from './RsiTables';

export const RsiDetails: FC<{
  className?: string;
}> = () => {
  const divergence = useRsiDivergence();
  const overness = useRsiOverness();
  const isLoading = divergence.isLoading || overness.isLoading;
  return (
    <div
      className={clsx(
        'relative flex min-h-96 flex-col items-center justify-center gap-8',
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <RsiInfo overness={overness} divergence={divergence} />
          <RsiTables overness={overness} divergence={divergence} />
        </>
      )}
    </div>
  );
};
