import { clsx } from 'clsx';
import { notification } from 'antd';
import { Button } from 'shared/v1-components/Button';
import {
  type QuickBuySource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useAccountNativeBalance, useMarketSwap } from 'api/chains';
import { useSupportedPairs } from 'api';
import { type CoinNetwork } from 'api/discovery';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function BtnQuickBuy({
  slug,
  source,
  className,
  networks,
}: {
  slug: string;
  source: QuickBuySource;
  className?: string;
  networks?: CoinNetwork[] | null;
}) {
  const { settings, getActivePreset } = useUserSettings();
  const marketSwapHandler = useMarketSwap();
  const { data: balance } = useAccountNativeBalance();
  const { refetch } = useSupportedPairs(slug, { enabled: false });
  const isLoggedIn = useIsLoggedIn();
  const [modal, ensureAuthenticated] = useEnsureAuthenticated();

  const isSolana = networks
    ? networks.find(n => n.network.slug === 'solana')
    : true;

  const amount = settings.quick_buy[source].amount || '0';

  const swap = async () => {
    const preset = getActivePreset(source).buy;

    const supportedPairs = (await refetch()).data;
    if (!supportedPairs?.find(p => p.quote.slug === 'wrapped-solana')) {
      notification.error({
        message: 'This coin does not have a Solana trading pair.',
      });
      return;
    }

    if (+amount === 0) {
      notification.error({
        message: 'Minimum amount should be greater than 0.0001 SOL',
      });
      return;
    }

    if (+amount > (balance ?? 0)) {
      notification.error({ message: 'Insufficient balance' });
      return;
    }

    await marketSwapHandler(
      slug,
      'wrapped-solana',
      'LONG',
      amount,
      preset.slippage,
      preset.sol_priority_fee,
    );
    notification.success({ message: 'Transaction successfully sent' });
  };

  return isSolana ? (
    <Button
      className={clsx(
        className,
        'disabled:bg-v1-surface-l2 flex items-center !rounded-3xl',
      )}
      size="xs"
      onClick={async e => {
        e.stopPropagation();
        const isLoggedIn = await ensureAuthenticated();
        if (isLoggedIn) {
          void swap();
        }
      }}
    >
      <InstantIcon />
      <span className="shrink-0">
        {isLoggedIn ? `${amount} SOL` : 'Quick Buy'}
      </span>
      {modal}
    </Button>
  ) : null;
}
