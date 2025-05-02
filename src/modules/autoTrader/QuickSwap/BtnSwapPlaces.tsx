import { clsx } from 'clsx';
import { ReactComponent as SwapIcon } from './swap-icon.svg';

const BtnSwapPlaces: React.FC<{ onClick?: () => void; className?: string }> = ({
  onClick,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex size-8 items-center justify-center self-center rounded-full bg-v1-surface-l1',
        'hover:bg-v1-surface-l2',
        className,
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <SwapIcon className="size-5" />
    </div>
  );
};

export default BtnSwapPlaces;
