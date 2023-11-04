import type React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { roundDown } from 'utils/numbers';
import { useInvestorAssetStructuresQuery } from 'api';
import useMainQuote from 'shared/useMainQuote';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import ModalDeposit from 'modules/wallet/ModalDeposit';
import ModalWithdraw from 'modules/wallet/ModalWithdraw';
import { ReactComponent as DepositIcon } from './deposit.svg';
import { ReactComponent as WithdrawIcon } from './withdraw.svg';

const WalletDropdownContent: React.FC = () => {
  const { t } = useTranslation('wallet');
  const mainQuote = useMainQuote();
  const ias = useInvestorAssetStructuresQuery();

  const [DepositMod, openDeposit] = useModal(ModalDeposit);
  const [WithdrawMod, openWithdraw] = useModal(ModalWithdraw);

  const totalBalance = ias.data?.[0]?.total_equity || 0;
  const mea = ias.data?.[0]?.main_exchange_account;
  const withdrawable = mea?.quote_equity || 0;
  const fpiCount = ias.data?.[0]?.financial_product_instances.length ?? 0;

  if (ias.isLoading || !mainQuote) return <></>;

  return (
    <>
      <div className="flex justify-around gap-2 rounded-lg bg-white/5 p-4 mobile:bg-black/5">
        <div className="flex flex-col items-center">
          <p className="text-xs text-white/80 mobile:text-black/80">
            {t('total-balance')}
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
            {t('withdrawable')}
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
          <p className="mt-2 px-2 text-center text-xs text-white/80 mobile:text-black/80">
            <Trans i18nKey="equity-description" ns="wallet" count={fpiCount}>
              You have
              <span className="text-white mobile:text-black">
                {{ count: fpiCount }}
              </span>
              running product <br /> that block
              <span className="text-white mobile:text-black">
                {{ blocked: roundDown(totalBalance - withdrawable) }}
              </span>
              {{ mainQuote }} of your equity.
            </Trans>
          </p>
        )}
      <div className="mt-6 flex justify-around text-xs">
        <Button
          variant="link"
          onClick={() => openDeposit({})}
          className="rounded-lg hover:bg-black/10"
        >
          <div className="flex flex-col items-center justify-center gap-2 mobile:text-black">
            <DepositIcon className="text-white mobile:text-black" />
            {t('btn-deposit')}
          </div>
        </Button>
        {DepositMod}

        <Button
          variant="link"
          onClick={() => openWithdraw({})}
          className="rounded-lg hover:bg-black/10"
        >
          <div className="flex flex-col items-center justify-center gap-2 mobile:text-black">
            <WithdrawIcon className="text-white mobile:text-black" />
            {t('btn-withdraw')}
          </div>
        </Button>
        {WithdrawMod}
      </div>
    </>
  );
};

export default WalletDropdownContent;
