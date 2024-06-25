import { notification } from 'antd';
import { bxTrash } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import { type ExchangeAccount, useDeleteExchangeAccount } from 'api';
import Button from 'shared/Button';
import Spin from 'shared/Spin';

const ButtonExchangeDelete: React.FC<{ account: ExchangeAccount }> = ({
  account,
}) => {
  const { t } = useTranslation('external-accounts');
  const [ModalDeleteConfirm, openDeleteConfirm] = useConfirm({
    icon: <Icon name={bxTrash} className="text-error" size={52} />,
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

  const { mutateAsync: deleteAsync, isLoading: isDeleting } =
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
          onClick={deleteHandler}
          variant="secondary-red"
          className="!px-3 !py-1 !text-xs"
        >
          <Icon name={bxTrash} size={12} className="mr-2" />
          {t('common:actions.remove')}
        </Button>
      )}
    </>
  );
};

export default ButtonExchangeDelete;
