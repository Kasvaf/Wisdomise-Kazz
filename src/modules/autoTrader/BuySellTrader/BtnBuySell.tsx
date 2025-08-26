import { useActiveWallet } from 'api/chains/wallet';
import { useSymbolInfo } from 'api/symbol';
import { SimulatePrepare } from 'modules/autoTrader/BuySellTrader/SimulatePrepare';
import { ReactComponent as WarnIcon } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/WarnIcon.svg';
import { useActiveNetwork } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import usePageTour from 'shared/usePageTour';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import useActionHandlers from './useActionHandlers';
import type { SwapState } from './useSwapState';

const BtnBuySell: React.FC<{ state: SwapState; className?: string }> = ({
  state,
  className,
}) => {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();

  const net = useActiveNetwork();
  const wallet = useActiveWallet();
  const {
    dir,
    quote,
    from: { balanceLoading, balance, amount },
  } = state;
  const { withdrawDepositModal, deposit } = useWalletActionHandler();
  const { data: quoteInfo } = useSymbolInfo(quote.slug);

  const { firePosition, isEnabled, isSubmitting } = useActionHandlers(state);

  const isTon = net === 'the-open-network';
  const zeroBalance = !balanceLoading && balance != null && !balance;
  const insufficientBalance = zeroBalance || (balance ?? 0) < Number(amount);
  const showDeposit =
    wallet.isCustodial && !balance && !balanceLoading && dir === 'buy';
  const showConnect = isLoggedIn && !wallet.isCustodial && !wallet.connected;

  const isMobile = useIsMobile();
  usePageTour({
    key: `${isTon ? 'ton' : 'appkit'}-connect-tour`,
    enabled: !wallet.connected && !isMobile,
    steps: [
      {
        selector: '.id-tour-wallet-connect',
        content: (
          <>
            <div className="mb-2 font-semibold">
              Connect your wallet to start trading.
            </div>

            <p className="mb-2">
              {isTon
                ? 'This coin is on the Ton Network, and wallets like TonKeeper are supported.'
                : 'Supports Solana wallets like Phantom, Solflare, and Trust Wallet.'}
            </p>

            {/* <div> */}
            {/*   <a */}
            {/*     href="https://wisdomise.gitbook.io/auto-trade-guidance/readme-1" */}
            {/*     target="_blank" */}
            {/*     rel="noreferrer" */}
            {/*     className="flex items-center text-v1-content-link hover:text-v1-content-link-hover" */}
            {/*   > */}
            {/*     <Icon name={bxLink} size={16} className="mr-1" /> */}
            {/*     Read more about supported wallets */}
            {/*   </a> */}
            {/* </div> */}
          </>
        ),
      },

      {
        selector: '.id-tour-wallet-connect',
        content: (
          <>
            <div className="mb-2 font-semibold">
              Ensure you have enough balance and gas.
            </div>

            <p className="mb-2">
              {isTon
                ? 'You’ll need TON for network fees.'
                : 'You’ll need SOL for network fees.'}
            </p>

            {/* <div> */}
            {/*   <a */}
            {/*     href="https://wisdomise.gitbook.io/auto-trade-guidance/readme-1" */}
            {/*     target="_blank" */}
            {/*     rel="noreferrer" */}
            {/*     className="text-v1-content-link hover:text-v1-content-link-hover flex items-center" */}
            {/*   > */}
            {/*     <Icon name={bxLink} size={16} className="mr-1" /> */}
            {/*     Read more about wallet requirements */}
            {/*   </a> */}
            {/* </div> */}
          </>
        ),
      },
    ],
  });

  return (
    <>
      {ModalLogin}
      {showDeposit ? (
        <Button
          className={className}
          onClick={() => deposit(wallet.address ?? '')}
        >
          Deposit {quoteInfo?.abbreviation} to Buy
        </Button>
      ) : (
        <Button
          className={className}
          disabled={isLoggedIn && (!isEnabled || insufficientBalance)}
          loading={isSubmitting}
          onClick={isLoggedIn ? firePosition : showModalLogin}
          variant={dir === 'buy' ? 'positive' : 'negative'}
        >
          {showConnect ? (
            'Connect Wallet'
          ) : isLoggedIn && insufficientBalance ? (
            <>
              <WarnIcon className="mr-2" />
              <span className="text-white/70">Insufficient Balance</span>
            </>
          ) : dir === 'buy' ? (
            'Buy'
          ) : (
            'Sell'
          )}
        </Button>
      )}
      <SimulatePrepare formState={state} />
      {withdrawDepositModal}
    </>
  );
};

export default BtnBuySell;
