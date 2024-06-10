import dayjs from 'dayjs';
import * as numerable from 'numerable';
import { type PropsWithChildren } from 'react';
import { type FullPosition } from 'api/builder';
import usePositionStatusMap from 'modules/insight/signaler/usePositionStatusMap';
import Badge from 'shared/Badge';
import PriceChange from 'shared/PriceChange';
import { ReactComponent as DetailsIcon } from './details-icon.svg';
import { ReactComponent as CheckIcon } from './check-icon.svg';

const Box: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ title, children }) => {
  return (
    <div className="grow overflow-hidden rounded-lg bg-black/30">
      <div className="flex h-8 items-center bg-black px-2">{title}</div>
      <div className="p-2">{children}</div>
    </div>
  );
};

const BoxItem: React.FC<PropsWithChildren<{ checked?: boolean }>> = ({
  checked,
  children,
}) => {
  return (
    <div className="flex items-center border-b border-white/5 py-3">
      {checked ? (
        <CheckIcon className="mr-1 h-2 w-2 text-success" />
      ) : (
        <div className="w-3" />
      )}
      {children}
    </div>
  );
};

const PositionDetails: React.FC<{
  activePosition: FullPosition;
  className?: string;
}> = ({ activePosition, className }) => {
  const statusMap = usePositionStatusMap();

  return (
    <div className={className}>
      <h2 className="mb-4 flex items-center gap-1 text-base font-semibold">
        <DetailsIcon />
        <span>Position Details</span>
      </h2>

      <div className="mb-2 flex h-14 grow items-center justify-around rounded-xl bg-black/30 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Status:</span>
          {activePosition.status && (
            <Badge
              label={statusMap[activePosition.status].label}
              color={statusMap[activePosition.status].color}
            />
          )}
        </div>
        <div className="h-full border-r border-white/5" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Position Side:</span>
          <Badge label={activePosition.position_side} color="black" />
        </div>
        <div className="h-full border-r border-white/5" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">P/L:</span>
          <PriceChange value={activePosition.pnl} valueToFixed />
        </div>
        <div className="h-full border-r border-white/5" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Entry Time:</span>
          <span className="text-sm">
            {dayjs(activePosition.entry_time).format('HH:mm, MMM DD')}
          </span>
          <span className="text-xs text-white/50">
            ({dayjs(activePosition.entry_time).fromNow()})
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <Box title="Open Details">
          <BoxItem>
            Open 100% at $
            {numerable.format(activePosition.entry_price, '0,0.00')}
          </BoxItem>
        </Box>
        <Box title="Take Profit Details">
          {activePosition.manager?.take_profit?.map((tp, ind) => (
            <BoxItem key={tp.key} checked={tp.applied}>
              TP #{ind + 1}: {tp.amount_ratio * 100}% at $
              {numerable.format(tp.price_exact, '0,0.00')}
            </BoxItem>
          ))}
        </Box>
        <Box title="Stop Loss Details">
          {activePosition.manager?.stop_loss?.map((sl, ind) => (
            <BoxItem key={sl.key} checked={sl.applied}>
              SL #{ind + 1}: {sl.amount_ratio * 100}% at $
              {numerable.format(sl.price_exact, '0,0.00')}
            </BoxItem>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default PositionDetails;
