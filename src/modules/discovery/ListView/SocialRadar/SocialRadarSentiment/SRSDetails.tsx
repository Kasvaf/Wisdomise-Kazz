import type { SocialRadarSentiment } from 'api/discovery';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as Dump } from './dump.svg';
import { ReactComponent as LastMention } from './last_mention.svg';
import { ReactComponent as Messages } from './messages.svg';
import { ReactComponent as Pump } from './pump.svg';

export const SRSDetails: FC<{
  value?: SocialRadarSentiment | null;
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');

  const { dump, pump } = useMemo(() => {
    const d =
      value?.gauge_tag === 'LONG'
        ? value?.signals_analysis?.max_loss_percentage
        : value?.signals_analysis?.max_profit_percentage;

    const p =
      value?.gauge_tag === 'LONG'
        ? value?.signals_analysis?.max_profit_percentage
        : value?.signals_analysis?.max_loss_percentage;

    return {
      dump: typeof d === 'number' ? -1 * Math.abs(d) : undefined,
      pump: typeof p === 'number' ? Math.abs(p) : undefined,
    };
  }, [value]);
  return (
    <div
      className={clsx(
        'grid items-center gap-x-2 gap-y-px whitespace-nowrap',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-px overflow-hidden">
          <LastMention className="shrink-0" />
          <p className="overflow-hidden text-ellipsis text-2xs text-v1-content-secondary">
            {t('call-change.last-mention')}:
          </p>
        </div>
        <ReadableDate
          className="shrink-0 whitespace-nowrap text-inherit"
          popup={false}
          value={value?.last_signal_related_at}
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-px overflow-hidden">
          <Messages className="shrink-0" />
          <p className="overflow-hidden text-ellipsis text-2xs text-v1-content-secondary">
            {t('call-change.analyzed-messages')}:
          </p>
        </div>
        <ReadableNumber
          className="shrink-0 whitespace-nowrap text-inherit"
          popup="never"
          value={value?.signals_analysis?.total_signals}
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-px overflow-hidden">
          <Pump className="shrink-0" />
          <p className="overflow-hidden text-ellipsis text-2xs text-v1-content-secondary">
            {t('call-change.biggest-pump')}:
          </p>
        </div>
        <DirectionalNumber
          className="shrink-0 whitespace-nowrap text-inherit"
          format={{
            decimalLength: 1,
          }}
          label="%"
          popup="never"
          showIcon={false}
          showSign
          value={pump}
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-px overflow-hidden">
          <Dump className="shrink-0" />
          <p className="overflow-hidden text-ellipsis text-2xs text-v1-content-secondary">
            {t('call-change.biggest-dump')}:
          </p>
        </div>
        <DirectionalNumber
          className="shrink-0 whitespace-nowrap text-inherit"
          format={{
            decimalLength: 1,
          }}
          label="%"
          popup="never"
          showIcon={false}
          showSign
          value={dump}
        />
      </div>
    </div>
  );
};
