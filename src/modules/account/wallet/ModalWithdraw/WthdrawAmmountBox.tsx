import * as numerable from 'numerable';
import CoinsIcons from 'shared/CoinsIcons';
import { type Network } from 'api/types/NetworksResponse';

interface Props {
  crypto: string;
  network?: Network;
  amount: number;
}

const WithdrawAmountBox: React.FC<Props> = ({ crypto, network, amount }) => {
  return (
    <div className="flex h-12 w-full items-center justify-between rounded-full bg-black/40 px-6">
      <div className="flex items-center">
        <div className="my-2 mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
          <CoinsIcons coins={[crypto]} size={'small'} />
        </div>
        <div className="text-lg font-semibold">
          {numerable.format(amount, '0,0.00', {
            rounding: 'floor',
          })}
        </div>
        <div className="ml-1 mt-1 text-[10px] leading-normal text-white/80">
          {crypto}
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <div className="font-medium leading-normal">{network?.name}</div>
        <div className="text-[10px] leading-normal text-white/80">
          {network?.description}
        </div>
      </div>
    </div>
  );
};

export default WithdrawAmountBox;
