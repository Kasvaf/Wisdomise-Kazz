import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { PriceChange } from 'modules/shared/PriceChange';
import { type LastPosition } from 'api/types/signalResponse';

interface Props {
  position: LastPosition;
}

const SignalBoxTitle: React.FC<Props> = ({ position }) => {
  const { pnl, entry_time, exit_time, suggested_action } = position;
  return (
    <div className="flex w-full items-center justify-between p-1">
      <div className="flex flex-col items-start justify-start pl-2">
        <span
          className={clsx(
            'text-sm',
            !exit_time &&
              (suggested_action === 'NO_ACTION'
                ? 'text-white/40'
                : 'text-white'),
            exit_time &&
              (suggested_action === 'CLOSE' ? 'text-white' : 'text-white/20'),
          )}
        >
          {exit_time ? 'Closed' : 'Opened'}
        </span>
        <span
          className={clsx(
            'text-xxs text-white/40',
            exit_time &&
              suggested_action === 'CLOSE_DELAYED' &&
              '!text-white/20',
          )}
        >
          {dayjs(exit_time || entry_time).fromNow()}
        </span>
      </div>
      <div>
        <PriceChange value={pnl} className="h-6 min-w-[66px]" />
      </div>
    </div>
  );
};

const SignalBoxTpSl: React.FC<Props> = ({ position }) => {
  const { take_profit, stop_loss, exit_time, suggested_action } = position;
  return (
    <div className="flex flex-col items-center justify-between bg-black/10 p-2">
      {[take_profit, stop_loss].map((v, i) => (
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
              exit_time &&
                suggested_action === 'CLOSE_DELAYED' &&
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

const SignalBoxSuggestion: React.FC<Props> = ({ position }) => {
  const { exit_time, suggested_action } = position;
  const isNoAction = suggested_action === 'NO_ACTION';
  const isOpenOrDelayed = suggested_action.includes('OPEN');

  return (
    <div className="flex w-full items-center justify-between p-2">
      <span
        className={clsx(
          'text-xxs text-white',
          exit_time && suggested_action === 'CLOSE_DELAYED' && 'text-white/20',
        )}
      >
        Suggest
      </span>

      <p
        className={clsx(
          'rounded-full px-2 py-1 text-xxs leading-none',
          isNoAction &&
            (exit_time
              ? 'bg-white/10 text-white/20'
              : 'bg-white/10 text-white/80'),
          isOpenOrDelayed && 'bg-[#40F19C33] text-[#40f19ccc]',
          suggested_action === 'CLOSE' && 'bg-[#F1405633] text-[#F14056CC]',
          suggested_action === 'CLOSE_DELAYED' && 'bg-white/5 text-white/20',
        )}
      >
        {isNoAction ? 'No Action' : isOpenOrDelayed ? 'Open' : 'Close'}
      </p>
    </div>
  );
};

export const SignalBox: React.FC<Props> = ({ position }) => {
  const { exit_time, suggested_action } = position;
  const isMuted =
    (!exit_time && suggested_action === 'OPEN') ||
    (exit_time && suggested_action === 'CLOSE');

  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg',
        isMuted ? 'bg-white/10' : 'bg-white/5',
      )}
    >
      <SignalBoxTitle position={position} />
      <SignalBoxTpSl position={position} />
      <SignalBoxSuggestion position={position} />
    </div>
  );
};
