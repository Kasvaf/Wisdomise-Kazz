import { useTranslation } from 'react-i18next';
import useConfirm from 'shared/useConfirm';
import WithdrawInfo, { type WithdrawInfoProps } from './WithdrawInfo';

const useWithdrawalConfirm = (withdrawInfo: WithdrawInfoProps) => {
  const { t } = useTranslation('wallet');
  return useConfirm({
    icon: null,
    yesTitle: 'Confirm',
    noTitle: 'Return',
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">{t('confirm-withdrawal')}</h1>
        <WithdrawInfo {...withdrawInfo} />
      </div>
    ),
  });
};

export default useWithdrawalConfirm;
