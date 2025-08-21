import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import wiseBlack from 'shared/AccessShield/VipBanner/images/wise-black.png';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

export default function VipRedirectButton({
  label,
  onClick,
  className,
}: {
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();

  return (
    <Button
      className={clsx(className, 'w-full')}
      onClick={() => {
        onClick?.();
        navigate('/account/billing');
      }}
      type="button"
      variant="pro"
    >
      <img alt="wise" className="mr-2 h-6" src={wiseBlack} />
      {label ?? 'Join Wise Club'}
      <Icon name={bxRightArrowAlt} />
    </Button>
  );
}
