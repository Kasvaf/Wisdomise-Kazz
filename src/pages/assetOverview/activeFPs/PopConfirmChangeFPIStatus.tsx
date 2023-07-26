import { Popover } from "antd";
import { useState } from "react";
import { Button } from "shared/components/Button";

interface Props {
  children: React.ReactNode;
  onConfirm: () => Promise<void>;
  type: "start" | "pause" | "resume" | "stop";
}

export const PopConfirmChangeFPIStatus: React.FC<Props> = ({ children, type, onConfirm }) => {
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
        <section>
          <p className="text-sm text-white/80">
            Are You Sure To <span className="text-base font-medium capitalize text-white">{type}</span> This Product ?
          </p>
          <section className="mt-4 flex justify-around">
            <Button variant="secondary" size="small" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="small" onClick={onConfirmClick} loading={loading}>
              Yes, <span className="capitalize">{type}</span>
            </Button>
          </section>
        </section>
      }
    >
      <section onClick={() => setOpen(true)}>{children}</section>
    </Popover>
  );
};
