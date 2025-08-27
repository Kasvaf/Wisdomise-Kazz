import type { Coin } from 'api/types/shared';
import { bxCabinet } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';

export function CoinCategoryLabel({
  className,
  value,
  size,
  clickable,
}: {
  className?: string;
  value?: Coin['categories'] | null;
  clickable?: boolean;
  size: 'xs' | 'sm' | 'md';
}) {
  const { t } = useTranslation('coin-radar');

  if (!value || value.length === 0) return null;

  return (
    <ClickableTooltip
      chevron={false}
      className={clsx(
        'rounded-full text-center',
        size === 'xs' &&
          'flex size-4 items-center justify-center text-[9px] leading-none [&_img]:size-[12px] [&_svg]:size-[11px]',
        size === 'sm' &&
          'flex h-6 items-center justify-center text-xxs [&_img]:size-[14px] [&_svg]:size-[14px]',
        size === 'md' &&
          '[&_svg]:!size-[16px] h-6 text-xxs [&_img]:size-[16px]',
        'bg-v1-content-primary/10 text-v1-content-primary',
        'overflow-hidden',
        className,
      )}
      disabled={!clickable}
      title={
        <div className="max-h-[300px] mobile:max-h-max min-w-48 space-y-2">
          <h4 className="border-b border-b-v1-content-primary/10 pb-2 font-medium text-base">
            {t('common.categories')}:
          </h4>
          {value.map(cat => (
            <div className="text-sm" key={cat.slug}>
              {cat.name}
            </div>
          ))}
        </div>
      }
    >
      <Icon
        className="stroke-v1-content-primary"
        name={bxCabinet}
        strokeWidth={0.2}
      />{' '}
      {size !== 'xs' && (
        <>
          <span className="px-2">{t('common.category')}</span>
          {value.length > 0 && (
            <span
              className={clsx(
                '-ms-1 flex items-center justify-center self-stretch bg-white/5',
                'ps-1 pe-2',
              )}
            >
              {`+${value.length}`}
            </span>
          )}
        </>
      )}
    </ClickableTooltip>
  );
}
