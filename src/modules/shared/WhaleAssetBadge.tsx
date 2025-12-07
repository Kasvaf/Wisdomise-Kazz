import type { WhaleAssetLabel } from 'api/discovery';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from './ClickableTooltip';
import { ReadableNumber } from './ReadableNumber';

const useBadgeDetail = (
  badge?: WhaleAssetLabel | null,
): {
  title: string;
  info?: string;
  className: string;
} => {
  const { t } = useTranslation('whale');
  if (badge === 'stable') {
    return {
      title: t('whale:asset_badges.stable'),
      info: t('whale:asset_badges.stable_info'),
      className: 'bg-v1-background-inverse/10 text-v1-content-primary',
    };
  }
  if (badge === 'holding')
    return {
      title: t('whale:asset_badges.holding'),
      info: t('whale:asset_badges.holding_info'),
      className: 'bg-v1-content-brand/10 text-v1-content-brand',
    };
  if (badge === 'unloading')
    return {
      title: t('whale:asset_badges.unloading'),
      info: t('whale:asset_badges.unloading_info'),
      className: 'bg-v1-background-secondary/10 text-v1-background-secondary',
    };
  if (badge === 'loading')
    return {
      title: t('whale:asset_badges.loading'),
      info: t('whale:asset_badges.loading_info'),
      className: 'bg-v1-content-positive/10 text-v1-content-positive',
    };
  if (badge === 'new_investment')
    return {
      title: t('whale:asset_badges.new_investment'),
      info: t('whale:asset_badges.new_investment_info'),
      className: 'bg-v1-background-accent/10 text-v1-background-accent',
    };
  if (badge === 'exit_portfolio')
    return {
      title: t('whale:asset_badges.exit_portfolio'),
      info: t('whale:asset_badges.exit_portfolio_info'),
      className: 'bg-v1-content-negative/10 text-v1-content-negative',
    };
  if (badge === 'dust') {
    return {
      title: t('whale:asset_badges.dust'),
      info: t('whale:asset_badges.dust_info'),
      className: 'bg-v1-border-primary/10 text-v1-border-primary',
    };
  }
  if (badge === 'trading') {
    return {
      title: t('whale:asset_badges.trading'),
      info: t('whale:asset_badges.trading_info'),
      className: 'bg-v1-content-primary/20 text-v1-content-primary',
    };
  }
  return {
    title: badge ?? t('common:not-available'),
    className: 'bg-v1-border-primary/10 text-v1-content-secondary',
  };
};

export function WhaleAssetBadge({
  className,
  value,
  date,
  percentage,
  textOnly,
}: {
  className?: string;
  value?: WhaleAssetLabel | null;
  date?: string | null;
  percentage?: number | null;
  textOnly?: boolean;
}) {
  const { t } = useTranslation('common');
  const detail = useBadgeDetail(value);
  const dateTxt = useMemo(() => {
    if (!date) return '';
    const dt = dayjs(date);
    const daysDiff = Math.abs(dt.diff(Date.now(), 'days'));
    const text = dt.fromNow(false);
    return `(${daysDiff < 2 ? t('recently') : text})`;
  }, [date, t]);

  const content = (
    <>
      {percentage && (
        <ReadableNumber
          format={{
            decimalLength: 1,
          }}
          label="%"
          popup="never"
          value={percentage}
        />
      )}
      {detail.title}
      {dateTxt && <span className="capitalize opacity-80">{dateTxt}</span>}
    </>
  );
  if (textOnly) return <span className={className}>{content}</span>;

  return (
    <ClickableTooltip
      chevron={false}
      className={clsx(
        'h-5 whitespace-nowrap rounded-full px-2 py-px text-2xs',
        detail.className,
        className,
      )}
      disabled={!detail.info}
      title={
        <>
          <h2 className="mb-1 text-base text-v1-content-primary">
            {detail.title}
          </h2>
          <p className="text-v1-content-secondary">{detail.info}</p>
        </>
      }
    >
      {content}
    </ClickableTooltip>
  );
}
