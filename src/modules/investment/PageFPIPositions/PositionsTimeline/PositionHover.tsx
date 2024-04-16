import dayjs from 'dayjs';
import { clsx } from 'clsx';
import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { type FpiPosition } from 'api/types/investorAssetStructure';
import PriceChange from 'shared/PriceChange';

const TimeBox: React.FC<{
  title: string;
  price?: number;
  time?: string;
  className?: string;
}> = ({ title, price, time, className }) => (
  <div className={clsx('rounded-2xl bg-black/20 p-3', className)}>
    <div className="text-xs text-white/40">{title}</div>
    <div className="py-1 text-sm text-white/80">
      ${numerable.format(price, '0,0.00')}
    </div>
    <div className="text-xs text-white/40">
      {dayjs(time).format('HH:mm, MMMM DD')}
    </div>
  </div>
);

const PositionHover: React.FC<{ p: FpiPosition }> = ({ p }) => {
  const { t } = useTranslation('strategy');

  return (
    <div className="flex items-center rounded-xl bg-[#323842] p-2">
      <div className="flex flex-col items-center">
        <PriceChange value={p.pnl} valueToFixed />
        <div className="flex items-center justify-center text-xs text-white/40">
          {p.position_side.toUpperCase()}
        </div>
      </div>
      <TimeBox
        title={t('positions-timeline.entry-point')}
        price={p.entry_price}
        time={p.entry_time}
        className="ml-2"
      />
      {p.exit_time != null && p.exit_price != null && (
        <TimeBox
          title={t('positions-timeline.exit-point')}
          price={p.exit_price}
          time={p.exit_time}
          className="ml-2"
        />
      )}
    </div>
  );
};

export default PositionHover;
