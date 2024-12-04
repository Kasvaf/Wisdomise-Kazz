import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type SingleWhale } from 'api';
import { ClickableTooltip } from './ClickableTooltip';

type Badge =
  | SingleWhale['holding_assets'][number]['label']
  | SingleWhale['trading_assets'][number]['label'];

const useBadgeDetail = (
  badge: Badge,
): {
  title: string;
  info?: string;
  className: string;
} => {
  const { t } = useTranslation('whale');
  if (badge === 'holding')
    return {
      title: t('asset_badges.holding'),
      info: t('asset_badges.holding_info'),
      className: 'bg-v1-content-brand/10 text-v1-content-brand',
    };
  if (badge === 'unloading')
    return {
      title: t('asset_badges.unloading'),
      info: t('asset_badges.unloading_info'),
      className: 'bg-v1-background-secondary/10 text-v1-background-secondary',
    };
  if (badge === 'loading')
    return {
      title: t('asset_badges.loading'),
      info: t('asset_badges.loading_info'),
      className: 'bg-v1-content-positive/10 text-v1-content-positive',
    };
  if (badge === 'new_investment')
    return {
      title: t('asset_badges.new_investment'),
      info: t('asset_badges.new_investment_info'),
      className: 'bg-v1-background-accent/10 text-v1-background-accent',
    };
  if (badge === 'exit_portfolio')
    return {
      title: t('asset_badges.exit_portfolio'),
      info: t('asset_badges.exit_portfolio_info'),
      className: 'bg-v1-content-negative/10 text-v1-content-negative',
    };
  if (badge === 'trading') {
    return {
      title: t('asset_badges.trading'),
      className: 'bg-v1-content-primary/10 text-v1-content-primary',
    };
  }
  return {
    title: t('common:not-available'),
    className: 'text-v1-content-secondary',
  };
};

export function WhaleAssetBadge({
  className,
  value,
}: {
  className?: string;
  value:
    | SingleWhale['holding_assets'][number]['label']
    | SingleWhale['trading_assets'][number]['label'];
}) {
  const detail = useBadgeDetail(value);

  return (
    <ClickableTooltip
      chevron={false}
      title={
        <>
          <h2 className="mb-1 text-base text-v1-content-primary">
            {detail.title}
          </h2>
          <p className="text-v1-content-secondary">{detail.info}</p>
        </>
      }
      disabled={!detail.info}
      className={clsx(
        'h-5 whitespace-nowrap rounded-full px-2 py-px text-xxs',
        detail.className,
        className,
      )}
    >
      {detail.title}
    </ClickableTooltip>
  );
}
