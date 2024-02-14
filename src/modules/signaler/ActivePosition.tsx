import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useSuggestionsMap } from 'modules/strategy/PageSignalsMatrix/constants';
import Badge from 'shared/Badge';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';
import { type PairSignalerItem } from 'api/signaler';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-between',
        className,
      )}
    >
      <div className="mb-2 text-xs font-light text-white/60">{label}</div>
      <div>{children}</div>
    </div>
  );
};

const ActivePosition: React.FC<{ signaler: PairSignalerItem }> = ({
  signaler: s,
}) => {
  const suggestions = useSuggestionsMap();

  return (
    <div className="mt-3 flex min-h-[72px] flex-wrap justify-between gap-3 rounded-xl bg-white/5 p-3">
      <Labeled label="Suggest">
        <Badge
          label={suggestions[s.suggested_action].label}
          color={suggestions[s.suggested_action].color}
          className="min-w-[80px] !text-sm"
        />
      </Labeled>

      <Labeled label="Market Side">{s.position_side}</Labeled>
      <Labeled label="Entry Time">
        {dayjs(s.entry_time).format('HH:mm MMM DD')}
      </Labeled>
      <Labeled
        label="P/L"
        className="mobile:basis-full mobile:border-y mobile:border-y-white/5 mobile:py-3"
      >
        <PriceChange value={s.pnl} textClassName="!text-2xl" />
      </Labeled>
      <Labeled label="Entry Price">
        <FancyPrice value={s.entry_price} />
      </Labeled>
      <Labeled label="Take Profit">
        <FancyPrice value={s.take_profit} />
      </Labeled>
      <Labeled label="Stop Loss">
        <FancyPrice value={s.stop_loss} />
      </Labeled>
    </div>
  );
};

export default ActivePosition;
