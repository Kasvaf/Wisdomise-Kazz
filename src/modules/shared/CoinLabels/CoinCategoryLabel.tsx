import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';

export function CoinCategoryLabel({
  className,
  value,
}: {
  className?: string;
  value?: Coin['categories'] | null;
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
        'h-6 rounded-full px-2 text-center text-xxs',
        'bg-v1-content-primary/10 text-v1-content-primary',
        'overflow-hidden !p-0',
        className,
      )}
      chevron={false}
    >
      <span className="px-3 py-1">{t('common.category')}</span>
      {value.length > 0 && (
        <span className="-ms-2 flex items-center justify-center self-stretch bg-white/5 pe-2 ps-1">
          {`+${value.length}`}
        </span>
      )}
    </ClickableTooltip>
  );
}
