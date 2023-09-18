import { clsx } from 'clsx';
import Icon from 'shared/Icon';

const FabButton: React.FC<{ disabled?: boolean; icon: string }> = ({
  disabled,
  icon,
}) => (
  <div
    className={clsx(
      'rounded-full p-1',
      disabled
        ? 'bg-white/10 text-black/40'
        : 'cursor-pointer bg-white text-black hover:bg-white/70',
    )}
  >
    <Icon name={icon} />
  </div>
);

export default FabButton;
