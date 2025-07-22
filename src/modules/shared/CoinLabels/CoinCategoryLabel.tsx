import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxCabinet } from 'boxicons-quasar';
import { type Coin } from 'api/types/shared';
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
      title={
        <div className="max-h-[300px] min-w-48 space-y-2 mobile:max-h-max">
          <h4 className="border-b border-b-v1-content-primary/10 bg-v1-surface-l4 pb-2 text-base font-medium">
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
        'rounded-full text-center ',
        size === 'xs' &&
          'flex size-4 items-center justify-center text-[9px] leading-none [&_img]:size-[12px] [&_svg]:size-[11px]',
        size === 'sm' &&
          'flex h-6 items-center justify-center text-xxs [&_img]:size-[14px] [&_svg]:size-[14px]',
        size === 'md' &&
          'h-6 text-xxs [&_img]:size-[16px] [&_svg]:!size-[16px]',
        'bg-v1-content-primary/10 text-v1-content-primary',
        'overflow-hidden',
        className,
      )}
      disabled={!clickable}
      chevron={false}
    >
      <Icon
        name={bxCabinet}
        className="stroke-v1-content-primary"
        strokeWidth={0.2}
      />{' '}
      {size !== 'xs' && (
        <>
          <span className="px-2">{t('common.category')}</span>
          {value.length > 0 && (
            <span
              className={clsx(
                '-ms-1 flex items-center justify-center self-stretch bg-white/5',
                'pe-2 ps-1',
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
