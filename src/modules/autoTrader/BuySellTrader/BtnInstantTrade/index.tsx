import { useHasFlag, useLastPriceStream } from 'api';
import { useSwap, useTokenBalance } from 'api/chains';
import { useActiveWallet, useCustodialWallet } from 'api/chains/wallet';
import { useWalletsQuery } from 'api/wallets';
import {
  bxCheck,
  bxChevronDown,
  bxChevronUp,
  bxEditAlt,
  bxX,
} from 'boxicons-quasar';
import { clsx } from 'clsx';
import AmountTypeSwitch from 'modules/autoTrader/BuySellTrader/AmountTypeSwitch';
import QuoteQuickSet from 'modules/autoTrader/BuySellTrader/QuoteQuickSet';
import {
  TraderPresetsSelector,
  TraderPresetValues,
} from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { convertToBaseAmount } from 'modules/autoTrader/BuySellTrader/utils';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';
import QuoteSelector from 'modules/autoTrader/PageTrade/AdvancedSignalForm/QuoteSelector';
import TokenActivity from 'modules/autoTrader/TokenActivity';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { useState } from 'react';
import Draggable, { type ControlPosition } from 'react-draggable';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useLocalStorage } from 'usehooks-ts';
import { ReactComponent as DragIcon } from './drag.svg';
import { ReactComponent as InstantIcon } from './instant.svg';

export default function BtnInstantTrade({
  slug,
  quote,
  setQuote,
  className,
}: {
  slug: string;
  quote: string;
  setQuote: (newVal: string) => void;
  className?: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { connected } = useActiveWallet();
  const { data: baseBalance } = useTokenBalance({ slug });
  const hasFlag = useHasFlag();
  const [maskIsOpen, setMaskIsOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const [loginModal, open] = useModalLogin();
  const { setCw } = useCustodialWallet();
  const { data: wallets } = useWalletsQuery();

  const { data: basePriceByQuote } = useLastPriceStream({
    slug,
    quote,
    convertToUsd: false,
  });

  const swapAsync = useSwap({ source: 'terminal', slug, quote });
  const swap = async (amount: string, side: 'LONG' | 'SHORT') => {
    if (side === 'SHORT') {
      amount = convertToBaseAmount(
        amount,
        sellAmountType,
        baseBalance,
        1 / (basePriceByQuote ?? 1),
      );
    }

    await swapAsync(side, amount);
  };

  const [isOpen, setIsOpen] = useLocalStorage('instant-open', false);
  const [position, setPosition] = useLocalStorage<ControlPosition | undefined>(
    'instant-position',
    undefined,
  );
  const [height, setHeight] = useState(240); // initial height in px
  const minHeight = 240;
  const maxHeight = 300;

  const [sellAmountType, setSellAmountType] = useState<
    'percentage' | 'base' | 'quote'
  >('percentage');

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
    <>
      <div className="relative mobile:hidden">
        {maskIsOpen && <div className="fixed inset-0 z-50" />}
        <Draggable
          bounds="body"
          cancel="button"
          defaultClassName={isOpen ? 'border border-white/10' : 'hidden'}
          defaultClassNameDragging="opacity-60 !border-v1-border-primary"
          defaultPosition={position}
          handle="#instant-trade-drag-handle"
          onStart={() => setMaskIsOpen(true)}
          onStop={(_, data) => {
            setPosition({ x: data.x, y: data.y });
            setMaskIsOpen(false);
          }}
        >
          <div className="fixed top-0 left-0 z-50 m-4 w-[20rem] rounded-xl bg-v1-surface-l1 text-xs">
            <div
              className="relative min-h-max overflow-hidden rounded-xl"
              style={{ height }}
            >
              <div
                className="relative flex cursor-move items-center gap-2 border-white/5 border-b p-3"
                id="instant-trade-drag-handle"
              >
                <DragIcon className="-translate-x-1/2 absolute top-1 left-1/2 size-3 cursor-move" />
                <TraderPresetsSelector source="terminal" surface={2} />
                <Button
                  className="ml-auto"
                  fab
                  onClick={() => {
                    setIsEditMode(prev => !prev);
                  }}
                  size="2xs"
                  surface={1}
                  variant="ghost"
                >
                  <Icon name={isEditMode ? bxCheck : bxEditAlt} />
                </Button>
                <BtnSolanaWallets fab size="2xs" />
                <Button
                  className="text-v1-content-secondary"
                  fab
                  onClick={() => setIsOpen(!isOpen)}
                  size="2xs"
                  surface={1}
                  variant="ghost"
                >
                  <Icon name={bxX} />
                </Button>
              </div>
              {connected ? (
                <>
                  <div className="flex h-full flex-col justify-between p-3">
                    <div className="mb-3 flex items-center justify-between">
                      Buy
                      <AccountBalance slug={quote} />
                    </div>
                    <QuoteQuickSet
                      btnClassName={clsx(
                        '!border-[0.5px]',
                        !isEditMode &&
                          '!border-v1-border-positive !text-v1-content-positive enabled:hover:!bg-v1-background-positive-subtle/40',
                      )}
                      className="mb-1"
                      enableEdit={isEditMode}
                      hasEditBtn={false}
                      mode="buy"
                      onClick={value => swap(value, 'LONG')}
                      quote={quote}
                      showAll={height === maxHeight}
                      surface={1}
                    />
                    <div className="flex items-center">
                      <TraderPresetValues mode="buy" />
                      <span className="ml-auto text-white/70">Pay:</span>
                      <QuoteSelector
                        baseSlug={slug}
                        className="-mr-3"
                        onChange={setQuote}
                        size="xs"
                        value={quote}
                      />
                    </div>
                    <hr className="my-3 border-white/5" />
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        Sell
                        <AmountTypeSwitch
                          onChange={newType => {
                            setSellAmountType(newType);
                          }}
                          quote={quote}
                          showIcon
                          surface={1}
                          value={sellAmountType}
                        />
                      </div>
                      <AccountBalance quote={quote} slug={slug} />
                    </div>
                    <QuoteQuickSet
                      balance={baseBalance}
                      btnClassName={clsx(
                        '!border-[0.5px]',
                        !isEditMode &&
                          '!border-v1-border-negative !text-v1-content-negative enabled:hover:!bg-v1-background-negative-subtle/40',
                      )}
                      className="mb-1"
                      enableEdit={isEditMode}
                      hasEditBtn={false}
                      mode={
                        sellAmountType === 'percentage'
                          ? 'sell_percentage'
                          : 'sell'
                      }
                      onClick={amount => swap(amount, 'SHORT')}
                      quote={quote}
                      showAll={height === maxHeight}
                      surface={1}
                    />
                    <div className="flex items-center">
                      <TraderPresetValues mode="sell" />
                      <span className="ml-auto text-white/70 text-xs">
                        Receive:
                      </span>
                      <QuoteSelector
                        baseSlug={slug}
                        className="-mr-3"
                        onChange={setQuote}
                        size="xs"
                        value={quote}
                      />
                    </div>
                  </div>
                  <TokenActivity mini />
                </>
              ) : (
                <div className="p-3">
                  <p>For instant trading, switch to a custodial wallet</p>
                  <Button
                    className="mt-6 w-full"
                    onClick={() => {
                      setCw(wallets?.results[0].key);
                    }}
                    size="sm"
                  >
                    Switch to Custodial Wallet
                  </Button>
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
      </div>
      <Button
        className={clsx(
          '!border-v1-border-brand !bg-transparent !text-v1-content-brand mobile:hidden',
          isOpen && '!bg-v1-background-hover',
          className,
        )}
        onClick={() => {
          if (!isLoggedIn) open();
          else setIsOpen(!isOpen);
        }}
        size="2xs"
        variant="outline"
      >
        <InstantIcon />
        Instant Trade
      </Button>
      {loginModal}
    </>
  );
}
