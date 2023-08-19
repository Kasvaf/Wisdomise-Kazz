import useConfirm from 'modules/shared/useConfirm';
import { type CryptosResponse } from 'api/types/NetworksResponse';
import { type Network } from '../NetworkSelector';
import WithdrawInfo from './WithdrawInfo';

type Crypto = CryptosResponse['results'][0];
const useWithdrawalConfirm = ({
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
    icon: null,
    yesTitle: 'Confirm',
    noTitle: 'Return',
    message: (
      <div>
        <h1 className="mb-6 text-center text-xl">Confirm Withdrawal</h1>
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
  });

export default useWithdrawalConfirm;
