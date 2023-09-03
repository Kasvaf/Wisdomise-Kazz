import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useState } from 'react';
import { type LastPosition } from 'api/types/signalResponse';
import isTouchDevice from 'utils/isTouchDevice';
import PriceChange from 'shared/PriceChange';
import Badge from './Badge';
import { SUGGESTIONS } from './constants';
import ValuesRow from './ValuesRow';

interface Props {
  position: LastPosition;
}

const isClosed = (p: LastPosition) => Boolean(p.exit_time);

const SignalBoxTitle: React.FC<Props> = ({ position: p }) => {
  const { greyTitle } = SUGGESTIONS[p.suggested_action];

  return (
    <div className="flex w-full items-center justify-between p-1">
      <div className="flex flex-col items-start justify-start pl-2">
        <span
          className={clsx(
            'text-sm',
            greyTitle ? 'text-white/40' : 'text-white',
          )}
        >
          {isClosed(p) ? 'Closed' : 'Opened'}
        </span>
        <span className="text-xxs text-white/40">
          {dayjs(p.exit_time || p.entry_time).fromNow()}
        </span>
      </div>
      <div>
        <PriceChange value={p.pnl} className="h-6 min-w-[66px]" />
      </div>
    </div>
  );
};

const SignalBoxSuggestion: React.FC<{
  position: LastPosition;
}> = ({ position: p }) => {
  const { label, color } = SUGGESTIONS[p.suggested_action];
  return (
    <div className="flex w-full items-center justify-between p-2">
      <span
        className={clsx(
          'text-xxs',
          color === 'grey' ? 'text-white/40' : 'text-white',
        )}
      >
        Suggestion
      </span>
      <Badge label={label} color={color} />
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

  const side = p.position_side?.toLowerCase();
  return (
    <div
      className="flex h-full w-[160px] cursor-pointer select-none flex-col justify-center rounded-lg bg-white/10"
      onClick={clickHandler}
      onMouseEnter={enterHandler}
      onMouseLeave={leaveHandler}
    >
      {summary ? (
        <>
          <SignalBoxTitle position={p} />
          <ValuesRow
            values={[
              {
                label: 'side',
                value: side,
                isMuted: SUGGESTIONS[p.suggested_action].greyTitle,
              },
            ]}
            className="mb-1"
          />
          <SignalBoxSuggestion position={p} />
        </>
      ) : (
        <>
          <ValuesRow
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
          <ValuesRow
            values={
              isClosed(p) // is closed
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
