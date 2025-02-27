import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReactComponent as LastMention } from './last_mention.svg';
import { ReactComponent as Messages } from './messages.svg';
import { ReactComponent as Pump } from './pump.svg';
import { ReactComponent as Dump } from './dump.svg';

export const SocialSentimentDetails: FC<{
  value?: SocialRadarSentiment | null;
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <div
      className={clsx(
        'grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-x-px gap-y-1',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-v1-content-secondary">
          <LastMention /> {t('call-change.last-mention')}:
        </div>
        <ReadableDate value={value?.last_signal_related_at} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-v1-content-secondary">
          <Messages /> {t('call-change.analyzed-messages')}:
        </div>
        <ReadableNumber
          popup="never"
          value={value?.signals_analysis?.total_signals}
          className="text-inherit"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-v1-content-secondary">
          <Pump /> {t('call-change.biggest-pump')}:
        </div>
        <DirectionalNumber
          popup="never"
          value={
            value?.gauge_tag === 'LONG'
              ? value?.signals_analysis?.max_profit_percentage
              : value?.signals_analysis?.max_loss_percentage
          }
          label="%"
          showIcon={false}
          showSign
          className="text-inherit"
          format={{
            decimalLength: 1,
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-v1-content-secondary">
          <Dump /> {t('call-change.biggest-dump')}:
        </div>
        <DirectionalNumber
          popup="never"
          value={
            value?.gauge_tag === 'LONG'
              ? value?.signals_analysis?.max_loss_percentage
              : value?.signals_analysis?.max_profit_percentage
          }
          direction="down"
          label="%"
          showIcon={false}
          showSign
          className="text-inherit"
          format={{
            decimalLength: 1,
          }}
        />
      </div>
    </div>
  );
};
