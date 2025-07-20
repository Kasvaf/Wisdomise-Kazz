import Draggable, { type ControlPosition } from 'react-draggable';
import {
  bxCheck,
  bxChevronDown,
  bxChevronUp,
  bxEditAlt,
  bxX,
} from 'boxicons-quasar';
import { useState } from 'react';
import { clsx } from 'clsx';
import { notification } from 'antd';
import { useLocalStorage } from 'usehooks-ts';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { useActiveWallet } from 'api/chains/wallet';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import QuoteSelector from 'modules/autoTrader/PageTrade/AdvancedSignalForm/QuoteSelector';
import { useAccountBalance, useMarketSwap } from 'api/chains';
import { useHasFlag } from 'api';
import {
  TraderPresetsSelector,
  TraderPresetValues,
} from 'modules/autoTrader/BuySellTrader/TraderPresets';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const { connected } = useActiveWallet();
  const { data: baseBalance } = useAccountBalance(slug);
  const { data: quoteBalance } = useAccountBalance(quote);
  const hasFlag = useHasFlag();
  const [maskIsOpen, setMaskIsOpen] = useState(false);

  const marketSwapHandler = useMarketSwap();
  const swap = async (amount: string, side: 'LONG' | 'SHORT') => {
    if (
      (side === 'LONG' && (quoteBalance ?? 0) < +amount) ||
      (side === 'SHORT' && (baseBalance ?? 0) === 0)
    ) {
      notification.error({ message: 'Insufficient balance' });
      return;
    }
    await marketSwapHandler(slug, quote, side, amount);
    notification.success({ message: 'Transaction successfully sent' });
  };

  const [isOpen, setIsOpen] = useLocalStorage('instant-open', false);
  const [position, setPosition] = useLocalStorage<ControlPosition | undefined>(
    'instant-position',
    undefined,
  );
  const [height, setHeight] = useState(240); // initial height in px
  const minHeight = 240;
  const maxHeight = 300;

  const startResizing = (e: React.MouseEvent, direction: 'top' | 'bottom') => {
    setMaskIsOpen(true);
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      let newHeight =
        direction === 'bottom' ? startHeight + delta : startHeight - delta;

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      setHeight(newHeight);
    };

    const onMouseUp = () => {
      setMaskIsOpen(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!hasFlag('/trader/instant')) return null;

  return (
    <div className="relative">
      {maskIsOpen && <div className="fixed inset-0 z-30" />}
      <Draggable
        handle="#instant-trade-drag-handle"
        cancel="button"
        defaultClassName={isOpen ? 'border border-transparent' : 'hidden'}
        defaultClassNameDragging="opacity-60 border-v1-border-primary"
        defaultPosition={position}
        onStart={() => setMaskIsOpen(true)}
        onStop={(_, data) => {
          setPosition({ x: data.x, y: data.y });
          setMaskIsOpen(false);
        }}
        bounds="body"
      >
        <div className="fixed left-0 top-0 z-50 m-4 w-[20rem] rounded-xl bg-v1-surface-l3 text-xs">
          <div
            className="relative min-h-max overflow-hidden rounded-xl"
            style={{ height }}
          >
            <div
              id="instant-trade-drag-handle"
              className="relative flex cursor-move items-center border-b border-white/5 p-3"
            >
              <DragIcon className="absolute left-1/2 top-1 size-3 -translate-x-1/2 cursor-move" />
              <TraderPresetsSelector surface={5} source="terminal" />
              <Button
                size="2xs"
                variant="ghost"
                className="ml-auto !px-2"
                onClick={() => {
                  setIsEditMode(prev => !prev);
                }}
              >
                <Icon name={isEditMode ? bxCheck : bxEditAlt} size={20} />
              </Button>
              <BtnSolanaWallets className="!px-2" size="2xs" />
              <Button
                variant="ghost"
                size="2xs"
                className="!px-2 text-v1-content-secondary"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Icon name={bxX} />
              </Button>
            </div>
            {connected ? (
              <div className="flex h-full flex-col justify-between p-3">
                <div className="mb-3 flex items-center justify-between">
                  Buy
                  <AccountBalance slug={quote} />
                </div>
                <QuoteQuickSet
                  mode="buy"
                  enableEdit={isEditMode}
                  hasEditBtn={false}
                  quote={quote}
                  btnClassName={clsx(
                    '!border-[0.5px]',
                    !isEditMode &&
                      '!border-v1-border-positive !text-v1-content-positive enabled:hover:!bg-v1-background-positive-subtle/40',
                  )}
                  className="mb-1"
                  onClick={value => swap(value, 'LONG')}
                  surface={3}
                  showAll={height === maxHeight}
                />
                <div className="flex items-center">
                  <TraderPresetValues mode="buy" />
                  <span className="ml-auto text-white/70">Pay:</span>
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
                  Sell
                  <AccountBalance slug={slug} />
                </div>
                <QuoteQuickSet
                  mode="sell"
                  quote={quote}
                  enableEdit={isEditMode}
                  hasEditBtn={false}
                  className="mb-1"
                  balance={baseBalance}
                  btnClassName={clsx(
                    '!border-[0.5px]',
                    !isEditMode &&
                      '!border-v1-border-negative !text-v1-content-negative enabled:hover:!bg-v1-background-negative-subtle/40',
                  )}
                  onClick={amount => swap(amount, 'SHORT')}
                  surface={3}
                  showAll={height === maxHeight}
                />
                <div className="flex items-center">
                  <TraderPresetValues mode="sell" />
                  <span className="ml-auto text-xs text-white/70">
                    Receive:
                  </span>
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
            <div
              className="absolute bottom-0 flex h-[5px] w-full cursor-ns-resize items-center justify-center text-white/70 transition-colors hover:bg-v1-surface-l4"
              onMouseDown={e => startResizing(e, 'bottom')}
            >
              <Icon
                name={height === maxHeight ? bxChevronUp : bxChevronDown}
                size={12}
              />
            </div>
          </div>
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
