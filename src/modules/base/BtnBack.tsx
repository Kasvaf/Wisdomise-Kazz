import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

const BtnBack = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      surface={2}
      onClick={() => navigate(-1)}
      size="md"
      className={clsx(
        className,
        'flex items-center justify-center !px-3 !py-0',
      )}
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
