import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { type LastPosition } from 'api/types/signalResponse';
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

const SignalBoxTpSl: React.FC<Props> = ({ position: p }) => {
  return (
    <div className="flex flex-col items-center justify-between bg-black/10 p-2">
      {[p.take_profit, p.stop_loss].map((v, i) => (
        <div
          key={v}
          className="flex w-full items-center justify-start first:mb-2"
        >
          <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
            {i === 0 ? 'TP' : 'SL'}
          </span>
          <div className="mx-1 grow basis-auto border-t border-white/5" />
          <span
            className={clsx(
              'grow-0 basis-auto text-xs text-white/90',
              p.exit_time &&
                p.suggested_action === 'CLOSE_DELAYED' &&
                '!text-white/20',
            )}
          >
            {v || <span className="text-white/20">None</span>}
          </span>
        </div>
      ))}
    </div>
  );
};

const SignalBoxSuggestion: React.FC<Props> = ({ position: p }) => {
  const isNoAction = p.suggested_action === 'NO_ACTION';
  const isOpenOrDelayed = p.suggested_action.includes('OPEN');

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
        Suggest
      </span>

      <p
        className={clsx(
          'rounded-full px-2 py-1 text-xxs leading-none',
          isNoAction &&
            (p.exit_time
              ? 'bg-white/10 text-white/20'
              : 'bg-white/10 text-white/80'),
          isOpenOrDelayed && 'bg-[#40F19C33] text-[#40f19ccc]',
          p.suggested_action === 'CLOSE' && 'bg-[#F1405633] text-[#F14056CC]',
          p.suggested_action === 'CLOSE_DELAYED' && 'bg-white/5 text-white/20',
        )}
      >
        {isNoAction ? 'No Action' : isOpenOrDelayed ? 'Open' : 'Close'}
      </p>
    </div>
  );
};

const SignalBox: React.FC<Props> = ({ position: p }) => {
  const isMuted =
    (!p.exit_time && p.suggested_action === 'OPEN') ||
    (p.exit_time && p.suggested_action === 'CLOSE');

  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg',
        isMuted ? 'bg-white/10' : 'bg-white/5',
      )}
    >
      <SignalBoxTitle position={p} />
      <SignalBoxTpSl position={p} />
      <SignalBoxSuggestion position={p} />
    </div>
  );
};

export default SignalBox;
