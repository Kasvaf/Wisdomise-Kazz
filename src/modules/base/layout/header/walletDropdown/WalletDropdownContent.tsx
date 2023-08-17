import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/Button';
import { useInvestorAssetStructuresQuery } from 'api';
import { roundDown } from 'utils/numbers';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';

interface Props {
  closeDropdown: () => void;
}

export const WalletDropdownContent: React.FC<Props> = ({ closeDropdown }) => {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();

  const totalBalance = ias.data?.[0]?.total_equity || 0;
  const withdrawable = ias.data?.[0]?.main_exchange_account.quote_equity || 0;

  return (
    <>
      <div className="flex justify-around gap-2 rounded-lg bg-white/5 p-4 mobile:bg-black/5">
        <div className="flex flex-col items-center">
          <p className="text-xs text-white/80 mobile:text-black/80">
            Total Balance
          </p>
          <p className="text-white mobile:text-black">
            {roundDown(totalBalance)}{' '}
            <span className="text-white/80 mobile:text-black/80">BUSD</span>
          </p>
        </div>
        <div className="border-l border-white/10" />
        <div className="flex flex-col items-center ">
          <p className="text-xs text-white/80 mobile:text-black/80">
            Withdrawable
          </p>
          <p className="text-white mobile:text-black">
            {roundDown(withdrawable)}{' '}
            <span className="text-white/80 mobile:text-black/80">BUSD</span>
          </p>
        </div>
      </div>
      {(ias.data?.[0]?.financial_product_instances.length || 0) > 0 &&
        ias.data?.[0]?.financial_product_instances[0].status !== 'DRAFT' && (
          <p className="mt-2 px-2 text-center text-xs  text-white/80 mobile:text-black/80">
            You Have <span className="text-white mobile:text-black">1</span>{' '}
            Running Product <br /> That Block{' '}
            <span className="text-white mobile:text-black">
              {roundDown(totalBalance - withdrawable)}
            </span>{' '}
            BUSD Of Your Equity
          </p>
        )}
      <div className="mt-6 flex justify-around text-xs">
        <Button
          variant="link"
          onClick={() => {
            closeDropdown();
            navigate(
              `/app/deposit/${ias?.data?.[0]?.main_exchange_account?.key}`,
            );
          }}
          className="item flex flex-col items-center justify-center gap-2 !p-0 mobile:text-black"
        >
          <DepositIcon className="text-white mobile:text-black" />
          Deposit
        </Button>

        <Button
          variant="link"
          onClick={() => {
            closeDropdown();
            navigate('/app/withdraw');
          }}
          className="item flex flex-col items-center justify-center gap-2 !p-0 mobile:text-black"
        >
          <WithdrawIcon className="text-white mobile:text-black" />
          Withdraw
        </Button>
      </div>
    </>
  );
};
