import { notification } from 'antd';
import {
  isPositionUpdatable,
  type Position,
  useSupportedNetworks,
  useTraderUpdatePositionMutation,
} from 'api';
import { bxX } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import useConfirm from 'shared/useConfirm';
import { unwrapErrorMessage } from 'utils/error';

const CloseButton: React.FC<{ position: Position }> = ({ position }) => {
  const { t } = useTranslation('builder');
  const networks = useSupportedNetworks(
    position.base_slug,
    position.quote_slug,
  ); // TODO: should be read from position itself

  const { mutateAsync: updateOrClose, isPending: isClosing } =
    useTraderUpdatePositionMutation();

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

  const closeHandler = async () => {
    if (!networks?.[0]) return;
    if (
      !(await confirm({
        message: t('signal-form.confirm-close'),
      }))
    )
      return;

    try {
      await updateOrClose({
        network: networks[0],
        position_key: position.key,
        signal: {
          ...position.signal,
          action: 'close',
          position: position.signal.position,
          stop_loss: { items: [] },
          take_profit: { items: [] },
          open_orders: { items: [] },
        },
      });
      notification.success({
        message: t('signal-form.notif-success-close'),
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  if (!isPositionUpdatable(position) || !networks?.[0]) {
    return null;
  }

  return (
    <Button
      className="!p-0 !text-xs ms-auto text-v1-content-link"
      onClick={closeHandler}
      variant="link"
    >
      {ModalConfirm}
      {isClosing ? <Spin /> : <Icon name={bxX} size={16} />}
      Close
    </Button>
  );
};

export default CloseButton;
