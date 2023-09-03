import { bxCheckCircle } from 'boxicons-quasar';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import WithdrawInfo, { type WithdrawInfoProps } from './WithdrawInfo';

const useWithdrawSuccess = (withdrawInfo: WithdrawInfoProps) =>
  useConfirm({
    icon: <Icon name={bxCheckCircle} className="text-success" size={52} />,
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">
          Withdrawal Request Submitted
        </h1>
        <div className="mx-10 mb-6">
          Please note that you will receive an email once it is completed.
        </div>
        <WithdrawInfo {...withdrawInfo} />
      </div>
    ),
    yesTitle: '',
    noTitle: '',
  });

export default useWithdrawSuccess;
