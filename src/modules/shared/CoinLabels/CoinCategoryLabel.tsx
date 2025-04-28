import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';

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
      title={
        <div className="min-w-48 space-y-2">
          <h4 className="sticky top-0 border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
            {t('common.categories')}:
          </h4>
          {value.map(cat => (
            <div key={cat.slug} className="text-sm">
              {cat.name}
            </div>
          ))}
        </div>
      }
      className={clsx(
        'rounded-full text-center text-xxs',
        size === 'xs' &&
          'flex h-[18px] items-center justify-center [&_img]:size-[12px] [&_svg]:size-[12px]',
        size === 'sm' &&
          'flex h-6 items-center justify-center [&_img]:size-[14px] [&_svg]:size-[14px]',
        size === 'md' && 'h-6 [&_img]:size-[16px] [&_svg]:!size-[16px]',
        'bg-v1-content-primary/10 text-v1-content-primary',
        'overflow-hidden',
        className,
      )}
      disabled={!clickable}
      chevron={false}
    >
      <span className={clsx(size === 'xs' ? 'px-1' : 'px-2')}>
        {size === 'xs' ? 'Cat' : t('common.category')}
      </span>
      {value.length > 0 && (
        <span className="-ms-1 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1">
          {`+${value.length}`}
        </span>
      )}
    </ClickableTooltip>
  );
}
