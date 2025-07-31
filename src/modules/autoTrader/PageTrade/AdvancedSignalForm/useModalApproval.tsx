import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { roundSensible } from 'utils/numbers';
import { type CreatePositionRequest, usePreparePositionQuery } from 'api';
import { useAccountNativeBalance } from 'api/chains';
import { useSymbolInfo } from 'api/symbol';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import Spin from 'shared/Spin';
import InfoLine from 'modules/autoTrader/components/InfoLine';
import MessageBox from 'modules/autoTrader/components/MessageBox';
import { useActiveNetwork } from 'modules/base/active-network';
import { ReactComponent as ProIcon } from 'assets/Pro.svg';
import { isMiniApp } from 'utils/version';
import { type SignalFormState } from './useSignalFormStates';

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
              key={x.key}
              amountRatio={x.amountRatio}
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
  const { data: nativeBalance } = useAccountNativeBalance();
  const { data, isLoading } = usePreparePositionQuery(createData);

  const { data: quoteInfo } = useSymbolInfo(quote);
  const nativeAmount =
    Number(data?.gas_fee) + (quoteInfo?.abbreviation === gasAbbr ? +amount : 0);
  const remainingGas = Number(nativeBalance) - nativeAmount;
  const hasEnoughGas = remainingGas > MIN_GAS[gasAbbr];
  const impact = Number(data?.price_impact);

  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex grow flex-col gap-4">
        <InfoLine label="Initial Deposit">
          <div className="font-medium">
            {amount} {quoteInfo?.abbreviation}
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

        <InfoLine label="Open Orders" className="text-sm">
          <PriceVols items={safetyOpens} />
        </InfoLine>
        <InfoLine label="Take Profit" className="text-sm">
          <PriceVols items={takeProfits} />
        </InfoLine>
        <InfoLine label="Stop Loss" className="text-sm">
          <PriceVols items={stopLosses} />
        </InfoLine>

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
          disabled={isLoading || !hasEnoughGas || !!data?.error}
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
    (formState: SignalFormState, createData: CreatePositionRequest) =>
      showModal({ formState, createData }),
  ] as const;
}
