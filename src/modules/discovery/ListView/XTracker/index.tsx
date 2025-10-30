import AddHandleDialog from 'modules/discovery/ListView/XTracker/AddHandleDialog';
import { type FC, useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { ResizableSides } from 'shared/v1-components/ResizableSides';
import { HandlesManager } from './XTrackerEdit';
import { XTrackerView } from './XTrackerView';

export const XTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col justify-start pt-3">
      <Button
        className="ml-3 w-max shrink-0"
        onClick={() => setOpen(true)}
        size="md"
        variant="outline"
      >
        Add Handles
      </Button>
      <AddHandleDialog onClose={() => setOpen(false)} open={open} />
      <hr className="my-3 border-white/10" />
      <ResizableSides
        className={[
          'h-full max-h-[calc(var(--desktop-content-height)-120px)]',
          '',
        ]}
        direction="row"
        rootClassName="h-[calc(var(--desktop-content-height))]"
      >
        <XTrackerView className="scrollbar-thin" expanded />
        <HandlesManager />
      </ResizableSides>
    </div>
  );
};
