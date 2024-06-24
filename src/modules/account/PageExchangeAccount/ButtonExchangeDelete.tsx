import { notification } from 'antd';
import { bxTrash, bxX } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import { type ExchangeAccount, useDeleteExchangeAccount } from 'api';
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
        <div
          onClick={deleteHandler}
          className="cursor-pointer rounded-full bg-white/30 p-1 text-black hover:bg-white/70"
        >
          <Icon name={bxX} size={16} />
        </div>
      )}
    </>
  );
};

export default ButtonExchangeDelete;
