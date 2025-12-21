import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import WithdrawDepositModal from 'modules/base/wallet/WithdrawDeposit';
import { useWalletsQuery, type Wallet } from 'services/rest/wallets';
import useDialog from 'shared/useDialog';

export function useWalletActionHandler() {
  const [withdrawDepositModal, openWithdrawDepositModal] =
    useDialog(WithdrawDepositModal);
  const { data: wallets } = useWalletsQuery();

  const findWallet = (address: string) => {
    return wallets?.results.find(wallet => wallet.address === address);
  };

  const deposit = (address: string) => {
    const wallet = findWallet(address);
    if (wallet) {
      void openWithdrawDepositModal({ wallet, mode: 'deposit' });
    }
  };

  const withdraw = (address: string) => {
    const wallet = findWallet(address);
    if (wallet) {
      void openWithdrawDepositModal({ wallet, mode: 'external_transfer' });
    }
  };

  const transfer = (address: string) => {
    const wallet = findWallet(address);
    if (wallet) {
      void openWithdrawDepositModal({ wallet, mode: 'internal_transfer' });
    }
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
