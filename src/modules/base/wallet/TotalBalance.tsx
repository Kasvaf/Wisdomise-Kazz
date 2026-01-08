import { clsx } from 'clsx';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import { useEffect, useMemo, useState } from 'react';
import { useWalletsAddresses } from 'services/chains/wallet';
import { roundSensible } from 'utils/numbers';

export default function TotalBalance({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between bg-black p-3',
        className,
      )}
    >
      <span className="text-white/70 text-xs">Total Amount</span>
      <TotalBalanceHandler />
    </div>
  );
}

function TotalBalanceHandler() {
  const addresses = useWalletsAddresses();
  const [balances, setBalances] = useState<
    Array<{ address: string; balance: number }>
  >([]);

  useEffect(() => {
    setBalances(prev => {
      return prev.filter(item => addresses.includes(item.address));
    });
  }, [addresses]);

  const total = balances.reduce((sum, current) => sum + current.balance, 0);

  const handlers = useMemo(
    () =>
      addresses.map(address => (
        <BalanceHandler
          address={address}
          key={address}
          onBalance={balance => {
            setBalances(prev => {
              const newValue = [...prev];
              const found = newValue.find(item => item.address === address);
              if (found) {
                found.balance = balance;
              } else {
                newValue.push({ address, balance });
              }

              return newValue;
            });
          }}
        />
      )),
    [addresses],
  );

  return (
    <span>
      {handlers}${roundSensible(total)}
    </span>
  );
}

function BalanceHandler({
  address,
  onBalance,
}: {
  address: string;
  onBalance: (balance: number) => void;
}) {
  const { balance } = useSolanaWalletBalanceInUSD(address);

  useEffect(() => {
    onBalance(balance);
  }, [balance, onBalance]);
  return null;
}
