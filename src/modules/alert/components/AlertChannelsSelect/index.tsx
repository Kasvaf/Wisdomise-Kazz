import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC, type SVGProps, type PropsWithChildren } from 'react';
import { useAccountQuery } from 'api';
import { Toggle } from 'shared//v1-components/Toggle';
import { type AlertMessenger } from 'api/alert';
import { isMiniApp } from 'utils/version';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as BellIcon } from './bell.svg';
import { ReactComponent as EmailIcon } from './email.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';
import { useTelegramConnect } from './useTelegramConnect';
import { useWebPushPermission } from './useWebPushPermission';

export const AlertChannelIcon: FC<
  SVGProps<SVGSVGElement> & {
    name: AlertMessenger;
  }
> = ({ name, ...props }) => {
  const components: Record<AlertMessenger, FC<SVGProps<SVGSVGElement>>> = {
    EMAIL: EmailIcon,
    TELEGRAM: TelegramIcon,
    TELEGRAM_MINI_APP: TelegramIcon,
    WEB_PUSH: BellIcon,
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
    TELEGRAM: t('common.notifications.messangers.telegram'),
    TELEGRAM_MINI_APP: t('common.notifications.messangers.telegram'),
    WEB_PUSH: t('common.notifications.messangers.web_push'),
  };
  const title = titles[name];
  return <>{title}</>;
};

const AlertChannelRow: FC<
  PropsWithChildren<{
    className?: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    label: string;
    subtitle?: string;
    connectLabel?: string;
    isConnected?: boolean;
    connectAction?: () => void;
  }>
> = ({
  className,
  icon: Icon,
  label,
  subtitle,
  children,
  isConnected = true,
  connectLabel,
  connectAction,
}) => {
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
          <div className="mt-px text-xs font-light text-v1-content-secondary">
            {subtitle}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        {isConnected ? (
          <span>
            {children || (
              <span className="inline-flex h-6 cursor-not-allowed items-center justify-center rounded-full bg-white/10 px-4 text-xxs text-white/70">
                {t('common:soon')}
              </span>
            )}
          </span>
        ) : (
          <Button
            variant="white"
            size="sm"
            onClick={e => {
              e.preventDefault();
              connectAction?.();
            }}
          >
            {connectLabel}
          </Button>
        )}
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
  const [isTelegramConnected, connectTelegram] = useTelegramConnect();
  const [webPushPermission, requestWebPushPermission] = useWebPushPermission();
  if (isMiniApp) return null;

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
            value={(value || []).includes('EMAIL')}
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
          isConnected={isTelegramConnected}
          connectLabel={t('common.notifications.messangers.connect')}
          connectAction={connectTelegram}
        >
          <Toggle
            value={(value || []).includes('TELEGRAM')}
            onChange={e => toggleValue('TELEGRAM', e)}
            loading={loading}
            disabled={disabled}
          />
        </AlertChannelRow>
      )}
      {renderingChannels.includes('WEB_PUSH') && (
        <AlertChannelRow
          icon={BellIcon}
          label={t('common.notifications.messangers.web_push')}
          isConnected={webPushPermission === 'ok'}
          connectLabel={t('common.notifications.messangers.request_permission')}
          connectAction={requestWebPushPermission}
        >
          <Toggle
            value={(value || []).includes('WEB_PUSH')}
            onChange={e => toggleValue('WEB_PUSH', e)}
            loading={loading}
            disabled={disabled}
          />
        </AlertChannelRow>
      )}
    </div>
  );
};
