import BtnAddHandle from 'modules/discovery/ListView/XTracker/BtnAddHandle';
import type { FC } from 'react';
import { ResizableSides } from 'shared/v1-components/ResizableSides';
import { HandlesManager } from './XTrackerEdit';
import { XTrackerView } from './XTrackerView';

export const XTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = () => {
  return (
    <div className="flex h-full flex-col justify-start pt-3">
      <BtnAddHandle />
      <hr className="my-3 border-white/10" />
      <ResizableSides
        className={['h-full max-h-[calc(var(--content-height)-120px)]', '']}
        direction="row"
        rootClassName="h-[calc(var(--content-height))]"
      >
        <XTrackerView className="scrollbar-thin" expanded />
        <HandlesManager />
      </ResizableSides>
    </div>
  );
};
