import { clsx } from 'clsx';
import { type FC, Fragment, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import {
  type CoinNetwork,
  type Coin,
  type NetworkSecurity,
} from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { CoinSecurityDetails } from './CoinSecurityDetails';
import { icons } from './icons';

const sharedLabelClassName = clsx(
  'rounded-full px-3 py-1 text-center text-xxs',
);

export function CoinLabel({
  className,
  value,
  popup = true,
  mini = false,
}: {
  className?: string;
  value: string;
  popup?: boolean | ReactNode;
  mini?: boolean;
}) {
  const { t } = useTranslation('coin-radar');

  const renderData = useMemo(() => {
    const icon = (icons[value as never] as FC) ?? Fragment;

    const text =
      ({
        weekly_social_beloved: 'Social Weekly Trend',
        monthly_social_beloved: 'Social Monthly Trend',
      }[value as never] as string) ?? value.split('_').join(' ');

    const info = {
      hype: t('coin_labels.hype.info'),
      weekly_social_beloved: t('coin_labels.weekly_social_beloved.info'),
      monthly_social_beloved: t('coin_labels.monthly_social_beloved.info'),
    }[value as never] as string | undefined;

    const classNames = {
      positive: 'bg-v1-content-positive/10 text-v1-content-positive',
      negative: 'bg-v1-content-negative/10 text-v1-content-negative',
      notice: 'bg-v1-content-notice/10 text-v1-content-notice',
      brand: 'bg-v1-background-secondary-hover/10 text-v1-content-primary/80',
      neutral: 'bg-v1-content-brand/10 text-v1-content-brand',
    };

    const className = (() => {
      if (value === 'hype' || value === 'trusted') return classNames.positive;
      if (value === 'risk') return classNames.negative;
      if (value === 'warning') return classNames.notice;
      if (value === 'weekly_social_beloved') return classNames.brand;
      if (
        value.includes('downtrend') ||
        value.includes('bearish') ||
        value.includes('overbought')
      )
        return classNames.negative;
      if (
        value.includes('uptrend') ||
        value.includes('bullish') ||
        value.includes('oversold')
      )
        return classNames.positive;
      return classNames.neutral;
    })();

    return {
      icon,
      text,
      info,
      className,
    };
  }, [t, value]);

  return mini ? (
    <span
      className={clsx(
        'whitespace-nowrap capitalize [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
    >
      <renderData.icon />
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
      <renderData.icon /> {renderData.text}
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
          value={securityStatus}
          mini={mini}
          popup={<CoinSecurityDetails coin={coin} value={security} />}
        />
      )}
      {(labels ?? []).map(label => (
        <CoinLabel key={label} value={label} mini={mini} />
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
