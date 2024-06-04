import { notification } from 'antd';
import { bxTrash } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDeleteMyFinancialProductMutation } from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';

const useDeleteFp = (fpKey?: string) => {
  const { t } = useTranslation('builder');
  const navigate = useNavigate();
  const [ModalDeleteConfirm, openDeleteConfirm] = useConfirm({
    icon: <Icon name={bxTrash} className="text-error" size={52} />,
    message: (
      <div className="text-center">
        <h1 className="text-white">{t('delete-fp.title')}</h1>
        <div className="mt-2 text-slate-400">
          {t('delete-fp.confirm-message')}
        </div>
      </div>
    ),
    yesTitle: t('delete-fp.btn-yes'),
    noTitle: t('common:actions.no'),
  });
  const { mutateAsync: deleteAsync, isLoading: isDeleting } =
    useDeleteMyFinancialProductMutation();
  const deleteHandler = async () => {
    if (!fpKey || !(await openDeleteConfirm())) return;

    try {
      await deleteAsync({ fpKey });
      navigate('/builder/fp');
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    ModalDeleteConfirm,
    deleteHandler,
    isDeleting,
  };
};

export default useDeleteFp;
