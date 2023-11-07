import { useTranslation } from 'react-i18next';
import { type Strategy } from 'api/types/strategy';
import Card from 'modules/shared/Card';
import SignalChip from './SignalChip';

const units: Record<string, string> = {
  s: 'second',
  m: 'minute',
  h: 'hour',
  d: 'day',
};
const stringifyDuration = (dur: string) =>
  dur.replace(/(\d+)([dhms])/, (o, d: string, u: string) =>
    units[u] ? `${d} ${units[u]}${+d > 1 ? 's' : ''}` : o,
  );

const StrategyCard: React.FC<{ strategy: Strategy }> = ({ strategy: s }) => {
  const { t } = useTranslation('notifications');
  const infos = [
    {
      label: t('signaling.strategy.type'),
      value: s.market_name,
    },
    {
      label: t('signaling.strategy.timeframe'),
      value: stringifyDuration(s.resolution),
    },
    {
      label: t('signaling.strategy.sl-tp'),
      value: s.profile['SL/TP'] || 'None',
    },
  ];

  return (
    <Card>
      <h2 className="text-xl font-semibold">{s.profile.title}</h2>
      <p className="mt-4 text-sm text-white/60">{s.profile.description}</p>

      <div className="mt-8 flex justify-around rounded-lg bg-white/10 p-2">
        {infos.map(info => (
          <div key={info.label} className="text-center text-xs">
            <div className="text-white/50">{info.label}</div>
            <div className="mt-2">{info.value}</div>
          </div>
        ))}
      </div>
      <hr className="my-6 w-full border-white/10" />

      <div>
        <p className="text-base text-white/60">
          {t('signaling.strategy.choose-coin')}
        </p>

        <div className="flex flex-wrap">
          {s.supported_pairs.map(pair => (
            <SignalChip key={pair.name} pair={pair} strategy={s} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StrategyCard;
