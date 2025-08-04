import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { useSymbolInfo } from 'api/symbol';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import useIsMobile from 'utils/useIsMobile';
import Spinner from 'shared/Spinner';
import { Coin } from 'shared/Coin';
import { Dialog } from 'shared/v1-components/Dialog';
import { type TraderInputs } from '../PageTrade/types';
import TraderTrades from '../TraderTrades';

type DrawerInputs = Omit<TraderInputs, 'quote' | 'setQuote'>;

export default function useTraderDrawer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<DrawerInputs>();
  const [quote, setQuote] = useState('tether');

  const normSlug = inputs?.slug === 'solana' ? 'wrapped-solana' : inputs?.slug;
  const { data: coin, isLoading: coinLoading } = useSymbolInfo(normSlug);

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <Dialog
        open={open}
        onClose={useCallback(() => setOpen(false), [])}
        mode="drawer"
        drawerConfig={{
          position: isMobile ? 'bottom' : 'end',
          closeButton: isMobile,
        }}
        className={clsx(!isMobile && 'w-[400px]')}
        contentClassName="p-4"
        surface={2}
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
      setQuote(inputs.quote ?? 'tether');
      setOpen(true);
    },
  ] as const;
}
