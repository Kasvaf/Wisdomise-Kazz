import { bxX } from 'boxicons-quasar';
import {
  useSupportedNetworks,
  useTraderCancelPositionMutation,
  type Position,
} from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';

const CancelButton: React.FC<{ position: Position }> = ({ position }) => {
  const networks = useSupportedNetworks(
    position.base_slug,
    position.quote_slug,
  ); // TODO: should be read from position itself

  const { mutate: cancelPosition, isPending: isCanceling } =
    useTraderCancelPositionMutation();

  if (
    position.status === 'CLOSING' ||
    position.status === 'CLOSED' ||
    position.status === 'CANCELED' ||
    (position.status !== 'DRAFT' && position.deposit_status !== 'PENDING')
  ) {
    return null;
  }
  if (!networks?.[0]) return null;

  return (
    <Button
      variant="link"
      onClick={() =>
        cancelPosition({ positionKey: position.key, network: networks[0] })
      }
      className="ms-auto !p-0 !text-xs text-v1-content-link"
    >
      {isCanceling ? <Spin /> : <Icon name={bxX} size={16} />}
      Cancel
    </Button>
  );
};

export default CancelButton;
