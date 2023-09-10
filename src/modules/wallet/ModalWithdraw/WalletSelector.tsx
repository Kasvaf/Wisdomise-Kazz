import type React from 'react';
import { useEffect } from 'react';
import ComboBox from 'shared/ComboBox';
import { type VerifiedWallet, useVerifiedWallets } from 'api/kyc';
import CoinsIcons from 'modules/shared/CoinsIcons';

const WalletOptionItemFn = (wallet: VerifiedWallet) => {
  return (
    <div className="flex items-center">
      {wallet.symbol.name && (
        <div className="my-2 mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
          <CoinsIcons coins={[wallet.symbol.name]} size={'small'} />
        </div>
      )}
      <div className="ml-2 flex flex-col justify-center">
        <div className="font-medium leading-normal">{wallet.address}</div>
        {wallet.network?.name && (
          <div className="text-[10px] leading-normal text-white/80">
            {wallet.network.name}
          </div>
        )}
      </div>
    </div>
  );
};

interface Props {
  selectedItem?: VerifiedWallet;
  onSelect: (net: VerifiedWallet) => void;
  disabled?: boolean;
}

const dummy = (x: string): VerifiedWallet => ({
  address: x,
  network: { key: '', description: '', name: '' },
  symbol: { name: '', title: '' },
});

const WalletSelector: React.FC<Props> = ({
  selectedItem,
  onSelect,
  disabled,
}) => {
  const wallets = useVerifiedWallets();
  useEffect(() => {
    if (wallets.data?.length && !selectedItem) {
      onSelect(wallets.data[0]);
    }
  }, [wallets, onSelect, selectedItem]);

  return (
    <ComboBox
      options={wallets.data ?? []}
      selectedItem={
        wallets.isLoading
          ? dummy('loading...')
          : wallets.data?.length
          ? selectedItem ?? dummy('')
          : dummy('You have no verified wallet.')
      }
      onSelect={onSelect}
      renderItem={WalletOptionItemFn}
      disabled={disabled || wallets.isLoading}
    />
  );
};

export default WalletSelector;
