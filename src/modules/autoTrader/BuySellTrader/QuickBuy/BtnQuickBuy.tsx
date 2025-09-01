import { notification } from 'antd';
import { useSupportedPairs } from 'api';
import { useMarketSwap } from 'api/chains';
import type { CoinNetwork } from 'api/discovery';
import { clsx } from 'clsx';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import {
  type QuickBuySource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button } from 'shared/v1-components/Button';
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
  const quote = 'wrapped-solana';
  const { settings, getActivePreset } = useUserSettings();
  const marketSwapHandler = useMarketSwap({ slug, quote });
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
    if (!supportedPairs?.find(p => p.quote.slug === quote)) {
      notification.error({
        message: 'This coin does not have a Solana trading pair.',
      });
      return;
    }

    await marketSwapHandler(
      'LONG',
      amount,
      preset.slippage,
      preset.sol_priority_fee,
    );
  };

  return isSolana ? (
    <Button
      className={clsx(
        className,
        '!rounded-3xl flex items-center disabled:bg-v1-surface-l2',
      )}
      onClick={async e => {
        e.stopPropagation();
        const isLoggedIn = await ensureAuthenticated();
        if (isLoggedIn) {
          void swap();
        }
      }}
      size="xs"
    >
      <InstantIcon />
      <span className="shrink-0">
        {isLoggedIn ? `${amount} SOL` : 'Quick Buy'}
      </span>
      {modal}
    </Button>
  ) : null;
}
