import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';

export default function NCoinTransactions({
  value,
}: {
  value?: {
    buys?: number | null;
    sells?: number | null;
  } | null;
}) {
  const buys = value?.buys ?? 0;
  const sells = value?.sells ?? 0;
  const all = buys + sells;
  const buyPercentage = (buys / all || 1) * 100;

  return (
    <HoverTooltip
      title={
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <span>TXs</span>
          <DirectionalNumber
            direction="up"
            format={{
              decimalLength: 1,
            }}
            popup="never"
            showIcon={false}
            showSign={false}
            value={all}
          />
          <span>Buys</span>
          <DirectionalNumber
            direction="up"
            format={{
              decimalLength: 1,
            }}
            popup="never"
            showIcon={false}
            showSign={false}
            value={buys}
          />
          <span>Sells</span>
          <DirectionalNumber
            direction="down"
            format={{
              decimalLength: 1,
            }}
            popup="never"
            showIcon={false}
            showSign={false}
            value={sells}
          />
        </div>
      }
    >
      <div className="flex items-center gap-1">
        {all}
        <div className="flex h-1 w-8 overflow-hidden rounded-xl bg-v1-surface-l2">
          <div
            className="h-full bg-v1-background-positive"
            style={{ width: `${buyPercentage}%` }}
          />
          <div
            className="h-full bg-v1-background-negative"
            style={{ width: `${value?.sells ? 100 - buyPercentage : 0}%` }}
          />
        </div>
      </div>
    </HoverTooltip>
  );
}
