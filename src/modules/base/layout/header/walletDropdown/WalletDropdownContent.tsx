import type React from 'react';
import { useCallback } from 'react';
import { roundDown } from 'utils/numbers';
import { useInvestorAssetStructuresQuery } from 'api';
import useMainQuote from 'shared/useMainQuote';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import DepositModal from 'modules/wallet/DepositModal';
import WithdrawModal from 'modules/wallet/WithdrawModal';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';

interface Props {
  closeDropdown: () => void;
}

const WalletDropdownContent: React.FC<Props> = ({ closeDropdown }) => {
  const mainQuote = useMainQuote();
  const ias = useInvestorAssetStructuresQuery();

  const [DepositMod, openDeposit] = useModal(DepositModal);
  const [WithdrawMod, openWithdraw] = useModal(WithdrawModal);

  const totalBalance = ias.data?.[0]?.total_equity || 0;
  const mea = ias.data?.[0]?.main_exchange_account;
  const withdrawable = mea?.quote_equity || 0;

  const onDepositHandler = useCallback(() => {
    void openDeposit({});
    closeDropdown();
  }, [closeDropdown, openDeposit]);

  const onWithdrawHandler = useCallback(() => {
    void openWithdraw({});
    closeDropdown();
  }, [closeDropdown, openWithdraw]);

  if (ias.isLoading || !mainQuote) return <></>;

  return (
    <>
      <div className="flex justify-around gap-2 rounded-lg bg-white/5 p-4 mobile:bg-black/5">
        <div className="flex flex-col items-center">
          <p className="text-xs text-white/80 mobile:text-black/80">
            Total Balance
          </p>
          <p className="text-white mobile:text-black">
            {roundDown(totalBalance)}{' '}
            <span className="text-white/80 mobile:text-black/80">
              {mainQuote}
            </span>
          </p>
        </div>
        <div className="border-l border-white/10" />
        <div className="flex flex-col items-center ">
          <p className="text-xs text-white/80 mobile:text-black/80">
            Withdrawable
          </p>
          <p className="text-white mobile:text-black">
            {roundDown(withdrawable)}{' '}
            <span className="text-white/80 mobile:text-black/80">
              {mainQuote}
            </span>
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
            {mainQuote} Of Your Equity
          </p>
        )}
      <div className="mt-6 flex justify-around text-xs">
        <Button variant="link" onClick={onDepositHandler} className="!p-0">
          <div className="flex flex-col items-center justify-center gap-2 mobile:text-black">
            <DepositIcon className="text-white mobile:text-black" />
            Deposit
          </div>
        </Button>
        <DepositMod />

        <Button variant="link" onClick={onWithdrawHandler} className="!p-0">
          <div className="flex flex-col items-center justify-center gap-2 mobile:text-black">
            <WithdrawIcon className="text-white mobile:text-black" />
            Withdraw
          </div>
        </Button>
        <WithdrawMod />
      </div>
    </>
  );
};

export default WalletDropdownContent;
