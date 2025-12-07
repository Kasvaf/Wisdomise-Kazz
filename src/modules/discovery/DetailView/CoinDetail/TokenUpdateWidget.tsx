import { useGrpc } from 'api/grpc-v2';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { type FC, useState } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

const GreenRedChart: FC<{
  values: [number, number];
  titles: [string, string];
  label?: string;
}> = ({ values, titles, label }) => {
  const percentage = (values[0] / (values[0] + values[1])) * 100;
  return (
    <div className="flex h-11 flex-col gap-1">
      <div className="flex items-start justify-between">
        {titles.map(title => (
          <p className="text-2xs text-v1-content-secondary" key={title}>
            {title}
          </p>
        ))}
      </div>
      <div className="flex items-start justify-between">
        {values.map((value, index) => (
          <ReadableNumber
            className="text-xs"
            format={{
              decimalLength: 1,
            }}
            key={titles[index]}
            label={label}
            popup="never"
            value={value}
          />
        ))}
      </div>
      <div className="flex h-1 w-full max-w-full grow gap-1 overflow-hidden rounded">
        <div
          className="shrink-0 rounded bg-v1-content-positive"
          style={{
            flexBasis: `${percentage}%`,
          }}
        />
        <div className="min-w-1 shrink grow rounded bg-v1-content-negative" />
      </div>
    </div>
  );
};

const resolutions = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '6h', label: '6h' },
  { value: '1d', label: '1d' },
  { value: 'all-time', label: 'All' },
];

export function TokenUpdateWidget({ className }: { className?: string }) {
  const { symbol } = useUnifiedCoinDetails();
  const [resolution, setResolution] = useState<string>('1h');

  const { data } = useGrpc({
    service: 'network_radar',
    method: 'tokenUpdateStream',
    payload: {
      network: 'solana',
      tokenAddress: symbol.contractAddress ?? '',
      resolution,
    },
  });

  const numBuys = data?.numBuys ?? 0;
  const numSells = data?.numSells ?? 0;
  const numTx = numBuys + numSells;

  const buyVolume = data?.buyVolume ?? 0;
  const sellVolume = data?.sellVolume ?? 0;
  const volume = buyVolume + sellVolume;

  return (
    <div className={className}>
      <ButtonSelect
        className="mb-3 w-full"
        onChange={setResolution}
        options={resolutions}
        size="xs"
        surface={1}
        value={resolution}
        variant="default"
      />
      <div className="flex items-stretch gap-3 rounded-xl bg-v1-surface-l1 p-3 text-2xs">
        <div className="w-1/5">
          <div className="mb-5">
            <p className="mb-1 text-v1-content-secondary">TXNS</p>
            <ReadableNumber
              className="text-xs"
              format={{
                decimalLength: 1,
                compactInteger: true,
              }}
              popup="never"
              value={numTx}
            />
          </div>
          <div>
            <p className="mb-1 text-v1-content-secondary">Volume</p>
            <ReadableNumber
              className="text-xs"
              format={{
                decimalLength: 1,
                compactInteger: true,
              }}
              label="$"
              popup="never"
              value={volume}
            />
          </div>
        </div>
        <div className="border-white/10 border-r" />
        <div className="grow">
          <div className="mb-3">
            <GreenRedChart
              titles={['Buys', 'Sells']}
              values={[numBuys, numSells]}
            />
          </div>
          <div>
            <GreenRedChart
              label="$"
              titles={['Buy Vol', 'Sell Vol']}
              values={[buyVolume, sellVolume]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
