import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const BtnBack = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="alternative"
      onClick={() => navigate(-1)}
      className={clsx(
        className,
        'flex h-11 w-11 items-center justify-center !px-3 !py-0',
      )}
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
