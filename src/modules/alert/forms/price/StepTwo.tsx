import { bxBell } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import type { AlertFormStepProps } from 'modules/alert/library/types';
import { useTranslation } from 'react-i18next';
import type { AlertMessenger } from 'services/rest/alert';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Toggle } from 'shared/v1-components/Toggle';
import { gtmClass } from 'utils/gtmClass';
import { isDebugMode } from 'utils/version';
import { AlertChannelsSelect } from '../../components/AlertChannelsSelect';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';
import { IntervalSelect } from '../../components/IntervalSelect';
import { ReactComponent as CooldownIcon } from './cooldown.svg';
import { ReactComponent as FrequencyIcon } from './frequency.svg';

export function StepTwo({
  onSubmit,
  loading,
  className,
  onDelete,
}: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const {
    value: [value, setValue],
  } = useEditingAlert();

  return (
    <form
      className={clsx('space-y-6 font-normal text-base', className)}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FormControlWithLabel type="normal">
        <AlertChannelsSelect
          channels={[
            'EMAIL',
            'TELEGRAM',
            ...(isDebugMode ? (['WEB_PUSH'] as AlertMessenger[]) : []),
          ]}
          onChange={newMessengers =>
            setValue(p => ({ ...p, messengers: newMessengers as never }))
          }
          value={value.messengers ?? []}
        />
      </FormControlWithLabel>

      <FormControlWithLabel
        className="!flex justify-between"
        info={t('common.notifications.cooldown-info')}
        label={
          <>
            <CooldownIcon />
            {t('common.notifications.cooldown')}
          </>
        }
        type="inline"
      >
        <IntervalSelect
          className="block"
          cooldownMode
          onChange={newDndInterval =>
            setValue(p => ({
              ...p,
              config: {
                ...p.config,
                dnd_interval: newDndInterval as never,
              },
            }))
          }
          size="sm"
          value={value.config?.dnd_interval}
        />
      </FormControlWithLabel>

      <FormControlWithLabel
        className="!flex justify-between"
        label={
          <>
            <FrequencyIcon />
            {t('common.notifications.disable-after-trigger')}
          </>
        }
        type="inline"
      >
        <Toggle
          onChange={newOneTime =>
            setValue(p => ({
              ...p,
              config: {
                ...p.config,
                one_time: newOneTime as never,
              },
            }))
          }
          value={value.config?.one_time ?? false}
        />
      </FormControlWithLabel>
      <div>
        <Button
          className={clsx('mt-6 w-full grow', gtmClass('submit price-alert'))}
          disabled={value.key ? false : (value.messengers?.length ?? 0) < 1}
          loading={loading}
          onClick={e => {
            if (value.key && (value.messengers?.length ?? 0) < 1) {
              e.preventDefault();
              onDelete?.();
            } // else submit the form
          }}
          variant="white"
        >
          {t('common.set-alert')}
          <Icon className="ms-2" name={bxBell} />
        </Button>
      </div>
    </form>
  );
}
