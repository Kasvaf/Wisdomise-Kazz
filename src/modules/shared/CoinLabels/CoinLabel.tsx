import { clsx } from 'clsx';
import { type FC, Fragment, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { icons } from './icons';

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
        hype: t('coin_labels.hype.title'),
        weekly_social_beloved: t('coin_labels.weekly_social_beloved.title'),
        monthly_social_beloved: t('coin_labels.monthly_social_beloved.title'),
        long_term_uptrend_confirmation: t(
          'coin_labels.long_term_uptrend_confirmation.title',
        ),
        long_term_downtrend_confirmation: t(
          'coin_labels.long_term_downtrend_confirmation.title',
        ),
        long_term_bullish_cheap: t('coin_labels.long_term_bullish_cheap.title'),
        long_term_bearish_overpriced: t(
          'coin_labels.long_term_bearish_overpriced.title',
        ),
        long_term_oversold_opportunity: t(
          'coin_labels.long_term_oversold_opportunity.title',
        ),
        long_term_overbought_risk: t(
          'coin_labels.long_term_overbought_risk.title',
        ),
        short_term_uptrend_confirmation: t(
          'coin_labels.short_term_uptrend_confirmation.title',
        ),
        short_term_downtrend_confirmation: t(
          'coin_labels.short_term_downtrend_confirmation.title',
        ),
        short_term_bullish_cheap: t(
          'coin_labels.short_term_bullish_cheap.title',
        ),
        short_term_bearish_overpriced: t(
          'coin_labels.short_term_bearish_overpriced.title',
        ),
        short_term_oversold_opportunity: t(
          'coin_labels.short_term_oversold_opportunity.title',
        ),
        short_term_overbought_risk: t(
          'coin_labels.short_term_overbought_risk.title',
        ),
      }[value as never] as string | undefined) ?? value.split('_').join(' ');

    const info = {
      hype: t('coin_labels.hype.info'),
      weekly_social_beloved: t('coin_labels.weekly_social_beloved.info'),
      monthly_social_beloved: t('coin_labels.monthly_social_beloved.info'),
      long_term_uptrend_confirmation: t(
        'coin_labels.long_term_uptrend_confirmation.info',
      ),
      long_term_downtrend_confirmation: t(
        'coin_labels.long_term_downtrend_confirmation.info',
      ),
      long_term_bullish_cheap: t('coin_labels.long_term_bullish_cheap.info'),
      long_term_bearish_overpriced: t(
        'coin_labels.long_term_bearish_overpriced.info',
      ),
      long_term_oversold_opportunity: t(
        'coin_labels.long_term_oversold_opportunity.info',
      ),
      long_term_overbought_risk: t(
        'coin_labels.long_term_overbought_risk.info',
      ),
      short_term_uptrend_confirmation: t(
        'coin_labels.short_term_uptrend_confirmation.info',
      ),
      short_term_downtrend_confirmation: t(
        'coin_labels.short_term_downtrend_confirmation.info',
      ),
      short_term_bullish_cheap: t('coin_labels.short_term_bullish_cheap.info'),
      short_term_bearish_overpriced: t(
        'coin_labels.short_term_bearish_overpriced.info',
      ),
      short_term_oversold_opportunity: t(
        'coin_labels.short_term_oversold_opportunity.info',
      ),
      short_term_overbought_risk: t(
        'coin_labels.short_term_overbought_risk.info',
      ),
    }[value as never] as string | undefined;

    const className = (() => {
      const classNames = {
        positive: 'bg-v1-content-positive/10 text-v1-content-positive',
        negative: 'bg-v1-content-negative/10 text-v1-content-negative',
        notice: 'bg-v1-content-notice/10 text-v1-content-notice',
        brand: 'bg-v1-background-secondary-hover/10 text-v1-content-primary/80',
        neutral: 'bg-v1-content-brand/10 text-v1-content-brand',
      };
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
        'h-6 rounded-full px-2 text-center text-xxs',
        'whitespace-nowrap capitalize [&_img]:size-4 [&_img]:shrink-0 [&_svg]:!size-4 [&_svg]:shrink-0',
        renderData.className,
        className,
      )}
    >
      <renderData.icon /> {renderData.text}
    </ClickableTooltip>
  );
}
