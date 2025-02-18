import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import {
  type CoinNetwork,
  type Coin,
  type NetworkSecurity,
  type CoinLabels as CoinLabelsType,
} from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { ReactComponent as Trusted } from './trusted.svg';
import { ReactComponent as Risk } from './risk.svg';
import { ReactComponent as Warning } from './warning.svg';
import { ReactComponent as SocialMonthly } from './social_monthly.svg';
import { ReactComponent as SocialWeekly } from './social_weekly.svg';
import Hype from './hype.png';
import { CoinSecurityDetails } from './CoinSecurityDetails';

const sharedLabelClassName = clsx(
  'rounded-full px-3 py-1 text-center text-xxs',
);

export function CoinLabel({
  className,
  value,
  type = 'trend_labels',
  popup = true,
  mini = false,
}: {
  className?: string;
  value: string;
  type?: keyof CoinLabelsType;
  popup?: boolean | ReactNode;
  mini?: boolean;
}) {
  const { t } = useTranslation('coin-radar');

  const renderData = useMemo(() => {
    const knownLabels: Array<{
      name: string;
      text: string;
      type: keyof CoinLabelsType;
      icon: ReactNode;
      info?: string;
      color: string;
    }> = [
      {
        name: 'hype',
        text: 'Hype',
        type: 'trend_labels',
        icon: <img src={Hype} />,
        info: t('coin_labels.hype.info'),
        color: clsx('bg-v1-content-positive/10 text-v1-content-positive'),
      },
      {
        name: 'weekly_social_beloved',
        text: 'Social Weekly Trend',
        type: 'trend_labels',
        icon: <SocialWeekly />,
        info: t('coin_labels.weekly_social_beloved.info'),
        color: clsx(
          'bg-v1-background-secondary-hover/10 text-v1-background-secondary-hover',
        ),
      },
      {
        name: 'monthly_social_beloved',
        text: 'Social Monthly Trend',
        type: 'trend_labels',
        icon: <SocialMonthly />,
        info: t('coin_labels.monthly_social_beloved.info'),
        color: clsx('bg-v1-content-brand/10 text-v1-content-brand'),
      },
      {
        name: 'trusted',
        text: 'Trusted',
        type: 'security_labels',
        icon: <Trusted />,
        color: clsx('bg-v1-content-positive/10 text-v1-content-positive'),
      },
      {
        name: 'warning',
        text: 'Warning',
        type: 'security_labels',
        icon: <Warning />,
        color: clsx('bg-v1-content-notice/10 text-v1-content-notice'),
      },
      {
        name: 'risk',
        text: 'Risk',
        type: 'security_labels',
        icon: <Risk />,
        color: clsx('bg-v1-content-negative/10 text-v1-content-negative'),
      },
    ];

    const label = knownLabels.find(x => x.type === type && x.name === value);

    return {
      isKnown: !!label?.text,
      icon: label?.icon ?? <>{'🏷️'}</>,
      text: label?.text ?? value.split('_').join(' '),
      info: label?.info,
      className:
        label?.color ??
        clsx('bg-v1-background-secondary-hover/10 text-v1-content-primary/80'),
    };
  }, [t, value, type]);

  if (!renderData.isKnown) return null;

  return mini ? (
    <span
      className={clsx(
        'whitespace-nowrap capitalize [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
    >
      {renderData.icon}
    </span>
  ) : (
    <ClickableTooltip
      title={
        typeof popup === 'boolean' || popup === undefined ? (
          <div>
            <p className="mb-2 text-sm capitalize text-v1-content-primary">
              {renderData.text}
            </p>
            <p className="text-xs text-v1-content-secondary">
              {renderData.info}
            </p>
          </div>
        ) : (
          popup
        )
      }
      chevron={false}
      disabled={popup === true ? !renderData.info : !popup}
      className={clsx(
        sharedLabelClassName,
        renderData.className,
        'whitespace-nowrap capitalize [&_img]:size-4 [&_img]:shrink-0 [&_svg]:!size-4 [&_svg]:shrink-0',
        className,
      )}
    >
      {renderData.icon} {renderData.text}
    </ClickableTooltip>
  );
}

export function CoinLabels({
  className,
  coin,
  categories,
  networks,
  security,
  labels,
  prefix,
  suffix,
  mini,
}: {
  className?: string;
  coin: Coin;
  categories?: Coin['categories'] | null;
  networks?: CoinNetwork[] | null;
  security?: NetworkSecurity[] | null;
  labels?: string[] | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
  mini?: boolean;
}) {
  const { t } = useTranslation('coin-radar');
  const [copy, content] = useShare('copy');

  const securityStatus =
    security?.length && (security ?? []).every(r => r.label.trusted)
      ? 'trusted'
      : (security ?? []).reduce((p, r) => p + (r.label.risk ?? 0), 0) > 0
      ? 'risk'
      : (security ?? []).reduce((p, r) => p + (r.label.warning ?? 0), 0)
      ? 'warning'
      : null;

  return (
    <div
      className={clsx(
        'flex items-start justify-start gap-[2px]',
        // 'max-h-14 w-auto overflow-y-auto',
        mini ? 'flex-nowrap text-xxs' : 'flex-wrap',
        className,
      )}
    >
      {prefix}
      {securityStatus && (
        <CoinLabel
          type="security_labels"
          value={securityStatus}
          mini={mini}
          popup={<CoinSecurityDetails coin={coin} value={security} />}
        />
      )}
      {(labels ?? []).map(label => (
        <CoinLabel key={label} type="trend_labels" value={label} mini={mini} />
      ))}
      {!mini && categories && categories.length > 0 && (
        <ClickableTooltip
          title={
            <div className="min-w-48 space-y-2">
              <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
                {t('common.categories')}:
              </h4>
              {(categories ?? []).map(cat => (
                <div key={cat.slug} className="text-sm">
                  {cat.name}
                </div>
              ))}
            </div>
          }
          className={clsx(
            sharedLabelClassName,
            'bg-v1-content-primary/10 text-v1-content-primary',
            'overflow-hidden !p-0',
          )}
          chevron={false}
        >
          <span className="px-3 py-1">{t('common.category')}</span>
          {categories.length > 0 && (
            <span className="-ms-2 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1">
              {`+${categories.length}`}
            </span>
          )}
        </ClickableTooltip>
      )}
      {!mini && networks && networks.length > 0 && (
        <ClickableTooltip
          title={
            <div className="min-w-48 space-y-2">
              <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
                {t('common.chains')}:
              </h4>
              {(networks ?? []).map(network => (
                <div
                  key={network.network.slug}
                  className="flex items-center justify-start gap-2"
                >
                  <img
                    src={network.network.icon_url}
                    className="size-7 rounded-full bg-v1-surface-l2"
                  />
                  <div className="grow">
                    <p className="text-sm">{network.network.name}</p>
                    <div className="flex w-full items-center justify-start gap-1 text-xxs text-v1-content-secondary">
                      {network.symbol_network_type === 'COIN' &&
                        t('common.native_coin')}
                      {network.symbol_network_type === 'TOKEN' && (
                        <>
                          {network.contract_address ? (
                            <>
                              {shortenAddress(network.contract_address)}
                              <Icon
                                name={bxCopy}
                                size={14}
                                className="cursor-pointer"
                                onClick={() => copy(network.contract_address)}
                              />
                            </>
                          ) : (
                            <>{t('common:not-available')}</>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          className={clsx(
            sharedLabelClassName,
            'bg-v1-content-notice-bold/10 text-v1-content-notice',
            'overflow-hidden !p-0',
          )}
          chevron={false}
        >
          <span className="px-3 py-1">{`🔗 ${t('common.chain')}`}</span>
          {networks.length > 0 && (
            <span className="-ms-2 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1 text-v1-content-primary">
              {`+${networks.length}`}
            </span>
          )}
        </ClickableTooltip>
      )}
      {suffix}
      {content}
    </div>
  );
}
