import { useTwitterFollowedAccounts } from 'api/discovery';
import { type ComponentProps, type FC, useEffect } from 'react';
import { usePageState } from 'shared/usePageState';
import { XTrackerEdit } from './XTrackerEdit';
import { XTrackerTabSelect } from './XTrackerTabSelect';
import { XTrackerView } from './XTrackerView';

export const XTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = ({ expanded }) => {
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
            className="scrollbar-thin h-full max-h-full w-full max-w-96 grow overflow-auto"
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
