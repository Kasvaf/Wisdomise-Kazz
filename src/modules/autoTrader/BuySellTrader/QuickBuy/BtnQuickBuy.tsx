import { notification } from 'antd';
import { useTokenPairsQuery } from 'api';
import { useSwap } from 'api/chains';
import { WRAPPED_SOLANA_SLUG } from 'api/chains/constants';
import type { CoinNetwork } from 'api/discovery';
import { clsx } from 'clsx';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import React from 'react';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

const BtnQuickBuy = React.memo(function BtnQuickBuy({
  source,
  slug,
  tokenAddress,
  className,
  networks,
  size = '2xs',
}: {
  source: TradeSettingsSource;
  slug: string;
  tokenAddress?: string;
  className?: string;
  networks?: CoinNetwork[] | null;
  size?: ButtonSize;
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
      className={clsx(className, '!px-2 flex items-center')}
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
      <span className="shrink-0">{amount} SOL</span>
      {modal}
    </Button>
  ) : null;
});

export default BtnQuickBuy;
