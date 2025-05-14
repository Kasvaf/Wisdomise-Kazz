import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';
import { ReadableDate } from 'shared/ReadableDate';

export const SRSLastMention: FC<{
  value?: SocialRadarSentiment | null;
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <label className="text-v1-content-secondary">
        {t('call-change.last-mention')}:
      </label>
      <ReadableDate popup={false} value={value?.last_signal_related_at} />
    </div>
  );
};
