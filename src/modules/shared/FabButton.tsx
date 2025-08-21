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
  alt?: boolean;
}> = ({ disabled, icon, onClick, to, size, alt, className }) => {
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        'rounded-full border border-transparent p-1',
        disabled
          ? 'cursor-not-allowed bg-white/10 text-black/40'
          : alt
            ? 'cursor-pointer border border-v1-border-secondary text-v1-content-primary hover:border-v1-border-primary'
            : 'cursor-pointer bg-white text-black hover:bg-white/70',
        className,
      )}
      onClick={disabled ? undefined : (onClick ?? (() => to && navigate(to)))}
    >
      <Icon name={icon} size={size} />
    </div>
  );
};

export default FabButton;
