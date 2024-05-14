import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { ReactComponent as TelegramIcon } from './TelegramIcon.svg';

const RadarBrief: React.FC<{
  radar?: {
    gauge_tag: string;
    messages_count: number;
  };
  className?: string;
}> = ({ radar, className }) => {
  const { t } = useTranslation('strategy');
  const hasFlag = useHasFlag();
  if (!radar || !hasFlag('?social-brief')) return null;

  const side = radar.gauge_tag;
  const cnt = radar.messages_count;
  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded bg-black/10 p-3',
        className,
      )}
    >
      <TelegramIcon className="size-8" />
      <div className="text-[8px] text-white/60">
        <div>
          {t('matrix.radar.consensus')}
          <span className="text-white"> {side}</span>
        </div>
        <div>
          <Trans ns="strategy" i18nKey="matrix.radar.across">
            Across <span className="font-bold text-[#34A3DA]">{{ cnt }}</span>{' '}
            Telegram Messages in the Past 24h
          </Trans>
        </div>
      </div>
    </div>
  );
};

export default RadarBrief;
