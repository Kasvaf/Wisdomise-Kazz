import { useTranslation } from 'react-i18next';
import { useCoinDetails } from 'api/discovery';

export function CoinIntroductionWidget({
  id,
  slug,
  hr,
  className,
}: {
  slug: string;
  id?: string;
  hr?: string;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinDetails({ slug });

  if (!coinOverview.data?.community_data?.description) return null;

  return (
    <>
      <div id={id} className={className}>
        <h3 className="mb-4 text-sm font-semibold">
          {t('coin-details.tabs.coin_introduction.title', {
            name: `${coinOverview.data?.symbol.name ?? slug} (${
              coinOverview.data?.symbol.abbreviation ?? slug
            })`,
          })}
        </h3>
        <div
          className="text-sm font-light leading-relaxed text-v1-content-primary mobile:text-xs [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: coinOverview.data?.community_data?.description ?? '',
          }}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
