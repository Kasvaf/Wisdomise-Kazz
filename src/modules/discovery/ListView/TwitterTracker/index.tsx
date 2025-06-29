import { type ComponentProps, type FC } from 'react';
import { usePageState } from 'shared/usePageState';
import { TwitterTrackerTabSelect } from './TwitterTrackerTabSelect';
import { TwitterTrackerView } from './TwitterTrackerView';
import { TwitterTrackerEdit } from './TwitterTrackerEdit';

export const TwitterTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = () => {
  const [pageState, setPageState] = usePageState<{
    tab: NonNullable<ComponentProps<typeof TwitterTrackerTabSelect>['value']>;
  }>('twitter-tracker', {
    tab: 'view',
  });

  return (
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
        <TwitterTrackerView
          onRequestEdit={() => setPageState(p => ({ ...p, tab: 'edit' }))}
        />
      )}
    </>
  );
};
