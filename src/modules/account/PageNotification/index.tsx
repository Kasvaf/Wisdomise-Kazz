import { Switch } from 'antd';
import { useStrategiesQuery } from 'api/notification';
import { type Strategy } from 'api/types/strategy';
import PageWrapper from 'modules/base/PageWrapper';
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
  const infos = [
    {
      label: 'Type',
      value: s.market_name,
    },
    {
      label: 'Timeframe',
      value: stringifyDuration(s.resolution),
    },
    {
      label: 'SL / TP',
      value: s.profile['SL/TP'],
    },
  ];

  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">{s.profile.title}</h2>
        <Switch />
      </div>
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
          Choose coin to receive notification
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

export default function PageNotification() {
  const strategies = useStrategiesQuery();

  return (
    <PageWrapper loading={strategies.isLoading}>
      <h1 className="mb-8 text-xl font-semibold">Notification Center</h1>

      <div>
        <h2 className="mb-3 text-xl font-semibold">Strategies List</h2>
        <p className="mb-6 text-sm font-medium text-white/60">
          We have listed all the strategies we provide.{' '}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {strategies.data?.results.map(s => (
          <StrategyCard key={s.key} strategy={s} />
        ))}
      </div>
    </PageWrapper>
  );
}
