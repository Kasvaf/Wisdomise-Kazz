import { useTranslation } from 'react-i18next';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export function CoinIntroductionWidget({
  id,
  title,
  slug,
  hr,
  className,
}: {
  slug: string;
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
      <div id={id} className={className}>
        {title !== false && (
          <h3 className="mb-4 text-sm font-semibold">
            {t('coin-details.tabs.coin_introduction.title', {
              name: `${data?.symbol.name ?? slug} (${
                data?.symbol.abbreviation ?? slug
              })`,
            })}
          </h3>
        )}
        <div
          className="text-sm font-light leading-relaxed text-v1-content-primary mobile:text-xs [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: rawData.data1?.community_data?.description ?? '',
          }}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
