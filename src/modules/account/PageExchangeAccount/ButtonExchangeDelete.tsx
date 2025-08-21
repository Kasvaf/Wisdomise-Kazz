import { notification } from 'antd';
import { type ExchangeAccount, useDeleteExchangeAccount } from 'api';
import { bxTrash } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import useConfirm from 'shared/useConfirm';
import { unwrapErrorMessage } from 'utils/error';

const ButtonExchangeDelete: React.FC<{ account: ExchangeAccount }> = ({
  account,
}) => {
  const { t } = useTranslation('external-accounts');
  const [ModalDeleteConfirm, openDeleteConfirm] = useConfirm({
    icon: (
      <Icon className="text-v1-content-negative" name={bxTrash} size={52} />
    ),
    message: (
      <div className="text-center">
        <h1 className="text-white">{t('delete-account.title')}</h1>
        <div className="mt-2 text-slate-400">
          {t('delete-account.confirm-message')}
        </div>
      </div>
    ),
    yesTitle: t('delete-account.btn-yes'),
    noTitle: t('common:actions.no'),
  });

  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useDeleteExchangeAccount();
  const deleteHandler = async () => {
    if (isDeleting || !(await openDeleteConfirm())) return;

    try {
      await deleteAsync({ key: account.key });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <>
      {ModalDeleteConfirm}
      {isDeleting ? (
        <Spin fontSize={20} />
      ) : (
        <Button
          className="!px-3 !py-1 !text-xs"
          onClick={deleteHandler}
          variant="secondary-red"
        >
          <Icon className="mr-2" name={bxTrash} size={12} />
          {t('common:actions.remove')}
        </Button>
      )}
    </>
  );
};

export default ButtonExchangeDelete;
