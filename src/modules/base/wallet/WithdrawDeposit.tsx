import type { Wallet } from 'api/wallets';
import Deposit from 'modules/base/wallet/Deposit';
import Transfer from 'modules/base/wallet/Transfer';
import { useEffect, useState } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';

export default function WithdrawDepositModal({
  wallet,
  mode,
  open,
  onResolve,
}: {
  wallet: Wallet;
  mode: 'deposit' | 'internal_transfer' | 'external_transfer';
  open?: boolean;
  onResolve?: () => void;
}) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(mode);

  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  return (
    <Dialog
      className="w-[24rem] px-4 pb-6 md:pt-6"
      drawerConfig={{ position: isMobile ? 'bottom' : 'end' }}
      mode="drawer"
      onClose={onResolve}
      open={open}
    >
      {mode === 'internal_transfer' ? (
        <h2 className="mb-4 text-xl">Internal Transfer</h2>
      ) : (
        <ButtonSelect
          className="mobile:mt-3 mobile:w-full w-max"
          onChange={newValue => setActiveTab(newValue)}
          options={
            [
              {
                label: 'Deposit',
                value: 'deposit',
              },
              {
                label: 'Withdraw',
                value: 'external_transfer',
              },
            ] as const
          }
          value={activeTab}
          variant="default"
        />
      )}
      {activeTab === 'deposit' ? (
        <Deposit wallet={wallet} />
      ) : (
        <Transfer
          mode={mode as 'internal_transfer' | 'external_transfer'}
          wallet={wallet}
        />
      )}
    </Dialog>
  );
}
