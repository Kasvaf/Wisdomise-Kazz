import { useTwitterFollowedAccounts } from 'api/discovery';
import AddWalletDialog from 'modules/discovery/ListView/WalletTracker/AddWalletDialog';
import WalletsManager from 'modules/discovery/ListView/WalletTracker/WalletsManager';
import WalletsSwaps from 'modules/discovery/ListView/WalletTracker/WalletsSwaps';
import AddHandleDialog from 'modules/discovery/ListView/XTracker/AddHandleDialog';
import { type ComponentProps, type FC, useEffect, useState } from 'react';
import { usePageState } from 'shared/usePageState';
import { Button } from 'shared/v1-components/Button';
import { ResizableSides } from 'shared/v1-components/ResizableSides';
import { XTrackerEdit } from './XTrackerEdit';
import { XTrackerTabSelect } from './XTrackerTabSelect';
import { XTrackerView } from './XTrackerView';

export const XTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = ({ expanded }) => {
  const [open, setOpen] = useState(false);
  const followings = useTwitterFollowedAccounts();

  const [pageState, setPageState] = usePageState<{
    tab: NonNullable<ComponentProps<typeof XTrackerTabSelect>['value']>;
  }>('twitter-tracker', {
    tab: 'view',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!followings.isLoading && followings.value.length === 0) {
      setPageState({ tab: 'edit' });
    }
  }, [followings]);

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
        <XTrackerView
          className="scrollbar-thin"
          expanded
          onRequestEdit={() => setPageState(p => ({ ...p, tab: 'edit' }))}
        />
        <XTrackerEdit className="scrollbar-thin" />
      </ResizableSides>
    </div>
  );

  return (
    <>
      {expanded ? (
        <div
          className="relative mx-auto flex h-full max-w-6xl items-start justify-center gap-3 overflow-hidden p-3"
          style={{
            maxHeight:
              'calc(100svh - var(--desktop-header-height) - var(--route-details-height) - 1.5rem)',
          }}
        >
          <XTrackerEdit className="scrollbar-thin h-full w-96 shrink-0 overflow-auto" />
          <XTrackerView
            className="scrollbar-thin h-full max-h-full w-full max-w-[32rem] grow overflow-auto"
            expanded
            onRequestEdit={() => setPageState(p => ({ ...p, tab: 'edit' }))}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 border-v1-content-primary/10 border-b p-3">
            <XTrackerTabSelect
              onChange={newTab => setPageState(p => ({ ...p, tab: newTab }))}
              size="sm"
              surface={1}
              value={pageState.tab}
            />
          </div>
          {pageState.tab === 'edit' ? <XTrackerEdit /> : <XTrackerView />}
        </>
      )}
    </>
  );
};
