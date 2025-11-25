import { ReactComponent as ProIcon } from 'assets/monogram-green.svg';
import { clsx } from 'clsx';
import InfoLine from 'modules/autoTrader/components/InfoLine';
import MessageBox from 'modules/autoTrader/components/MessageBox';
import { useActiveNetwork } from 'modules/base/active-network';
import { NavLink } from 'react-router-dom';
import { useNativeTokenBalance } from 'services/chains';
import {
  type CreatePositionRequest,
  usePreparePositionQuery,
} from 'services/rest';
import { useTokenInfo } from 'services/rest/token-info';
import Spin from 'shared/Spin';
import useModal from 'shared/useModal';
import { Button } from 'shared/v1-components/Button';
import { roundSensible } from 'utils/numbers';
import { isMiniApp } from 'utils/version';
import type { SignalFormState } from './useSignalFormStates';

const PriceVol: React.FC<{
  amountRatio: string;
  priceExact?: string;
  className?: string;
}> = ({ amountRatio, priceExact, className }) => {
  return (
    <div className={clsx('flex justify-end', className)}>
      {amountRatio}% at {priceExact || 'market'}
    </div>
  );
};

const PriceVols: React.FC<{
  items: Array<{
    key: string;
    amountRatio: string;
    priceExact?: string;
    removed: boolean;
    applied: boolean;
    appliedAt?: Date;
  }>;
}> = ({ items }) => {
  const itemsFiltered = items.filter(x => !x.removed);
  return (
    <>
      {itemsFiltered.length === 0
        ? 'None'
        : itemsFiltered.map(x => (
            <PriceVol
              amountRatio={x.amountRatio}
              key={x.key}
              priceExact={x.priceExact}
            />
          ))}
    </>
  );
};

const MIN_GAS = {
  TON: 0.1,
  SOL: 0,
};

const ModalApproval: React.FC<{
  formState: SignalFormState;
  createData: CreatePositionRequest;
  onResolve?: (fired?: boolean) => void;
}> = ({ formState, createData, onResolve }) => {
  const {
    amount: [amount],
    quote: [quote],
    safetyOpens: [safetyOpens],
    takeProfits: [takeProfits],
    stopLosses: [stopLosses],
  } = formState;

  const net = useActiveNetwork();
  const gasAbbr = net === 'the-open-network' ? 'TON' : 'SOL';
  const { data: nativeBalance } = useNativeTokenBalance();
  const { data, isLoading } = usePreparePositionQuery(createData);

  const { data: quoteInfo } = useTokenInfo({ slug: quote });
  const nativeAmount =
    Number(data?.gas_fee) + (quoteInfo?.symbol === gasAbbr ? +amount : 0);
  const remainingGas = Number(nativeBalance) - nativeAmount;
  const hasEnoughGas = remainingGas > MIN_GAS[gasAbbr];
  const impact = Number(data?.price_impact);

  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex grow flex-col gap-4">
        <InfoLine label="Initial Deposit">
          <div className="font-medium">
            {amount} {quoteInfo?.symbol}
          </div>
        </InfoLine>

        <InfoLine
          className="text-sm"
          info="This gas amount will be temporarily held and any unused gas will be refunded once the position is closed."
          label="Gas Fee (Reserved)"
        >
          {isLoading ? (
            <Spin />
          ) : data?.gas_fee ? (
            `${String(data.gas_fee)} ${gasAbbr}`
          ) : (
            ''
          )}
        </InfoLine>

        <div className="my-2 border border-white/5" />

        <InfoLine className="text-sm" label="Open Orders">
          <PriceVols items={safetyOpens} />
        </InfoLine>
        <InfoLine className="text-sm" label="Take Profit">
          <PriceVols items={takeProfits} />
        </InfoLine>
        <InfoLine className="text-sm" label="Stop Loss">
          <PriceVols items={stopLosses} />
        </InfoLine>

        <div className="my-2 border border-white/5" />

        {data?.trade_fee && (
          <>
            <InfoLine className="text-sm" label="Fee">
              {Number(data?.trade_fee) * 100}% of transactions + network gas fee
            </InfoLine>

            {!isLoading && !isMiniApp && Number(data?.trade_fee) > 0.6 && (
              <NavLink
                className="mt-2 flex items-center gap-2 text-xs"
                to="/account/billing"
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
          <MessageBox title="🚨 High Slippage Detected!" variant="error">
            The price impact for this trade exceeds 5%, which could lead to
            significant losses. Trading has been disabled to protect your funds.
            Please adjust your trade size or try again later.
          </MessageBox>
        ) : impact >= 0.02 ? (
          <MessageBox title="⚠️ Warning: High Slippage!" variant="warning">
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
        <Button onClick={() => onResolve?.(false)} variant="ghost">
          Edit
        </Button>
        <Button
          className="grow"
          disabled={isLoading || !hasEnoughGas || !!data?.error}
          loading={isLoading}
          onClick={() => onResolve?.(true)}
          variant="primary"
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
    (formState: SignalFormState, createData: CreatePositionRequest) =>
      showModal({ formState, createData }),
  ] as const;
}
