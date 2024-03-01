import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';

const FabButton: React.FC<{
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
  icon: string;
  size?: number;
  className?: string;
}> = ({ disabled, icon, onClick, to, size, className }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={onClick ?? (() => to && navigate(to))}
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
};

export default FabButton;
