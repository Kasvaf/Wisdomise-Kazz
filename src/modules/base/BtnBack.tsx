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
      onClick={() => navigate(-1)}
      size="md"
      className={clsx(className, 'w-md')}
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
