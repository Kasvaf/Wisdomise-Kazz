import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC, type SVGProps, type PropsWithChildren } from 'react';
import { useAccountQuery } from 'api';
import { Toggle } from 'shared/Toggle';
import { type AlertMessanger } from 'api/alert';
import { ReactComponent as BellIcon } from './bell.svg';
import { ReactComponent as DiscordIcon } from './discord.svg';
import { ReactComponent as EmailIcon } from './email.svg';
import { ReactComponent as SlackIcon } from './slack.svg';
import { ReactComponent as SmsIcon } from './sms.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';

export const AlertChannelIcon: FC<
  SVGProps<SVGSVGElement> & {
    name: AlertMessanger;
  }
> = ({ name, ...props }) => {
  const Component = {
    EMAIL: EmailIcon,
    SLACK: SlackIcon,
    SMS: SmsIcon,
    TELEGRAM: TelegramIcon,
    DISCORD: DiscordIcon,
    PUSH: BellIcon,
    BROWSER: BellIcon,
  }[name];
  return <Component {...props} />;
};

export const AlertChannel: FC<{
  className?: string;
  name: AlertMessanger;
}> = ({ className, name }) => {
  const { t } = useTranslation('alerts');
  const title = {
    EMAIL: t('forms.notifications.messangers.email'),
    SLACK: t('forms.notifications.messangers.slack'),
    SMS: t('forms.notifications.messangers.sms'),
    TELEGRAM: t('forms.notifications.messangers.telegram'),
    DISCORD: t('forms.notifications.messangers.discord'),
    PUSH: t('forms.notifications.messangers.push'),
    BROWSER: t('forms.notifications.messangers.browser'),
  }[name];
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        className,
      )}
    >
      <AlertChannelIcon name={name} />
      {title}
    </div>
  );
};

const AlertChannelRow: FC<
  PropsWithChildren<{
    className?: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    label: string;
    subtitle?: string;
  }>
> = ({ className, icon: Icon, label, subtitle, children }) => {
  const { t } = useTranslation('common');
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div>
        <label
          className={clsx(
            'flex items-center gap-1 text-sm',
            !children && 'opacity-40',
          )}
        >
          <Icon className="size-4 shrink-0 stroke-current" />
          {label}
        </label>
        {subtitle && (
          <div className="text-xs font-light text-v1-content-secondary">
            {subtitle}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        <span>
          {children || (
            <span className="inline-flex h-6 cursor-not-allowed items-center justify-center rounded-full bg-white/10 px-4 text-xxs text-white/70">
              {t('common:soon')}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export const AlertChannelsSelect: FC<{
  value: string[];
  onChange: (newValue: string[]) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, loading, disabled, className }) => {
  const account = useAccountQuery();
  const { t } = useTranslation('alerts');

  const toggleValue = (messanger: string, addToList: boolean) =>
    onChange([
      ...value.filter(x => x !== messanger),
      ...(addToList ? [messanger] : []),
    ]);

  return (
    <div
      className={clsx(
        'relative space-y-6 rounded-xl text-v1-content-primary',
        className,
      )}
    >
      <AlertChannelRow
        icon={EmailIcon}
        label={t('forms.notifications.messangers.email')}
        subtitle={account.data?.email}
      >
        <Toggle
          checked={(value || []).includes('EMAIL')}
          onChange={e => toggleValue('EMAIL', e)}
          loading={loading}
          disabled={disabled || false}
        />
      </AlertChannelRow>
      <AlertChannelRow
        icon={TelegramIcon}
        label={t('forms.notifications.messangers.telegram')}
      />
      {/* <AlertChannelRow
        icon={BellIcon}
        label={t('forms.notifications.messangers.browser')}
      />
      <AlertChannelRow
        icon={BellIcon}
        label={t('forms.notifications.messangers.push')}
      />
      <AlertChannelRow
        icon={DiscordIcon}
        label={t('forms.notifications.messangers.discord')}
      />
      <AlertChannelRow
        icon={SlackIcon}
        label={t('forms.notifications.messangers.slack')}
      />
      <AlertChannelRow
        icon={SmsIcon}
        label={t('forms.notifications.messangers.sms')}
      /> */}
    </div>
  );
};
