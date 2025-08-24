import { useTranslation } from 'react-i18next';
import { type ComplexSlug, useUnifiedCoinDetails } from './lib';

export function CoinIntroductionWidget({
  id,
  title,
  slug,
  hr,
  className,
}: {
  slug: ComplexSlug;
  title?: boolean;
  id?: string;
  hr?: string;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const { rawData, data } = useUnifiedCoinDetails({ slug });

  if (!rawData.data1?.community_data?.description) return null;

  return (
    <>
      <div className={className} id={id}>
        {title !== false && (
          <h3 className="mb-4 font-semibold text-sm">
            {t('coin-details.tabs.coin_introduction.title', {
              name: `${data?.symbol.name ?? slug} (${
                data?.symbol.abbreviation ?? slug
              })`,
            })}
          </h3>
        )}
        <div
          className="font-light mobile:text-xs text-sm text-v1-content-primary leading-relaxed [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: rawData.data1?.community_data?.description ?? '',
          }}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
