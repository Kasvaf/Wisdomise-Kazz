import { bxRightArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import wiseBlack from 'shared/AccessShield/VipBanner/images/wise-black.png';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

export default function VipRedirectButton({
  label,
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Button
      variant="pro"
      className="w-full"
      onClick={() => {
        onClick?.();
        navigate('/account/billing');
      }}
      type="button"
    >
      <img src={wiseBlack} alt="wise" className="mr-2 h-6" />
      {label ?? 'Join Wise Club'}
      <Icon name={bxRightArrowAlt} />
    </Button>
  );
}
