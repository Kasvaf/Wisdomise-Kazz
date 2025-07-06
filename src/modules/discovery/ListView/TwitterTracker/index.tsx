import { type ComponentProps, type FC } from 'react';
import { usePageState } from 'shared/usePageState';
import { TwitterTrackerTabSelect } from './TwitterTrackerTabSelect';
import { TwitterTrackerView } from './TwitterTrackerView';
import { TwitterTrackerEdit } from './TwitterTrackerEdit';

export const TwitterTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = ({ expanded }) => {
  const [pageState, setPageState] = usePageState<{
    tab: NonNullable<ComponentProps<typeof TwitterTrackerTabSelect>['value']>;
  }>('twitter-tracker', {
    tab: 'view',
  });

  return (
    <>
      {expanded ? (
        <div
          className="relative mx-auto flex h-full max-w-6xl items-start justify-between gap-3 overflow-hidden"
          style={{
            maxHeight:
              'calc(100svh - var(--desktop-header-height) - var(--route-details-height) - 1.5rem)',
          }}
        >
          <TwitterTrackerEdit className="h-full w-96 shrink-0 overflow-auto scrollbar-thin" />
          <TwitterTrackerView
            onRequestEdit={() => setPageState(p => ({ ...p, tab: 'edit' }))}
            className="h-full max-h-full w-full grow overflow-auto scrollbar-thin"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 border-b border-v1-content-primary/10 pb-3">
            <TwitterTrackerTabSelect
              value={pageState.tab}
              onChange={newTab => setPageState(p => ({ ...p, tab: newTab }))}
              surface={1}
              size="sm"
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
