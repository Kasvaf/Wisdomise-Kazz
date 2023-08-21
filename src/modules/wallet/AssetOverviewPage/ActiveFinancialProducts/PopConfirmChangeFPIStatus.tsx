import { Popover } from 'antd';
import { useCallback, useState } from 'react';
import { type FpiStatusMutationType } from 'api';
import { Button } from 'shared/Button';

interface Props {
  type: FpiStatusMutationType;
  children: React.ReactNode;
  onConfirm: () => Promise<void>;
}

export const PopConfirmChangeFPIStatus: React.FC<Props> = ({
  type,
  children,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirmClick = useCallback(async () => {
    try {
      setLoading(true);
      await onConfirm();
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      //
    }
  }, [onConfirm]);

  return (
    <Popover
      open={isOpen}
      content={
        <section className="mx-2 max-w-[400px] text-white/80">
          <p className="mb-2 text-lg">
            Are You Sure To{' '}
            <span className="text-base font-medium capitalize text-white">
              {type}
            </span>{' '}
            This Product ?
          </p>
          <div>
            Please be aware that by Stopping the Strategy, all your open trades
            will be sold on &quot;Market&quot; price. The final PnL will be
            calculated after closing open positions.
          </div>

          <section className="mt-6 flex justify-center">
            <Button
              variant="secondary"
              size="small"
              onClick={useCallback(() => setIsOpen(false), [])}
            >
              Cancel
            </Button>
            <div className="w-4" />
            <Button size="small" onClick={onConfirmClick} loading={loading}>
              Yes,&nbsp;<span className="capitalize">{type}</span>
            </Button>
          </section>
        </section>
      }
    >
      <section onClick={useCallback(() => setIsOpen(true), [])}>
        {children}
      </section>
    </Popover>
  );
};
