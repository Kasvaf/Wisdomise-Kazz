import { ReactComponent as WarnIcon } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/WarnIcon.svg';
import { useActiveNetwork } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useWallets } from 'services/chains/wallet';
import { useTokenInfo } from 'services/rest/token-info';
import { useChartConvertToUSD } from 'shared/AdvancedChart/chartSettings';
import usePageTour from 'shared/usePageTour';
import { Button } from 'shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';
import useActionHandlers from './useActionHandlers';
import type { SwapState } from './useSwapState';

const BtnBuySell: React.FC<{ state: SwapState; className?: string }> = ({
  state,
  className,
}) => {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();

  const net = useActiveNetwork();
  const { isCustodial, connectedWallet, primaryWallet } = useWallets();
  const {
    dir,
    quote,
    from: { balanceLoading, balance, amount },
    isMarketPrice,
    limit,
    chartIsMC,
  } = state;
  const [chartIsUSD] = useChartConvertToUSD();
  const { withdrawDepositModal, deposit } = useWalletActionHandler();
  const { data: quoteInfo } = useTokenInfo({ slug: quote.slug });

  const { firePosition, isEnabled, isSubmitting } = useActionHandlers(state);

  const isTon = net === 'the-open-network';
  const zeroBalance = !balanceLoading && balance != null && !balance;
  const insufficientBalance = zeroBalance || (balance ?? 0) < Number(amount);
  const showDeposit =
    isCustodial && !balance && !balanceLoading && dir === 'buy';
  const showConnect = isLoggedIn && !isCustodial && !connectedWallet.address;
  const formatedLimit = formatNumber(+limit, {
    decimalLength: 2,
    minifyDecimalRepeats: true,
    compactInteger: true,
    separateByComma: false,
  });
  const limitText = isMarketPrice
    ? ''
    : ` @ ${chartIsUSD ? '$' : ''}${formatedLimit} ${chartIsUSD ? '' : quote.coinInfo?.symbol} ${chartIsMC ? 'MC' : ''}`;

  usePageTour({
    key: `${isTon ? 'ton' : 'appkit'}-connect-tour`,
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
                ? "You'll need TON for network fees."
                : "You'll need SOL for network fees."}
            </p>
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
          onClick={() => deposit(primaryWallet.address ?? '')}
        >
          Deposit {quoteInfo?.symbol} to Buy
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
            `Buy${limitText}`
          ) : (
            `Sell${limitText}`
          )}
        </Button>
      )}
      {withdrawDepositModal}
    </>
  );
};

export default BtnBuySell;
