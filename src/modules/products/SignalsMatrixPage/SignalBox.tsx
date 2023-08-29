import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useState } from 'react';
import { type LastPosition } from 'api/types/signalResponse';
import isTouchDevice from 'utils/isTouchDevice';
import PriceChange from 'shared/PriceChange';

interface Props {
  position: LastPosition;
}

const SignalBoxTitle: React.FC<Props> = ({ position: p }) => {
  return (
    <div className="flex w-full items-center justify-between p-1">
      <div className="flex flex-col items-start justify-start pl-2">
        <span
          className={clsx(
            'text-sm',
            !p.exit_time &&
              (p.suggested_action === 'NO_ACTION'
                ? 'text-white/40'
                : 'text-white'),
            p.exit_time &&
              (p.suggested_action === 'CLOSE' ? 'text-white' : 'text-white/20'),
          )}
        >
          {p.exit_time ? 'Closed' : 'Opened'}
        </span>
        <span
          className={clsx(
            'text-xxs text-white/40',
            p.exit_time &&
              p.suggested_action === 'CLOSE_DELAYED' &&
              '!text-white/20',
          )}
        >
          {dayjs(p.exit_time || p.entry_time).fromNow()}
        </span>
      </div>
      <div>
        <PriceChange value={p.pnl} className="h-6 min-w-[66px]" />
      </div>
    </div>
  );
};

const SignalBoxValues: React.FC<{
  values: Array<{ label: string; value?: string | number; isMuted?: boolean }>;
  className?: string;
}> = ({ values, className }) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-between bg-black/10 p-2',
        className,
      )}
    >
      {values.map(v => (
        <div
          key={v.label}
          className="mt-2 flex w-full items-center justify-start first:mt-0"
        >
          <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
            {v.label}
          </span>
          <div className="mx-1 grow basis-auto border-t border-white/5" />
          <span
            className={clsx(
              'grow-0 basis-auto text-xs text-white/90',
              v.isMuted && '!text-white/20',
            )}
          >
            {v.value || <span className="text-white/20">None</span>}
          </span>
        </div>
      ))}
    </div>
  );
};

const SuggestionLabel = {
  OPEN: 'Open',
  OPEN_DELAYED: 'Open',
  CLOSE: 'Close',
  CLOSE_DELAYED: 'Close',
  NO_ACTION: 'No Action',
};
const isOpenOrDelayed = (p: LastPosition) =>
  p.suggested_action === 'OPEN' || p.suggested_action === 'OPEN_DELAYED';

const SignalBoxSuggestion: React.FC<Props> = ({ position: p }) => {
  const isNoAction = p.suggested_action === 'NO_ACTION';

  return (
    <div className="flex w-full items-center justify-between p-2">
      <span
        className={clsx(
          'text-xxs text-white',
          p.exit_time &&
            p.suggested_action === 'CLOSE_DELAYED' &&
            'text-white/20',
        )}
      >
        Suggestion
      </span>

      <p
        className={clsx(
          'rounded-full px-2 py-1 text-xxs leading-none',
          isNoAction &&
            (p.exit_time
              ? 'bg-white/10 text-white/20'
              : 'bg-white/10 text-white/80'),
          isOpenOrDelayed(p) && 'bg-[#40F19C33] text-[#40f19ccc]',
          p.suggested_action === 'CLOSE' && 'bg-[#F1405633] text-[#F14056CC]',
          p.suggested_action === 'CLOSE_DELAYED' && 'bg-white/5 text-white/20',
        )}
      >
        {SuggestionLabel[p.suggested_action]}
      </p>
    </div>
  );
};

const SignalBox: React.FC<Props> = ({ position: p }) => {
  const isTouch = isTouchDevice();

  const [summary, setSummary] = useState(true);
  const clickHandler = useCallback(() => {
    if (isTouch) {
      setSummary(x => !x);
    }
  }, [isTouch]);
  const enterHandler = useCallback(() => {
    if (!isTouch) {
      setSummary(false);
    }
  }, [isTouch]);
  const leaveHandler = useCallback(() => {
    if (!isTouch) {
      setSummary(true);
    }
  }, [isTouch]);

  const isMuted =
    (!p.exit_time && p.suggested_action === 'OPEN') ||
    (p.exit_time && p.suggested_action === 'CLOSE');

  const side = p.position_side?.toLowerCase();
  return (
    <div
      className={clsx(
        'flex h-full w-[160px] cursor-pointer select-none flex-col justify-center rounded-lg',
        isMuted ? 'bg-white/10' : 'bg-white/5',
      )}
      onClick={clickHandler}
      onMouseEnter={enterHandler}
      onMouseLeave={leaveHandler}
    >
      {summary ? (
        <>
          <SignalBoxTitle position={p} />
          <SignalBoxValues
            values={[
              {
                label: 'side',
                value: side,
                isMuted: p.suggested_action === 'CLOSE_DELAYED',
              },
            ]}
            className="mb-1"
          />
          <SignalBoxSuggestion position={p} />
        </>
      ) : (
        <>
          <SignalBoxValues
            values={[
              {
                label: 'entry price',
                value: p.entry_price,
              },
              {
                label: 'date',
                value: dayjs(p.entry_time).format('HH:mm MMM DD'),
                isMuted: true,
              },
            ]}
            className="mb-1.5"
          />
          <SignalBoxValues
            values={
              p.exit_time // is closed
                ? [
                    {
                      label: 'exit price',
                      value: p.exit_price,
                    },
                    {
                      label: 'date',
                      value: dayjs(p.exit_time).format('HH:mm MMM DD'),
                      isMuted: true,
                    },
                  ]
                : [
                    {
                      label: 'TP',
                      value: p.take_profit,
                    },
                    {
                      label: 'SL',
                      value: p.stop_loss,
                    },
                  ]
            }
          />
        </>
      )}
    </div>
  );
};

export default SignalBox;
