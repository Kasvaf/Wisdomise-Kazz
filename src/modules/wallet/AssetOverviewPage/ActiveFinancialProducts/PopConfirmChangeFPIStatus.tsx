import { Popover } from 'antd';
import { useState } from 'react';
import { Button } from 'modules/shared/Button';

interface Props {
  children: React.ReactNode;
  onConfirm: () => Promise<void>;
  type: 'start' | 'pause' | 'resume' | 'stop';
}

export const PopConfirmChangeFPIStatus: React.FC<Props> = ({
  children,
  type,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirmClick = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setLoading(false);
      setOpen(false);
    } catch (error) {
      //
    }
  };

  return (
    <Popover
      open={open}
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
              onClick={() => setOpen(false)}
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
      <section onClick={() => setOpen(true)}>{children}</section>
    </Popover>
  );
};
