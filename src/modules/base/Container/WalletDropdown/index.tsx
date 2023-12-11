import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useInvestorAssetStructuresQuery } from 'api';
import Button from 'shared/Button';
import useMainQuote from 'shared/useMainQuote';
import DropdownContainer from '../DropdownContainer';
import WalletDropdownContent from './WalletDropdownContent';
import { ReactComponent as WalletIcon } from './wallet.svg';

const WalletDropdown: React.FC = () => {
  const { t } = useTranslation('wallet');
  const [open, setOpen] = useState(false);
  const dropDownFn = useCallback(
    () => (
      <DropdownContainer className="w-80 !p-4" setOpen={setOpen}>
        <WalletDropdownContent />
      </DropdownContainer>
    ),
    [],
  );

  const mainQuote = useMainQuote();
  const ias = useInvestorAssetStructuresQuery();
  const noWithdraw =
    ias.data?.[0]?.financial_product_instances?.[0]?.financial_product?.config
      ?.no_withdraw;
  const hasWallet = Boolean(
    ias?.data?.[0]?.main_exchange_account && !noWithdraw,
  );
  const totalBalance = ias.data?.[0]?.total_equity || 0;

  useEffect(() => {
    if (open) {
      void ias.refetch();
    }
  }, [open, ias]);

  if (!hasWallet) return null;
  return (
    <Dropdown
      open={open}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomRight"
      dropdownRender={dropDownFn}
    >
      <Button
        className={clsx('mr-3 h-12 !p-3 font-normal', open && 'active')}
        contentClassName="gap-2"
        variant="alternative"
      >
        <WalletIcon />
        <span className="text-xs">{t('wallet:available')}:</span>
        <span>{numerable.format(totalBalance, '0,0.00')}</span>
        <span className="text-xs text-white/40">{mainQuote}</span>
      </Button>
    </Dropdown>
  );
};

export default WalletDropdown;
