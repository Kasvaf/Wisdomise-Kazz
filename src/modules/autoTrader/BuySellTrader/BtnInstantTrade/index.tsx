import Draggable from 'react-draggable';
import { bxEdit, bxX } from 'boxicons-quasar';
import { useState } from 'react';
import { clsx } from 'clsx';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import SensibleSteps from 'modules/autoTrader/BuySellTrader/SensibleSteps';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AmountBalanceLabel';
import { useAccountBalance } from 'api/chains';
import { useActiveWallet } from 'api/chains/wallet';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import { ReactComponent as InstantIcon } from './instant.svg';
import { ReactComponent as DragIcon } from './drag.svg';

export default function BtnInstantTrade() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: buyTokenBalance } = useAccountBalance(
    'wrapped-solana',
    'solana',
  );
  const { data: sellTokenBalance } = useAccountBalance('bonk', 'solana');
  const { connected } = useActiveWallet();

  return (
    <div className="relative">
      <Draggable
        handle="#instant-trade-drag-handle"
        defaultClassName={isOpen ? '' : 'hidden'}
      >
        <div className="absolute -top-20 z-50 w-[20rem] rounded-xl bg-v1-surface-l3 text-xs">
          <div
            id="instant-trade-drag-handle"
            className="relative flex cursor-move items-center border-b border-white/5 py-2"
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
          {connected ? (
            <div className="p-3">
              <div className="mb-3 flex items-center justify-between">
                Buy
                <AccountBalance slug="wrapped-solana" />
              </div>
              <SensibleSteps
                mode="buy"
                token="wrapped-solana"
                balance={buyTokenBalance}
                onClick={() => {
                  console.log('yo');
                }}
                surface={3}
              />
              <hr className="my-3 border-white/5" />
              <div className="mb-3 flex items-center justify-between">
                Sell
                <AccountBalance slug="bonk" />
              </div>
              <SensibleSteps
                mode="sell"
                token="bonk"
                balance={sellTokenBalance}
                onClick={() => {
                  console.log('yo');
                }}
                surface={3}
              />
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
