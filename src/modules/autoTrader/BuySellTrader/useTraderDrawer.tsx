import { WRAPPED_SOLANA_SLUG } from 'api/chains/constants';
import { useSymbolInfo } from 'api/symbol';
import { clsx } from 'clsx';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { useCallback, useEffect, useState } from 'react';
import { Coin } from 'shared/Coin';
import Spinner from 'shared/Spinner';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import type { TraderInputs } from '../PageTrade/types';
import TraderTrades from '../TraderTrades';

type DrawerInputs = Omit<TraderInputs, 'quote' | 'setQuote'>;

export default function useTraderDrawer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<DrawerInputs>();
  const [quote, setQuote, setBaseSlug] = useActiveQuote();

  const normSlug =
    inputs?.slug === 'solana' ? WRAPPED_SOLANA_SLUG : inputs?.slug;
  const { data: coin, isLoading: coinLoading } = useSymbolInfo({
    slug: normSlug,
  });

  useEffect(() => {
    if (normSlug) {
      setBaseSlug(normSlug);
    }
  }, [normSlug, setBaseSlug]);

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <Dialog
        className={clsx(!isMobile && 'w-[400px]')}
        contentClassName="p-4"
        drawerConfig={{
          position: isMobile ? 'bottom' : 'end',
          closeButton: isMobile,
        }}
        mode="drawer"
        onClose={useCallback(() => setOpen(false), [])}
        open={open}
        surface={0}
      >
        {inputs && open && (
          <ActiveNetworkProvider base={inputs.slug} quote={quote}>
            {coinLoading ? (
              <div className="my-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="relative">
                <div className="mb-8 flex items-center justify-between">
                  {coin && <Coin coin={coin} />}
                  <BtnWalletConnect />
                </div>

                <TraderTrades
                  quote={quote}
                  setQuote={setQuote}
                  {...inputs}
                  loadingClassName="bg-v1-surface-l4"
                />
              </div>
            )}
          </ActiveNetworkProvider>
        )}
      </Dialog>
    </div>
  );

  return [
    component,
    (inputs: DrawerInputs & { quote?: string }) => {
      setInputs(inputs);
      setOpen(true);
    },
  ] as const;
}
