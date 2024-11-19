import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { bxEditAlt } from 'boxicons-quasar';
import { initialQuoteDeposit, isPositionUpdatable, type Position } from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Badge from 'shared/Badge';
import CancelButton from './CancelButton';
import CloseButton from './CloseButton';
import StatusWidget from './StatusWidget';

const PositionDetail: React.FC<{
  pairSlug?: string;
  position: Position;
  className?: string;
}> = ({ pairSlug, position, className }) => {
  const initialDeposit = initialQuoteDeposit(position);

  return (
    <div
      className={clsx('rounded-3xl bg-v1-surface-l2 p-4 text-xs', className)}
      key={position.key}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>{position.pair}</span>
          <div className="rounded-full bg-v1-surface-l3 px-2 py-1 text-v1-content-secondary">
            Market
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CancelButton position={position} />
          <CloseButton position={position} />

          {!!pairSlug && isPositionUpdatable(position) && (
            <Button
              variant="link"
              className="ms-auto !p-0 !text-xs text-v1-content-link"
              to={`/market/${pairSlug}?pos=${position.key}`}
            >
              <Icon name={bxEditAlt} size={16} />
              Edit
            </Button>
          )}
        </div>
      </div>
      <hr className="my-4 border-white/10" />
      <div className="flex flex-col gap-4">
        <StatusWidget position={position} />
        <div className="flex items-center justify-between">
          <span className="text-v1-content-secondary">Status</span>
          <Badge
            label={position.status}
            color={
              (
                {
                  DRAFT: 'green',
                  PENDING: 'blue',
                  OPENING: 'green',
                  OPEN: 'green',
                  CLOSING: 'grey',
                  CLOSED: 'grey',
                  CANCELED: 'red',
                } as const
              )[position.status]
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-v1-content-secondary">Deposit Status</span>
          <span>{position.deposit_status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-v1-content-secondary">Opened At</span>
          <span>
            {position.entry_time ? dayjs(position.entry_time).fromNow() : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-v1-content-secondary">Closed At</span>
          <span>
            {position.exit_time ? dayjs(position.exit_time).fromNow() : '-'}
          </span>
        </div>

        {initialDeposit !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Initial Deposit</span>
            <span>
              {initialDeposit} {position.quote}
            </span>
          </div>
        )}

        {position.current_assets
          .filter(x => !x.is_gas_fee)
          .map(a => (
            <div key={a.asset} className="flex items-center justify-between">
              <span className="text-v1-content-secondary">
                Current {a.asset}
              </span>
              <span>{a.amount}</span>
            </div>
          ))}

        <div className="flex items-center justify-between">
          <span className="text-v1-content-secondary">P / L</span>
          <span>{position.pnl ?? '-'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Current Value</span>
          <span>{position.current_total_equity} USDT</span>
        </div>

        {pairSlug && (
          <Button
            variant="alternative"
            className="block"
            to={`/trader-hot-coins/${pairSlug}/transactions?key=${position.key}`}
          >
            History
          </Button>
        )}
      </div>
    </div>
  );
};

export default PositionDetail;
