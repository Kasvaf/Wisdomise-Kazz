import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const BtnBack = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="alternative"
      onClick={() => navigate(-1)}
      className="flex h-11 w-11 items-center justify-center !px-3 !py-0"
    >
      <Icon name={bxLeftArrowAlt} />
    </Button>
  );
};

export default BtnBack;
