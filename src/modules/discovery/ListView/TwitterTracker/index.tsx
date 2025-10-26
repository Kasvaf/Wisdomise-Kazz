import { useTwitterFollowedAccounts } from 'api/discovery';
import { type ComponentProps, type FC, useEffect } from 'react';
import { usePageState } from 'shared/usePageState';
import { TwitterTrackerEdit } from './TwitterTrackerEdit';
import { TwitterTrackerTabSelect } from './TwitterTrackerTabSelect';
import { TwitterTrackerView } from './TwitterTrackerView';

export const TwitterTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = ({ expanded }) => {
  const followings = useTwitterFollowedAccounts();

  const [pageState, setPageState] = usePageState<{
    tab: NonNullable<ComponentProps<typeof TwitterTrackerTabSelect>['value']>;
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
    <>
      {expanded ? (
        <div
          className="relative mx-auto flex h-full max-w-6xl items-start justify-between gap-3 overflow-hidden p-3"
          style={{
            maxHeight:
              'calc(100svh - var(--desktop-header-height) - var(--route-details-height) - 1.5rem)',
          }}
        >
          <TwitterTrackerEdit className="scrollbar-thin h-full w-96 shrink-0 overflow-auto" />
          <TwitterTrackerView
            className="scrollbar-thin h-full max-h-full w-full grow overflow-auto"
            expanded
            onRequestEdit={() => setPageState(p => ({ ...p, tab: 'edit' }))}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 border-v1-content-primary/10 border-b p-3">
            <TwitterTrackerTabSelect
              onChange={newTab => setPageState(p => ({ ...p, tab: newTab }))}
              size="sm"
              surface={1}
              value={pageState.tab}
            />
          </div>
          {pageState.tab === 'edit' ? (
            <TwitterTrackerEdit />
          ) : (
            <TwitterTrackerView />
          )}
        </>
      )}
    </>
  );
};
