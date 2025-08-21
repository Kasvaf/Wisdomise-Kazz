import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';

export type TraderModes = 'buy' | 'sell' | 'auto';
export const ModeSelector: React.FC<{
  mode: TraderModes;
  setMode: (newVal: TraderModes) => void;
  className?: string;
}> = ({ mode, setMode, className }) => {
  return (
    <div
      className={clsx(
        'flex items-stretch gap-1 rounded-lg bg-v1-surface-l1 p-1',
        className,
      )}
    >
      <Button
        className={clsx(
          'w-1/3',
          mode === 'buy' &&
            '!bg-v1-content-positive text-v1-content-secondary-inverse',
        )}
        onClick={() => setMode('buy')}
        size="xs"
        surface={1}
        variant="ghost"
      >
        Buy
      </Button>

      <Button
        className={clsx(
          'w-1/3',
          mode === 'sell' &&
            '!bg-v1-content-negative text-v1-content-secondary-inverse',
        )}
        onClick={() => setMode('sell')}
        size="xs"
        surface={1}
        variant="ghost"
      >
        Sell
      </Button>

      <Button
        className={clsx(
          'w-1/3',
          mode === 'auto' &&
            '!bg-v1-content-info text-v1-content-secondary-inverse',
        )}
        onClick={() => setMode('auto')}
        size="xs"
        surface={1}
        variant="ghost"
      >
        Auto Trade
      </Button>
    </div>
  );
};
