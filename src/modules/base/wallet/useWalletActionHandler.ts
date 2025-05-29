import WithdrawDepositModal from 'modules/base/wallet/WithdrawDeposit';
import useDialog from 'shared/useDialog';
import { type Wallet } from 'api/wallets';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';

export function useWalletActionHandler() {
  const [withdrawDepositModal, openWithdrawDepositModal] =
    useDialog(WithdrawDepositModal);

  const deposit = (wallet: Wallet) => {
    void openWithdrawDepositModal({ wallet, mode: 'deposit' });
  };

  const withdraw = (wallet: Wallet) => {
    void openWithdrawDepositModal({ wallet, mode: 'external_transfer' });
  };

  const transfer = (wallet: Wallet) => {
    void openWithdrawDepositModal({ wallet, mode: 'internal_transfer' });
  };

  const openScan = (wallet: Wallet) => {
    const scanner = SCANNERS[wallet.network_slug];
    window.open(scanner.baseUrl + (scanner.addressPath ?? '') + wallet.address);
  };

  return {
    withdrawDepositModal,
    deposit,
    withdraw,
    transfer,
    openScan,
  };
}
