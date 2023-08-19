import { ReactComponent as SuccessIcon } from '@images/tick-circle-alt.svg';
import useConfirm from 'modules/shared/useConfirm';
import { type CryptosResponse } from 'api/types/NetworksResponse';
import { type Network } from '../NetworkSelector';
import WithdrawInfo from './WithdrawInfo';

type Crypto = CryptosResponse['results'][0];
const useWithdrawSuccess = ({
  crypto,
  network,
  amount,
  wallet,
  fee,
  source,
}: {
  crypto: Crypto;
  network: Network;
  amount: number;
  wallet: string;
  fee: number;
  source: string;
}) =>
  useConfirm({
    icon: <SuccessIcon />,
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">
          Withdrawal Request Submitted
        </h1>
        <div className="mx-10 mb-6">
          Please note that you will receive an email once it is completed.
        </div>
        <WithdrawInfo
          crypto={crypto}
          network={network}
          amount={amount}
          wallet={wallet}
          fee={fee}
          source={source}
        />
      </div>
    ),
    yesTitle: '',
    noTitle: '',
  });

export default useWithdrawSuccess;
