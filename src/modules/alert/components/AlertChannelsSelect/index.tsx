import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC, type SVGProps, type PropsWithChildren } from 'react';
import { useAccountQuery } from 'api';
import { Toggle } from 'shared/Toggle';
import { type AlertMessenger } from 'api/alert';
import useEnsureTelegramConnected from 'modules/account/PageNotification/SignalingTab/useEnsureTelegramConnected';
import { ReactComponent as BellIcon } from './bell.svg';
import { ReactComponent as DiscordIcon } from './discord.svg';
import { ReactComponent as EmailIcon } from './email.svg';
import { ReactComponent as SlackIcon } from './slack.svg';
import { ReactComponent as SmsIcon } from './sms.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';

export const AlertChannelIcon: FC<
  SVGProps<SVGSVGElement> & {
    name: AlertMessenger;
  }
> = ({ name, ...props }) => {
  const components: Record<AlertMessenger, FC<SVGProps<SVGSVGElement>>> = {
    EMAIL: EmailIcon,
    SLACK: SlackIcon,
    SMS: SmsIcon,
    TELEGRAM: TelegramIcon,
    DISCORD: DiscordIcon,
    PUSH: BellIcon,
    BROWSER: BellIcon,
  };
  const Component = components[name];
  return <Component {...props} />;
};

export const AlertChannelTitle: FC<
  SVGProps<SVGSVGElement> & {
    name: AlertMessenger;
  }
> = ({ name }) => {
  const { t } = useTranslation('alerts');
  const titles: Record<AlertMessenger, string> = {
    EMAIL: t('common.notifications.messangers.email'),
    SLACK: t('common.notifications.messangers.slack'),
    SMS: t('common.notifications.messangers.sms'),
    TELEGRAM: t('common.notifications.messangers.telegram'),
    DISCORD: t('common.notifications.messangers.discord'),
    PUSH: t('common.notifications.messangers.push'),
    BROWSER: t('common.notifications.messangers.browser'),
  };
  const title = titles[name];
  return <>{title}</>;
};

export const AlertChannel: FC<{
  className?: string;
  name: AlertMessenger;
}> = ({ className, name }) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        className,
      )}
    >
      <AlertChannelIcon name={name} />
      <AlertChannelTitle name={name} />
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
  channels?: AlertMessenger[];
}> = ({ value, onChange, loading, disabled, className, channels }) => {
  const account = useAccountQuery();
  const { t } = useTranslation('alerts');
  const [telegramModal, ensureTelegramConnected] = useEnsureTelegramConnected();

  const toggleValue = (messanger: string, addToList: boolean) =>
    onChange([
      ...value.filter(x => x !== messanger),
      ...(addToList ? [messanger] : []),
    ]);

  const renderingChannels: AlertMessenger[] = channels ?? ['EMAIL', 'TELEGRAM'];

  return (
    <div
      className={clsx(
        'relative space-y-6 rounded-xl text-v1-content-primary',
        className,
      )}
    >
      {renderingChannels.includes('EMAIL') && (
        <AlertChannelRow
          icon={EmailIcon}
          label={t('common.notifications.messangers.email')}
          subtitle={account.data?.email}
        >
          <Toggle
            checked={(value || []).includes('EMAIL')}
            onChange={e => toggleValue('EMAIL', e)}
            loading={loading}
            disabled={disabled}
          />
        </AlertChannelRow>
      )}
      {renderingChannels.includes('TELEGRAM') && (
        <AlertChannelRow
          icon={TelegramIcon}
          label={t('common.notifications.messangers.telegram')}
        >
          <Toggle
            checked={(value || []).includes('TELEGRAM')}
            onChange={async e => {
              if (e) {
                const isConnected = await ensureTelegramConnected();
                return toggleValue('TELEGRAM', isConnected);
              }
              toggleValue('TELEGRAM', e);
            }}
            loading={loading}
            disabled={disabled}
          />
          {telegramModal}
        </AlertChannelRow>
      )}
      {renderingChannels.includes('BROWSER') && (
        <AlertChannelRow
          icon={BellIcon}
          label={t('common.notifications.messangers.browser')}
        />
      )}
      {renderingChannels.includes('PUSH') && (
        <AlertChannelRow
          icon={BellIcon}
          label={t('common.notifications.messangers.push')}
        />
      )}
      {renderingChannels.includes('DISCORD') && (
        <AlertChannelRow
          icon={DiscordIcon}
          label={t('common.notifications.messangers.discord')}
        />
      )}
      {renderingChannels.includes('SLACK') && (
        <AlertChannelRow
          icon={SlackIcon}
          label={t('common.notifications.messangers.slack')}
        />
      )}
      {renderingChannels.includes('SMS') && (
        <AlertChannelRow
          icon={SmsIcon}
          label={t('common.notifications.messangers.sms')}
        />
      )}
    </div>
  );
};
