import { bxLeftArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

const BtnBack = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      className={clsx(
        className,
        '!px-3 !py-0 flex items-center justify-center',
      )}
      onClick={() => navigate(-1)}
      size="md"
      surface={2}
      variant="ghost"
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
