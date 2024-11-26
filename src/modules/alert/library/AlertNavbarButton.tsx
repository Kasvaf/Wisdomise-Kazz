import { bxChevronLeft, bxX } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';

export function AlertNavbarButton({
  type,
  onClick,
}: {
  type: 'close' | 'back';
  onClick?: () => void;
}) {
  return (
    <button
      className={clsx(
        'size-9 shrink-0',
        type === 'close' && 'text-v1-content-secondary',
      )}
      onClick={onClick}
    >
      <Icon name={type === 'back' ? bxChevronLeft : bxX} size={32} />
    </button>
  );
}
