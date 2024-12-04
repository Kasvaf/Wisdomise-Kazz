import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import { Toggle } from 'shared/Toggle';
import Icon from 'shared/Icon';
import { gtmClass } from 'utils/gtmClass';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import { type AlertFormStepProps } from 'modules/alert/library/types';
import { isDebugMode } from 'utils/version';
import { type AlertMessenger } from 'api/alert';
import { IntervalSelect } from '../../components/IntervalSelect';
import { AlertChannelsSelect } from '../../components/AlertChannelsSelect';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';
import { ReactComponent as CooldownIcon } from './cooldown.svg';
import { ReactComponent as FrequencyIcon } from './frequency.svg';

export function StepTwo({ onSubmit, loading, className }: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const {
    value: [value, setValue],
  } = useEditingAlert();

  return (
    <form
      className={clsx('space-y-6 text-base font-normal', className)}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FormControlWithLabel type="normal">
        <AlertChannelsSelect
          onChange={newMessengers =>
            setValue(p => ({ ...p, messengers: newMessengers as never }))
          }
          value={value.messengers ?? []}
          channels={[
            'EMAIL',
            'TELEGRAM',
            ...(isDebugMode ? (['WEB_PUSH'] as AlertMessenger[]) : []),
          ]}
        />
      </FormControlWithLabel>

      <FormControlWithLabel
        label={
          <>
            <CooldownIcon />
            {t('common.notifications.cooldown')}
          </>
        }
        type="inline"
        className="!flex justify-between"
        info={t('common.notifications.cooldown-info')}
      >
        <IntervalSelect
          onChange={newDndInterval =>
            setValue(p => ({
              ...p,
              config: {
                ...p.config,
                dnd_interval: newDndInterval as never,
              },
            }))
          }
          value={value.config?.dnd_interval}
          className="block"
          cooldownMode
        />
      </FormControlWithLabel>

      <FormControlWithLabel
        label={
          <>
            <FrequencyIcon />
            {t('common.notifications.disable-after-trigger')}
          </>
        }
        type="inline"
        className="!flex justify-between"
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
          checked={value.config?.one_time ?? false}
        />
      </FormControlWithLabel>
      <div>
        <Button
          variant="primary"
          className={clsx('mt-6 w-full grow', gtmClass('submit price-alert'))}
          disabled={(value.messengers?.length ?? 0) < 1}
          loading={loading}
        >
          {t('common.set-alert')}
          <Icon name={bxBell} className="ms-2" />
        </Button>
      </div>
    </form>
  );
}
