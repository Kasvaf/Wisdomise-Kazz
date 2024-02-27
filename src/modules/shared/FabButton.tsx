import { clsx } from 'clsx';
import Icon from 'shared/Icon';

const FabButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  icon: string;
  size?: number;
  className?: string;
}> = ({ disabled, icon, onClick, size, className }) => (
  <div
    onClick={onClick}
    className={clsx(
      'rounded-full p-1',
      disabled
        ? 'bg-white/10 text-black/40'
        : 'cursor-pointer bg-white text-black hover:bg-white/70',
      className,
    )}
  >
    <Icon name={icon} size={size} />
  </div>
);

export default FabButton;
