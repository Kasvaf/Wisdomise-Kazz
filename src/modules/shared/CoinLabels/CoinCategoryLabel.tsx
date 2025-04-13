import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';

export function CoinCategoryLabel({
  className,
  value,
  mini,
  clickable,
}: {
  className?: string;
  value?: Coin['categories'] | null;
  clickable?: boolean;
  mini?: boolean;
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
        mini
          ? 'flex h-4 items-center justify-center [&_img]:size-[10px] [&_svg]:size-[10px]'
          : 'h-6 [&_img]:size-4 [&_svg]:!size-4',
        'bg-v1-content-primary/10 text-v1-content-primary',
        'overflow-hidden',
        className,
      )}
      disabled={!clickable}
      chevron={false}
    >
      {mini ? (
        <span className="px-2">Ca</span>
      ) : (
        <span className="px-3 py-1">{t('common.category')}</span>
      )}
      {value.length > 0 && (
        <span className="-ms-2 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1">
          {`+${value.length}`}
        </span>
      )}
    </ClickableTooltip>
  );
}
