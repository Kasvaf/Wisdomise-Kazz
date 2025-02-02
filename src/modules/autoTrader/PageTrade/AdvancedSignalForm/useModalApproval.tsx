import { clsx } from 'clsx';
import { useEffect, type ReactNode } from 'react';
import { type CreatePositionRequest, usePreparePositionMutation } from 'api';
import { useAccountNativeBalance } from 'api/chains';
import { useSymbolInfo } from 'api/symbol';
import InfoButton from 'shared/InfoButton';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import Spin from 'shared/Spin';
import useActiveNetwork from 'modules/autoTrader/layout/useActiveNetwork';
import { type SignalFormState } from './useSignalFormStates';

const InfoLine: React.FC<
  React.PropsWithChildren<{
    label: string | ReactNode;
    className?: string;
  }>
> = ({ label, className, children }) => {
  return (
    <div className={clsx('flex justify-between', className)}>
      <div className="font-normal text-v1-content-secondary">{label}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

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

const ModalApproval: React.FC<{
  formState: SignalFormState;
  createData: CreatePositionRequest;
  onResolve?: (fired?: boolean) => void;
}> = ({ formState, createData, onResolve }) => {
  const {
    amount: [amount],
    volume: [volume],
    quote: [quote],
    safetyOpens: [safetyOpens],
    takeProfits: [takeProfits],
    stopLosses: [stopLosses],
  } = formState;

  const net = useActiveNetwork();
  const gasAbbr = net === 'the-open-network' ? 'TON' : 'SOL';
  const { data: nativeBalance } = useAccountNativeBalance();
  const { mutate, data, isLoading } = usePreparePositionMutation();
  useEffect(() => mutate(createData), [createData, mutate]);

  const { data: quoteInfo } = useSymbolInfo(quote);
  const nativeAmount =
    Number(data?.gas_fee) + (quoteInfo?.abbreviation === gasAbbr ? +amount : 0);
  const remainingGas = Number(nativeBalance) - nativeAmount;
  const hasEnoughGas = remainingGas > 0.1;

  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex grow flex-col gap-4">
        {data?.warning && (
          <div className="rounded-md border border-v1-border-notice p-4">
            {data?.warning}
          </div>
        )}
        <InfoLine label="Initial Deposit">
          <div className="font-medium">
            {amount} {quoteInfo?.abbreviation}
          </div>
        </InfoLine>

        <InfoLine
          label={
            <div className="flex items-center gap-1">
              <span>Gas Fee (Reserved)</span>
              <InfoButton
                size={16}
                title="Gas Fee (Reserved)"
                text="This gas amount will be temporarily held and any unused gas will be refunded once the position is closed."
              />
            </div>
          }
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

        <InfoLine label="Open" className="text-sm">
          <PriceVol amountRatio={volume} />
        </InfoLine>
        <InfoLine label="Safety Open" className="text-sm">
          <PriceVols items={safetyOpens} />
        </InfoLine>
        <InfoLine label="Take Profit" className="text-sm">
          <PriceVols items={takeProfits} />
        </InfoLine>
        <InfoLine label="Stop Loss" className="text-sm">
          <PriceVols items={stopLosses} />
        </InfoLine>

        <div className="my-2 border border-white/5" />

        <InfoLine label="Fee" className="text-sm">
          0.2% of transactions + network gas fee
        </InfoLine>

        {!hasEnoughGas && !Number.isNaN(remainingGas) && (
          <div className="rounded-lg bg-v1-background-negative p-2 text-sm">
            Your {gasAbbr} balance might be insufficient to cover gas fees.
            Please ensure you have enough {gasAbbr} to proceed.
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button onClick={() => onResolve?.(false)} variant="alternative">
          Edit
        </Button>
        <Button
          onClick={() => onResolve?.(true)}
          variant="brand"
          className="grow"
          disabled={isLoading || !hasEnoughGas}
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
