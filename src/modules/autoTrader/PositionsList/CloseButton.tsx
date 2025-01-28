import { notification } from 'antd';
import { bxX } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import {
  type Position,
  isPositionUpdatable,
  useSupportedNetworks,
  useTraderUpdatePositionMutation,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';

const CloseButton: React.FC<{ position: Position }> = ({ position }) => {
  const { t } = useTranslation('builder');
  const networks = useSupportedNetworks(
    position.base_slug,
    position.quote_slug,
  ); // TODO: should be read from position itself

  const { mutateAsync: updateOrClose, isLoading: isClosing } =
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
      variant="link"
      onClick={closeHandler}
      className="ms-auto !p-0 !text-xs text-v1-content-link"
    >
      {ModalConfirm}
      {isClosing ? <Spin /> : <Icon name={bxX} size={16} />}
      Close
    </Button>
  );
};

export default CloseButton;
