import { bxX } from 'boxicons-quasar';
import { useTraderCancelPositionMutation, type Position } from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';

const CancelButton: React.FC<{ position: Position }> = ({ position }) => {
  const { mutate: cancelPosition, isLoading: isCanceling } =
    useTraderCancelPositionMutation();

  if (position.status !== 'DRAFT' && position.deposit_status !== 'PENDING') {
    return null;
  }
  return (
    <Button
      variant="link"
      onClick={() => cancelPosition(position.key)}
      className="ms-auto !p-0 !text-xs text-v1-content-link"
    >
      {isCanceling ? <Spin /> : <Icon name={bxX} size={16} />}
      Cancel
    </Button>
  );
};

export default CancelButton;
