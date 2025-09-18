import { notification } from 'antd';
import { useTokenPairsQuery } from 'api';
import { useSwap } from 'api/chains';
import type { CoinNetwork } from 'api/discovery';
import { clsx } from 'clsx';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function BtnQuickBuy({
  source,
  slug,
  tokenAddress,
  className,
  networks,
  size = 'xs',
}: {
  source: TradeSettingsSource;
  slug: string;
  tokenAddress?: string;
  className?: string;
  networks?: CoinNetwork[] | null;
  size?: ButtonSize;
}) {
  const quote = 'wrapped-solana';

  const { settings } = useUserSettings();
  const swapAsync = useSwap({ slug, quote, source, tokenAddress });
  const { refetch } = useTokenPairsQuery(slug, { enabled: false });
  const isLoggedIn = useIsLoggedIn();
  const [modal, ensureAuthenticated] = useEnsureAuthenticated();

  const isSolana = networks
    ? networks.find(n => n.network.slug === 'solana')
    : true;

  const amount = settings.quick_buy[source].amount || '0';

  const swap = async () => {
    const supportedPairs = (await refetch()).data;
    if (!supportedPairs?.find(p => p.quote.slug === quote)) {
      notification.error({
        message: 'This coin does not have a Solana trading pair.',
      });
      return;
    }

    await swapAsync('LONG', amount);
  };

  return isSolana ? (
    <Button
      className={clsx(
        className,
        '!rounded-3xl flex items-center disabled:bg-v1-surface-l2',
      )}
      onClick={async e => {
        e.stopPropagation();
        e.preventDefault();
        const isLoggedIn = await ensureAuthenticated();
        if (isLoggedIn) {
          void swap();
        }
      }}
      size={size}
    >
      <InstantIcon />
      <span className="shrink-0">
        {isLoggedIn ? `${amount} SOL` : 'Quick Buy'}
      </span>
      {modal}
    </Button>
  ) : null;
}
