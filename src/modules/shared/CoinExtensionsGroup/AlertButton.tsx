import { bxBell } from 'boxicons-quasar';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import type { ComponentProps, FC } from 'react';
import { useHasFlag } from 'services/rest';
import { useAlerts } from 'services/rest/alert';
import { DebugPin } from 'shared/DebugPin';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

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
        <Button {...props} fab onClick={() => openAlert()} variant="ghost">
          <DebugPin color="orange" title="/account/alerts" />
          <Icon name={bxBell} />
          {isUsedAlertBefore && (
            <div className="absolute top-0 right-0 size-[6px] rounded-full bg-v1-background-brand" />
          )}
        </Button>
      )}
      {alertModal}
    </>
  );
};
