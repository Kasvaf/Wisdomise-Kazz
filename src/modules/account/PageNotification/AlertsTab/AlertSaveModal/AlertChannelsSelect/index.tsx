import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC, type SVGProps, type PropsWithChildren } from 'react';
import { useAccountQuery } from 'api';
import { Toggle } from 'shared/Toggle';
import { type AlertMessanger } from 'api/alert';
import { ReactComponent as BellIcon } from './bell.svg';
import { ReactComponent as DiscordIcon } from './discord.svg';
import { ReactComponent as EmailIcon } from './email.svg';
import { ReactComponent as LockIcon } from './lock.svg';
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
  const { t } = useTranslation('notifications');
  const title = {
    EMAIL: t('alerts.messangers.email'),
    SLACK: t('alerts.messangers.slack'),
    SMS: t('alerts.messangers.sms'),
    TELEGRAM: t('alerts.messangers.telegram'),
    DISCORD: t('alerts.messangers.discord'),
    PUSH: t('alerts.messangers.push'),
    BROWSER: t('alerts.messangers.browser'),
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
    lockIcon?: boolean;
  }>
> = ({ className, icon: Icon, label, subtitle, children, lockIcon }) => {
  const { t } = useTranslation('common');
  return (
    <div className={clsx('flex items-center justify-between p-4', className)}>
      <div>
        <label
          className={clsx('flex items-center gap-1', !children && 'opacity-40')}
        >
          <Icon className="size-4" />
          {label}
        </label>
        {subtitle && (
          <div className="text-xs font-light text-white/60">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        {lockIcon && (
          <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
            <LockIcon className="size-6 opacity-90" />
          </div>
        )}
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
  const { t } = useTranslation('notifications');

  const toggleValue = (messanger: string, addToList: boolean) =>
    onChange([
      ...value.filter(x => x !== messanger),
      ...(addToList ? [messanger] : []),
    ]);

  return (
    <div
      className={clsx(
        'relative divide-y divide-white/5 overflow-y-auto rounded-xl bg-black/20 text-white',
        className,
      )}
    >
      <AlertChannelRow
        icon={EmailIcon}
        label={t('alerts.messangers.email')}
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
        label={t('alerts.messangers.telegram')}
      />
      <AlertChannelRow icon={BellIcon} label={t('alerts.messangers.browser')} />
      <AlertChannelRow icon={BellIcon} label={t('alerts.messangers.push')} />
      <AlertChannelRow
        icon={DiscordIcon}
        label={t('alerts.messangers.discord')}
      />
      <AlertChannelRow icon={SlackIcon} label={t('alerts.messangers.slack')} />
      <AlertChannelRow icon={SmsIcon} label={t('alerts.messangers.sms')} />
    </div>
  );
};
