import { NavLink } from 'react-router-dom';
import { roundSensible } from 'utils/numbers';
import { type CreatePositionRequest } from 'api';
import { useAccountNativeBalance } from 'api/chains';
import Spin from 'shared/Spin';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as ProIcon } from 'assets/Pro.svg';
import { isMiniApp } from 'utils/version';
import { Coin } from 'shared/Coin';
import { useSimulatePrepare } from 'modules/autoTrader/BuySellTrader/useSimulatePrepare';
import InfoLine from '../components/InfoLine';
import MessageBox from '../components/MessageBox';
import { type SwapState } from './useSwapState';

export const SimulatePrepare: React.FC<{
  formState: SwapState;
  createData?: CreatePositionRequest;
}> = ({ formState, createData }) => {
  const { isLoading, hasEnoughGas, impact, data } = useSimulatePrepare({
    formState,
    createData,
  });
  const { from, to, isMarketPrice } = formState;

  const net = useActiveNetwork();
  const gasAbbr = net === 'the-open-network' ? 'TON' : 'SOL';
  const { data: nativeBalance } = useAccountNativeBalance();

  const nativeAmount =
    (data && 'gas_fee' in data ? Number(data?.gas_fee) : 0) +
    (from.coinInfo?.abbreviation === gasAbbr ? +from.amount : 0);

  const remainingGas = Number(nativeBalance) - nativeAmount;

  return (
    <div className="mt-3 flex h-full flex-col">
      <div className="flex grow flex-col gap-2">
        {from.coinInfo && <Coin nonLink coin={from.coinInfo} mini />}
        <InfoLine label="Initial Deposit (Send)" className="text-xs">
          <div className="font-medium">
            {from.amount} {from?.coinInfo?.abbreviation}
          </div>
        </InfoLine>

        {data && 'gas_fee' in data && (
          // direct swap doesn't require gas reserve
          <InfoLine
            label="Gas Fee (Reserved)"
            info="This gas amount will be temporarily held and any unused gas will be refunded once the position is closed."
            className="text-xs"
          >
            {isLoading ? (
              <Spin />
            ) : data?.gas_fee ? (
              String(data.gas_fee) + ' ' + gasAbbr
            ) : (
              ''
            )}
          </InfoLine>
        )}

        <hr className="my-1 border-white/10" />

        {to.coinInfo && <Coin nonLink coin={to.coinInfo} mini />}

        {isMarketPrice && (
          <InfoLine
            label="Minimum Received"
            info="The guaranteed minimum you'll receive after slippage and fees."
            className="text-xs"
          >
            <div className="font-medium">
              {data?.min_ask ? (
                roundSensible(data.min_ask)
              ) : Number(from.amount) === 0 ? (
                0
              ) : (
                <Spin />
              )}{' '}
              {to?.coinInfo?.abbreviation}
            </div>
          </InfoLine>
        )}

        <InfoLine
          label="Estimated Amount"
          info="It shows the expected return based on current market prices."
          className="text-xs"
        >
          <div className="font-medium">
            {isMarketPrice ? (
              data?.ask_amount ? (
                roundSensible(data.ask_amount)
              ) : Number(from.amount) === 0 ? (
                0
              ) : (
                <Spin />
              )
            ) : (
              to.amount
            )}{' '}
            {to?.coinInfo?.abbreviation}
          </div>
        </InfoLine>

        <div className="text-xs font-light text-v1-content-notice/70">
          <strong>Note:</strong> Actual execution prices may vary due to market
          conditions and slippage.
        </div>

        {data?.trade_fee && (
          <>
            <InfoLine label="Fee" className="mt-2 text-xs">
              {Number(data?.trade_fee) * 100}% of transactions + network gas fee
            </InfoLine>

            {!isLoading && !isMiniApp && Number(data?.trade_fee) > 0.6 && (
              <NavLink
                to="/account/billing"
                className="mt-2 flex items-center gap-2 text-xs"
              >
                <ProIcon className="size-6" />
                <div>
                  <div>Upgrade to pay less fees—only pay gas</div>
                  <div className="text-v1-content-brand">
                    See Subscription Plans
                  </div>
                </div>
              </NavLink>
            )}
          </>
        )}

        {!hasEnoughGas && !Number.isNaN(remainingGas) && (
          <MessageBox variant="error" className="!text-xs">
            Your {gasAbbr} balance might be insufficient to cover gas fees.
            Please ensure you have enough {gasAbbr} to proceed.
          </MessageBox>
        )}

        {impact >= 0.05 ? (
          <MessageBox
            variant="error"
            title="🚨 High Slippage Detected!"
            className="!text-xs"
          >
            The price impact for this trade exceeds 5%, which could lead to
            significant losses. Trading has been disabled to protect your funds.
            Please adjust your trade size or try again later.
          </MessageBox>
        ) : impact >= 0.02 ? (
          <MessageBox
            variant="warning"
            title="⚠️ Warning: High Slippage!"
            className="!text-xs"
          >
            Your trade has a appriximately {roundSensible(impact * 100)}% price
            impact, which may result in a less favorable execution price.
            Proceed with caution or consider adjusting your trade size.
          </MessageBox>
        ) : null}

        {data?.warning && (
          <MessageBox variant="warning" className="!text-xs">
            {data?.warning}
          </MessageBox>
        )}
        {data?.error && (
          <MessageBox variant="error" className="!text-xs">
            {data?.error}
          </MessageBox>
        )}
      </div>
    </div>
  );
};
