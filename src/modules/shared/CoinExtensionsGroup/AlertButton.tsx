import { bxBell } from 'boxicons-quasar';
import { type ComponentProps, type FC } from 'react';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useAlerts, useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';

export const AlertButton: FC<
  Omit<ComponentProps<typeof Button>, 'variant' | 'onClick' | 'fab'>
> = props => {
  const hasFlag = useHasFlag();
  const { openSaveModal: openAlert, content: alertModal } = useAlertActions(
    {},
    false,
  );
  const alerts = useAlerts({});
  const isUsedAlertBefore = !!alerts.data?.length;

  return (
    <>
      {hasFlag('/account/alerts') && (
        <Button {...props} variant="outline" onClick={() => openAlert()} fab>
          <DebugPin title="/account/alerts" color="orange" />
          <Icon name={bxBell} />
          {isUsedAlertBefore && (
            <div className="absolute right-0 top-0 size-[6px] rounded-full bg-v1-background-brand" />
          )}
        </Button>
      )}
      {alertModal}
    </>
  );
};
