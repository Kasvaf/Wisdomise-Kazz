import { notification } from 'antd';
import { clsx } from 'clsx';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import React from 'react';
import { useSwap } from 'services/chains';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useTokenPairsQuery } from 'services/rest';
import type { CoinNetwork } from 'services/rest/discovery';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

const BtnQuickBuy = React.memo(function BtnQuickBuy({
  source,
  slug,
  tokenAddress,
  className,
  networks,
  size = '2xs',
  surface = 2,
}: {
  source: TradeSettingsSource;
  slug: string;
  tokenAddress?: string;
  className?: string;
  networks?: CoinNetwork[] | null;
  size?: ButtonSize;
  surface?: Surface;
}) {
  const quote = WRAPPED_SOLANA_SLUG;

  const { settings } = useUserSettings();
  const swapAsync = useSwap({ slug, quote, source, tokenAddress });
  const { refetch } = useTokenPairsQuery(slug, { enabled: false });
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
        '!px-2 !text-v1-content-brand flex items-center',
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
      surface={surface}
      variant="ghost"
    >
      <InstantIcon />
      <span className="shrink-0">{amount} SOL</span>
      {modal}
    </Button>
  ) : null;
});

export default BtnQuickBuy;
