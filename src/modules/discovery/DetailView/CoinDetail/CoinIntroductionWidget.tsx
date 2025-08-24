import { useTranslation } from 'react-i18next';
import { useUnifiedCoinDetails } from './lib';

export function CoinIntroductionWidget({
  id,
  title,
  hr,
  className,
}: {
  title?: boolean;
  id?: string;
  hr?: string;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const { communityData, symbol } = useUnifiedCoinDetails();

  if (!communityData?.description) return null;

  return (
    <>
      <div className={className} id={id}>
        {title !== false && (
          <h3 className="mb-4 font-semibold text-sm">
            {t('coin-details.tabs.coin_introduction.title', {
              name: `${symbol.name ?? symbol.slug} (${
                symbol.abbreviation ?? symbol.slug
              })`,
            })}
          </h3>
        )}
        <div
          className="font-light mobile:text-xs text-sm text-v1-content-primary leading-relaxed [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: communityData?.description ?? '',
          }}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
