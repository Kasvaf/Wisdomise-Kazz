import { bxLeftArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

const BtnBack = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      className={clsx(className, 'flex items-center justify-center')}
      fab
      onClick={() => navigate(-1)}
      size="sm"
      surface={1}
      variant="ghost"
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
