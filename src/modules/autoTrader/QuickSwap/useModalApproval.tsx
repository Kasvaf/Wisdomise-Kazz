import { NavLink } from 'react-router-dom';
import { roundSensible } from 'utils/numbers';
import { type CreatePositionRequest, usePreparePositionQuery } from 'api';
import { useAccountNativeBalance } from 'api/chains';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import Spin from 'shared/Spin';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as ProIcon } from 'assets/Pro.svg';
import { isMiniApp } from 'utils/version';
import { Coin } from 'shared/Coin';
import InfoLine from '../components/InfoLine';
import MessageBox from '../components/MessageBox';
import { type SwapState } from './useSwapState';

const MIN_GAS = {
  TON: 0.1,
  SOL: 0,
};

const ModalApproval: React.FC<{
  formState: SwapState;
  createData: CreatePositionRequest;
  onResolve?: (fired?: boolean) => void;
}> = ({ formState, createData, onResolve }) => {
  const { from, to, isMarketPrice } = formState;

  const net = useActiveNetwork();
  const gasAbbr = net === 'the-open-network' ? 'TON' : 'SOL';
  const { data: nativeBalance } = useAccountNativeBalance();
  const { data, isLoading } = usePreparePositionQuery(createData);

  const nativeAmount =
    Number(data?.gas_fee) +
    (from.coinInfo?.abbreviation === gasAbbr ? +from.amount : 0);

  const remainingGas = Number(nativeBalance) - nativeAmount;
  const hasEnoughGas = remainingGas > MIN_GAS[gasAbbr];
  const impact = Number(data?.price_impact);

  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex grow flex-col gap-4">
        {from.coinInfo && <Coin nonLink coin={from.coinInfo} />}
        <InfoLine label="Initial Deposit (Send)">
          <div className="font-medium">
            {from.amount} {from?.coinInfo?.abbreviation}
          </div>
        </InfoLine>

        <InfoLine
          label="Gas Fee (Reserved)"
          info="This gas amount will be temporarily held and any unused gas will be refunded once the position is closed."
          className="text-sm"
        >
          {isLoading ? (
            <Spin />
          ) : data?.gas_fee ? (
            String(data.gas_fee) + ' ' + gasAbbr
          ) : (
            ''
          )}
        </InfoLine>

        <div className="my-2 border border-white/5" />

        {to.coinInfo && <Coin nonLink coin={to.coinInfo} />}

        {isMarketPrice && (
          <InfoLine
            label="Minimum Received"
            info="The guaranteed minimum you'll receive after slippage and fees."
          >
            <div className="font-medium">
              {data?.min_ask ? roundSensible(data.min_ask) : <Spin />}{' '}
              {to?.coinInfo?.abbreviation}
            </div>
          </InfoLine>
        )}

        <InfoLine
          label="Estimated Amount"
          info="It shows the expected return based on current market prices."
        >
          <div className="font-medium">
            {isMarketPrice ? (
              data?.ask_amount ? (
                roundSensible(data.ask_amount)
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

        <div className="my-2 border border-white/5" />

        {data?.trade_fee && (
          <>
            <InfoLine label="Fee" className="text-sm">
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
          <MessageBox variant="error">
            Your {gasAbbr} balance might be insufficient to cover gas fees.
            Please ensure you have enough {gasAbbr} to proceed.
          </MessageBox>
        )}

        {impact >= 0.05 ? (
          <MessageBox variant="error" title="🚨 High Slippage Detected!">
            The price impact for this trade exceeds 5%, which could lead to
            significant losses. Trading has been disabled to protect your funds.
            Please adjust your trade size or try again later.
          </MessageBox>
        ) : impact >= 0.02 ? (
          <MessageBox variant="warning" title="⚠️ Warning: High Slippage!">
            Your trade has a appriximately {roundSensible(impact * 100)}% price
            impact, which may result in a less favorable execution price.
            Proceed with caution or consider adjusting your trade size.
          </MessageBox>
        ) : null}

        {data?.warning && (
          <MessageBox variant="warning">{data?.warning}</MessageBox>
        )}
        {data?.error && <MessageBox variant="error">{data?.error}</MessageBox>}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button onClick={() => onResolve?.(false)} variant="alternative">
          Edit
        </Button>
        <Button
          onClick={() => onResolve?.(true)}
          variant="brand"
          className="grow"
          disabled={
            isLoading || !hasEnoughGas || impact > 0.05 || !!data?.error
          }
          loading={isLoading}
        >
          Fire Position
        </Button>
      </div>
    </div>
  );
};

export default function useModalApproval() {
  const [Modal, showModal] = useModal(ModalApproval, {
    mobileDrawer: true,
    title: 'Fire Position Approval',
  });
  return [
    Modal,
    (formState: SwapState, createData: CreatePositionRequest) =>
      showModal({ formState, createData }),
  ] as const;
}
