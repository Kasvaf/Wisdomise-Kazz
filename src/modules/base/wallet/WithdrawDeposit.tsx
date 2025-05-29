import { useEffect, useState } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import Transfer from 'modules/base/wallet/Transfer';
import Deposit from 'modules/base/wallet/Deposit';
import { Dialog } from 'shared/v1-components/Dialog';
import { type Wallet } from 'api/wallets';

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
  const [activeTab, setActiveTab] = useState(mode);

  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  return (
    <Dialog
      mode="drawer"
      className="w-[24rem] px-4 py-6"
      drawerConfig={{ position: 'end' }}
      open={open}
      onClose={onResolve}
    >
      {mode === 'internal_transfer' ? (
        <h2 className="mb-4 text-xl">Internal Transfer</h2>
      ) : (
        <ButtonSelect
          className="w-max"
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
          onChange={newValue => setActiveTab(newValue)}
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
