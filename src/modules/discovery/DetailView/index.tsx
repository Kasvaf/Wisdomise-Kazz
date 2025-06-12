import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type AVAILABLE_DETAILS } from 'modules/discovery/constants';
import { WhaleDetail } from './WhaleDetail';
import { CoinDetail } from './CoinDetail';
import EmptyIcon from './empty.png';

export const DetailView: FC<{
  detail: (typeof AVAILABLE_DETAILS)[number];
  slug?: string;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ detail, slug, focus, expanded, className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {slug ? (
        detail === 'whale' ? (
          <WhaleDetail expanded={expanded} focus={focus} slug={slug} />
        ) : (
          <CoinDetail expanded={expanded} focus={focus} slug={slug} />
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-3 py-24">
          <img src={EmptyIcon} alt="empty" className="mb-2 h-36" />
          <h2 className="text-2xl font-semibold">
            {t('common:select-detail-first')}
          </h2>
          <p className="max-w-[290px] text-center text-xs text-v1-content-secondary">
            {t('common:select-detail-first-description')}
          </p>
        </div>
      )}
    </div>
  );
};
