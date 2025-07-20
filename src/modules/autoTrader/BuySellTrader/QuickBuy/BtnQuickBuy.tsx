import { clsx } from 'clsx';
import { notification } from 'antd';
import { Button } from 'shared/v1-components/Button';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMarketSwap } from 'api/chains';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function BtnQuickBuy({
  slug,
  source,
  className,
}: {
  slug: string;
  source: 'new_pairs' | 'final_stretch' | 'migrated';
  className?: string;
}) {
  const { settings, getActivePreset } = useUserSettings();
  const marketSwapHandler = useMarketSwap();

  const swap = async () => {
    const preset = getActivePreset('terminal').buy;

    // todo add validation
    await marketSwapHandler(
      slug,
      'wrapped-solana',
      'LONG',
      settings.quick_buy[source].amount ?? '0',
      preset.slippage,
      preset.sol_priority_fee,
    );
    notification.success({ message: 'Transaction successfully sent' });
  };

  return (
    <Button
      className={clsx(className, 'flex items-center !rounded-3xl')}
      size="xs"
      onClick={e => {
        e.stopPropagation();
        void swap();
      }}
    >
      <InstantIcon />
      {settings.quick_buy[source].amount} SOL
    </Button>
  );
}
