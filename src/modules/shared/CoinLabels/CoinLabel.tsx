import { clsx } from 'clsx';
import { type FC, Fragment, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { icons } from './icons';

export function CoinLabel({
  className,
  value,
  title,
  clickable = true,
  size,
}: {
  className?: string;
  value: string;
  clickable?: boolean;
  title?: ReactNode;
  size: 'xs' | 'sm' | 'md';
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
        new_born: t('coin_labels.new_born.title'),
        coingecko: t('coin_labels.coingecko.title'),
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
      new_born: t('coin_labels.new_born.info'),
      coingecko: t('coin_labels.coingecko.info'),
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
        value.includes('oversold') ||
        value === 'new_born'
      )
        return classNames.positive;
      if (value === 'coingecko') return 'bg-[#ffe866] text-black';
      return classNames.neutral;
    })();

    return {
      icon,
      text,
      info,
      className,
    };
  }, [t, value]);

  return (
    <ClickableTooltip
      title={
        title || (
          <div className="flex flex-col gap-2">
            <p
              className={clsx(
                'inline-flex w-fit items-center gap-2 overflow-hidden px-2 py-1',
                'rounded-full text-sm capitalize [&_img]:size-[20px] [&_svg]:size-[20px]',
                renderData.className,
              )}
            >
              <renderData.icon /> {renderData.text}
            </p>
            {renderData.info && (
              <p className="text-xs text-v1-content-primary">
                {renderData.info}
              </p>
            )}
          </div>
        )
      }
      chevron={false}
      disabled={!clickable}
      className={clsx(
        'rounded-full text-center text-xxs',
        size === 'xs' &&
          'flex size-4 items-center justify-center [&_img]:size-[12px] [&_svg]:size-[12px]',
        size === 'sm' &&
          'flex size-6 items-center justify-center [&_img]:size-[14px] [&_svg]:size-[14px]',
        size === 'md' &&
          'h-6 flex-row-reverse px-3 [&_img]:size-[16px] [&_svg]:!size-[16px]',
        'whitespace-nowrap capitalize [&_img]:shrink-0 [&_svg]:shrink-0',
        renderData.className,
        className,
      )}
    >
      {size === 'md' && renderData.text}
      <renderData.icon />
    </ClickableTooltip>
  );
}
