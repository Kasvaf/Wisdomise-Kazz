import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { bxEditAlt, bxHistory } from 'boxicons-quasar';
import { initialQuoteDeposit, isPositionUpdatable, type Position } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
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

        {position.status === 'CANCELED' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Deposit Status</span>
              <span>{position.deposit_status}</span>
            </div>
          </>
        )}

        {position.entry_time != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Opened At</span>
            <span>{dayjs(position.entry_time).fromNow()}</span>
          </div>
        )}

        {position.exit_time != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">Closed At</span>
            <span>{dayjs(position.exit_time).fromNow()}</span>
          </div>
        )}

        {initialDeposit != null && (
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
              <span>
                <ReadableNumber value={Number(a.amount)} />
              </span>
            </div>
          ))}

        {position.pnl != null && (
          <div className="flex items-center justify-between">
            <span className="text-v1-content-secondary">P / L</span>
            <span>
              <ReadableNumber value={Number(position.pnl)} label="%" />
            </span>
          </div>
        )}

        {position.current_total_equity != null &&
          position.status !== 'CANCELED' && (
            <div className="flex items-center justify-between">
              <span>Current Value</span>
              <span>
                <ReadableNumber
                  value={Number(position.current_total_equity)}
                  label="USDT"
                />
              </span>
            </div>
          )}

        {pairSlug && position.status !== 'CANCELED' && (
          <Button
            variant="link"
            className="!p-0 !text-xs text-v1-content-link"
            contentClassName="!text-v1-content-link"
            to={`/trader-hot-coins/${pairSlug}/transactions?key=${position.key}`}
            size="small"
          >
            <Icon name={bxHistory} size={16} className="mr-1" />
            Transactions History
          </Button>
        )}
      </div>
    </div>
  );
};

export default PositionDetail;
