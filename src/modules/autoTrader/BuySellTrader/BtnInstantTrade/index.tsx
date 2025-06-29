import Draggable from 'react-draggable';
import { bxEdit, bxX } from 'boxicons-quasar';
import { useState } from 'react';
import { clsx } from 'clsx';
import { notification } from 'antd';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import SensibleSteps from 'modules/autoTrader/BuySellTrader/SensibleSteps';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { useActiveWallet } from 'api/chains/wallet';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import QuoteSelector from 'modules/autoTrader/PageTrade/AdvancedSignalForm/QuoteSelector';
import { useAccountBalance, useMarketSwap } from 'api/chains';
import { useSolanaUserAssets } from 'api/chains/solana';
import { NotTradable } from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/TraderSection';
import { useSupportedPairs } from 'api';
import { ReactComponent as InstantIcon } from './instant.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as DragIcon } from './drag.svg';

export default function BtnInstantTrade({
  slug,
  quote,
  setQuote,
}: {
  slug: string;
  quote: string;
  setQuote: (newVal: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useActiveWallet();
  const marketSwapHandler = useMarketSwap();
  const { refetch: refetchAssets } = useSolanaUserAssets();
  const { data: baseBalance, refetch: refetchBase } = useAccountBalance(
    slug,
    'solana',
  );
  const { refetch: refetchQuote } = useAccountBalance(quote, 'solana');
  const { data: supportedPairs, isLoading, error } = useSupportedPairs(slug);

  const swap = async (amount: string, side: 'LONG' | 'SHORT') => {
    await marketSwapHandler(slug, quote, side, amount);
    notification.success({ message: 'Transaction successfully sent' });
    setTimeout(() => {
      void refetchAssets();
      void refetchBase();
      void refetchQuote();
    }, 5000);
  };

  return (
    <div className="relative">
      <Draggable
        handle="#instant-trade-drag-handle"
        defaultClassName={isOpen ? '' : 'hidden'}
        defaultClassNameDragging="opacity-60"
      >
        <div className="absolute -top-96 right-8 z-50 w-[20rem] rounded-xl bg-v1-surface-l3 text-xs">
          <div
            id="instant-trade-drag-handle"
            className="relative flex cursor-move items-center border-b border-white/5 px-1 py-2"
          >
            <button className="absolute left-1/2 top-2 -translate-x-1/2">
              <DragIcon />
            </button>
            <Button size="xs" variant="ghost" className="ml-auto !px-2">
              <Icon name={bxEdit} size={20} />
            </Button>
            <BtnSolanaWallets />
            <Button
              variant="ghost"
              size="xs"
              className="!px-2 text-v1-content-secondary"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon name={bxX} />
            </Button>
          </div>
          {!isLoading && !supportedPairs?.length ? (
            <NotTradable error={error} />
          ) : connected ? (
            <div className="p-3">
              <div className="mb-3 flex items-center justify-between">
                Buy
                <AccountBalance slug={quote} />
              </div>
              <SensibleSteps
                mode="buy"
                btnClassName="!border-v1-border-positive !border-[0.5px] !text-v1-content-positive enabled:hover:!bg-v1-background-positive-subtle"
                className="mb-1"
                onClick={value => swap(value, 'LONG')}
                surface={3}
              />
              <div className="flex items-center justify-end">
                <span className="text-v1-content-secondary">Pay:</span>
                <QuoteSelector
                  className="-mr-3"
                  baseSlug={slug}
                  value={quote}
                  onChange={setQuote}
                  size="xs"
                />
              </div>
              <hr className="my-3 border-white/5" />
              <div className="mb-3 flex items-center justify-between">
                <div>
                  Sell
                  {/* <Button */}
                  {/*   variant="ghost" */}
                  {/*   size="2xs" */}
                  {/*   className="!px-2" */}
                  {/*   onClick={() => setIsPercentage(prev => !prev)} */}
                  {/* > */}
                  {/*   {isPercentage ? '%' : quoteInfo?.abbreviation} */}
                  {/*   <Icon name={bxTransfer} size={12} /> */}
                  {/* </Button> */}
                </div>
                <AccountBalance slug={slug} />
              </div>
              <SensibleSteps
                mode="sell"
                className="mb-1"
                balance={baseBalance}
                btnClassName="!border-v1-border-negative !border-[0.5px] !text-v1-content-negative enabled:hover:!bg-v1-background-negative-subtle"
                onClick={amount => swap(amount, 'SHORT')}
                surface={3}
              />
              <div className="flex items-center justify-end">
                <span className="text-v1-content-secondary">Receive:</span>
                <QuoteSelector
                  className="-mr-3"
                  baseSlug={slug}
                  value={quote}
                  onChange={setQuote}
                  size="xs"
                />
              </div>
            </div>
          ) : (
            <div className="p-3">
              <p>
                Connect your wallet or switch to a custodial one in order to
                trade
              </p>
              <BtnAppKitWalletConnect
                network="solana"
                className="mt-3 w-full"
              />
            </div>
          )}
        </div>
      </Draggable>
      <Button
        variant="outline"
        size="sm"
        className={clsx(
          '!border-v1-border-brand !bg-transparent !text-v1-content-brand',
          isOpen && '!bg-v1-background-hover',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <InstantIcon />
        Instant Trade
      </Button>
    </div>
  );
}
