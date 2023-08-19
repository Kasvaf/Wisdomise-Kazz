import useConfirm from 'modules/shared/useConfirm';
import WithdrawInfo, { type WithdrawInfoProps } from './WithdrawInfo';

const useWithdrawalConfirm = (withdrawInfo: WithdrawInfoProps) =>
  useConfirm({
    icon: null,
    yesTitle: 'Confirm',
    noTitle: 'Return',
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">Confirm Withdrawal</h1>
        <WithdrawInfo {...withdrawInfo} />
      </div>
    ),
  });

export default useWithdrawalConfirm;
