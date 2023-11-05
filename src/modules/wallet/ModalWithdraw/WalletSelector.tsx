import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ComboBox from 'shared/ComboBox';
import { useInvestorAssetStructuresQuery } from 'api';
import { type VerifiedWallet, useVerifiedWallets } from 'api/kyc';
import CoinsIcons from 'modules/shared/CoinsIcons';

const WalletOptionItemFn = (wallet: VerifiedWallet) => {
  if (!wallet.symbol.name || !wallet.network?.name) {
    return <div className="flex items-center">{wallet.address}</div>;
  }

  return (
    <div className="mr-2 flex-1">
      <div className="mb-2 flex border-b border-white/20 pb-2">
        <div className="mr-6 border-r border-white/20 pr-6">
          {wallet.name || '(unnamed)'}
        </div>
        <div className="flex items-center gap-2">
          <CoinsIcons coins={[wallet.symbol.name]} size={'small'} />
          <div className="text-[10px] leading-normal">
            {wallet.network.description}
          </div>
        </div>
      </div>

      <div className="line-clamp-1 font-medium leading-normal">
        {wallet.address}
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
const dummyDefault = dummy('');

const WalletSelector: React.FC<Props> = ({
  selectedItem,
  onSelect,
  disabled,
}) => {
  const { t } = useTranslation();

  const dummyLoading = dummy(t('common:loading'));
  const dummyEmpty = dummy(t('wallet:no-verified-wallet'));

  const ias = useInvestorAssetStructuresQuery();
  const wallets = useVerifiedWallets();
  useEffect(() => {
    if (wallets.data?.length && !selectedItem?.network?.name) {
      onSelect(wallets.data[0] as VerifiedWallet);
    }
  }, [wallets.data, onSelect, selectedItem?.network?.name]);

  return (
    <ComboBox
      options={wallets.data ?? []}
      selectedItem={
        wallets.isLoading
          ? dummyLoading
          : wallets.data?.length
          ? selectedItem ?? dummyDefault
          : dummyEmpty
      }
      onSelect={onSelect}
      renderItem={WalletOptionItemFn}
      disabled={
        disabled || wallets.isLoading || !ias.data?.[0]?.main_exchange_account
      }
      className="!h-[88px]"
    />
  );
};

export default WalletSelector;
