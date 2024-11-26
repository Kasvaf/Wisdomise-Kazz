import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { type AlertFormStepProps } from 'modules/alert/library/types';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import { IntervalSelect } from 'modules/alert/components/IntervalSelect';
import { AlertChannelsSelect } from 'modules/alert/components/AlertChannelsSelect';
import { gtmClass } from 'utils/gtmClass';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';
import { ReactComponent as CooldownIcon } from './cooldown.svg';

export function StepOne({ onSubmit, loading, className }: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const {
    value: [value, setValue],
  } = useEditingAlert();

  return (
    <form
      className={clsx(
        'text-center text-sm font-light leading-[4rem]',
        className,
      )}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <>
        <FormControlWithLabel
          label={
            <>
              <CooldownIcon />
              {t('common.notifications.interval')}
            </>
          }
          type="inline"
          className="!flex justify-between"
        >
          <IntervalSelect disabled value={86_400} cooldownMode={false} />
        </FormControlWithLabel>
        <FormControlWithLabel type="normal">
          <AlertChannelsSelect
            onChange={x => setValue(p => ({ ...p, messengers: x as never }))}
            value={value.messengers ?? []}
            channels={['EMAIL']}
          />
        </FormControlWithLabel>
        <div>
          <Button
            variant="primary"
            className={clsx(
              'mt-6 w-full grow',
              gtmClass('submit coin-radar-alert'),
            )}
            loading={loading}
          >
            {t('common.save-alert')}
            <Icon name={bxBell} className="ms-2" />
          </Button>
        </div>
      </>
    </form>
  );
}
