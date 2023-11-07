import { bxCheckCircle } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import WithdrawInfo, { type WithdrawInfoProps } from './WithdrawInfo';

const useWithdrawSuccess = (withdrawInfo: WithdrawInfoProps) => {
  const { t } = useTranslation('wallet');
  return useConfirm({
    icon: <Icon name={bxCheckCircle} className="text-success" size={52} />,
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">{t('modal-success.title')}</h1>
        <div className="mx-10 mb-6">{t('modal-success.description')}</div>
        <WithdrawInfo {...withdrawInfo} />
      </div>
    ),
    yesTitle: '',
    noTitle: '',
  });
};

export default useWithdrawSuccess;
