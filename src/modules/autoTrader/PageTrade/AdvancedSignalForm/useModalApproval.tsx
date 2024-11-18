import { clsx } from 'clsx';
import { useEffect, type ReactNode } from 'react';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import { type CreatePositionRequest, usePreparePositionMutation } from 'api';
import Spin from 'shared/Spin';
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
  }>;
}> = ({ items }) => {
  return (
    <>
      {items.length === 0
        ? 'None'
        : items.map(x => (
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
    safetyOpens: [safetyOpens],
    takeProfits: [takeProfits],
    stopLosses: [stopLosses],
  } = formState;

  const { mutate, data, isLoading } = usePreparePositionMutation();
  useEffect(() => mutate(createData), [createData, mutate]);

  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex grow flex-col gap-4">
        {data?.warning && (
          <div className="rounded-md border border-v1-border-notice p-4">
            {data?.warning}
          </div>
        )}
        <InfoLine label="Initial Deposit">
          <div className="font-medium">{amount} USDT</div>
        </InfoLine>

        <InfoLine label="Gas Fee (Reserved)" className="text-sm">
          {isLoading ? (
            <Spin />
          ) : data?.gas_fee ? (
            String(data.gas_fee) + ' TON'
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
          0.5% of transactions + network gas fee
        </InfoLine>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button onClick={() => onResolve?.(false)} variant="alternative">
          Edit
        </Button>
        <Button
          onClick={() => onResolve?.(true)}
          variant="brand"
          className="grow"
          disabled={isLoading}
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
    height: 560,
  });
  return [
    Modal,
    (formState: SignalFormState, createData: CreatePositionRequest) =>
      showModal({ formState, createData }),
  ] as const;
}
