import { useCallback, useState } from 'react';
import { DrawerModal } from 'shared/DrawerModal';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Spinner from 'shared/Spinner';
import { Coin } from 'shared/Coin';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { useSymbolInfo } from 'api/symbol';
import { type TraderInputs } from '../PageTrade/types';
import BuySellTrader from '.';

type DrawerInputs = Omit<TraderInputs, 'quote' | 'setQuote'>;

export default function useTraderDrawer() {
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<DrawerInputs>();
  const [quote, setQuote] = useState('tether');

  const normSlug = inputs?.slug === 'solana' ? 'wrapped-solana' : inputs?.slug;
  const { data: coin, isLoading: coinLoading } = useSymbolInfo(normSlug);

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <DrawerModal
        open={open}
        onClose={useCallback(() => setOpen(false), [])}
        maskClosable={true}
        closeIcon={null}
        width={400}
        destroyOnClose
        rootClassName="[&_.ant-drawer-body]:-mt-8"
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

                <BuySellTrader
                  quote={quote}
                  setQuote={setQuote}
                  {...inputs}
                  loadingClassName="bg-v1-surface-l4"
                />
              </div>
            )}
          </ActiveNetworkProvider>
        )}
      </DrawerModal>
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
