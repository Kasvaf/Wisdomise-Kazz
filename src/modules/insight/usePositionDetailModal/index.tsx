import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { type FullPosition } from 'api/builder';
import { type MarketTypes } from 'api/types/financialProduct';
import { roundSensible } from 'utils/numbers';
import PriceChange from 'shared/PriceChange';
import useModal from 'shared/useModal';
import PairInfo from 'shared/PairInfo';
import Badge from 'shared/Badge';
import usePositionStatusMap from '../signaler/usePositionStatusMap';
import { ReactComponent as HeaderIcon } from './header-icon.svg';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div className={clsx('flex flex-col items-start', className)}>
      <div className="mb-1 text-xs text-white/50">{label}</div>
      {children}
    </div>
  );
};

const ItemsList: React.FC<{
  title: string;
  items?: Array<{
    key: string;
    amount_ratio: number;
    applied?: boolean;
    price_exact?: number;
    date?: string;
  }>;
  className?: string;
  priceClassName?: string;
}> = ({ title, items, className, priceClassName }) => {
  if (!items) return null;

  return (
    <div className={className}>
      <h3 className="mb-1 text-sm text-white/30">{title}</h3>

      {items.map((item, ind) => (
        <div
          key={item.key}
          className="mb-1.5 flex items-center justify-between rounded-lg bg-black/15 px-2 py-1 text-xxs"
        >
          <div className="flex items-center gap-1">
            {ind + 1}. {title}{' '}
            {item.applied && <Badge color="white" label="Hitted" />}
            {item.date && (
              <span className="font-normal text-white/50">
                {dayjs(item.date).format('HH:mm, MMM DD')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>{item.amount_ratio * 100}% at</span>
            <span className={clsx('text-sm', priceClassName)}>
              {typeof item.price_exact === 'number' &&
                roundSensible(item.price_exact)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface PositionDetails extends FullPosition {
  strategy?: {
    name: string;
    market_name?: MarketTypes;
    profile?: {
      title: string;
    };
  };
}

const PositionDetailModal: React.FC<{
  position: PositionDetails;
  onResolve?: (account?: string) => void;
}> = ({ position }) => {
  const market = position.strategy?.market_name || 'FUTURES';
  const statusMap = usePositionStatusMap();

  return (
    <div>
      <h2 className="mb-3 flex items-center justify-between text-base font-semibold">
        <div className="flex items-center gap-1">
          <HeaderIcon />
          <span>Position Detail</span>
        </div>
      </h2>

      <div className="mb-3 mt-6 flex items-center">
        <PairInfo
          market={market}
          name={position?.pair_name}
          className="w-1/2 !justify-start"
        />
        <div className="w-1/2">
          <div className="text-xs text-white/50">Signaler</div>
          <div className="line-clamp-1 text-base">
            {position.strategy?.profile?.title || position.strategy?.name}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-black/10 p-3">
        <section>
          <div className="flex flex-wrap items-center">
            <Labeled label="Status" className="w-1/2">
              <Badge
                label={statusMap[position.status].label}
                color={statusMap[position.status].color}
                className="grow-0 !text-sm"
              />
            </Labeled>
            <Labeled label="P/L" className="w-1/2">
              <PriceChange
                value={position.pnl}
                valueToFixed
                textClassName="!text-sm"
              />
            </Labeled>
            <Labeled label="Position Side" className="mt-3 w-1/2">
              <div className="text-sm">{position.position_side}</div>
            </Labeled>
            <Labeled label="Current Size" className="mt-3 w-1/2">
              <div className="text-sm">
                {[
                  ...(position.manager?.take_profit ?? []),
                  ...(position.manager?.stop_loss ?? []),
                ]
                  .filter(x => x.applied)
                  .reduce((a, b) => a * (1 - b.amount_ratio), 1) * 100}{' '}
                %
              </div>
            </Labeled>
          </div>
        </section>
        <div className="my-3 border-b border-white/10" />
        <ItemsList
          title="Open"
          items={[
            {
              key: 'any',
              amount_ratio: 1,
              applied: true,
              price_exact: position.entry_price,
              date: position.entry_time,
            },
          ]}
          className="mb-3"
          priceClassName="text-info"
        />
        <ItemsList
          title="Take Profit"
          items={position.manager?.take_profit}
          className="mb-3"
          priceClassName="text-success"
        />
        <ItemsList
          title="Stop Loss"
          items={position.manager?.take_profit}
          priceClassName="text-error"
        />
      </div>
    </div>
  );
};

const usePositionDetailModal = (position?: PositionDetails) => {
  const [Modal, showModal] = useModal(PositionDetailModal, {
    width: 400,
  });

  return [
    Modal,
    async () => position && (await showModal({ position })),
  ] as const;
};

export default usePositionDetailModal;
