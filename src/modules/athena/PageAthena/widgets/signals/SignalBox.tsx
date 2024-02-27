/* eslint-disable @typescript-eslint/naming-convention */
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type React from 'react';
import PriceChange from 'shared/PriceChange';
import { useSignals } from './components/SignalsProvider';
import { ReactComponent as LockIcon } from './icons/lock.svg';
import { type LastPosition, type Strategy } from './types/signalResponse';

interface Props {
  strategy: Strategy;
  position: LastPosition;
}

export const SignalBox: React.FC<Props> = ({
  strategy,
  position: {
    pnl,
    entry_time,
    exit_time,
    suggested_action,
    position_side,
    take_profit,
    stop_loss,
    entry_price,
  },
}) => {
  const { userPlanLevel, onUpgradeClick } = useSignals();
  const hideSignal = userPlanLevel < strategy.profile.subscription_level;
  return (
    <div className="relative">
      <div
        className={clsx(
          'relative h-full rounded-lg',
          (!exit_time && suggested_action === 'OPEN') ||
            (exit_time && suggested_action === 'CLOSE')
            ? 'bg-white/10'
            : 'bg-white/5',
          hideSignal ? 'blur-sm' : 'group',
        )}
      >
        <section className="flex h-full flex-col  justify-between transition-opacity group-hover:opacity-0">
          <div className="flex w-full items-center justify-between p-2">
            <div className="flex flex-col items-start justify-start">
              <span
                className={clsx(
                  'text-xs',
                  !exit_time &&
                    (suggested_action === 'NO_ACTION'
                      ? 'text-white/40'
                      : 'text-white'),
                  exit_time &&
                    (suggested_action === 'CLOSE'
                      ? 'text-white'
                      : 'text-white/20'),
                )}
              >
                {exit_time ? 'Closed' : 'Opened'}{' '}
                <span className="text-white/40">|</span>{' '}
                <span className="text-white">{strategy?.title}</span>
              </span>
              <span
                className={clsx(
                  'text-xxs text-white/40',
                  exit_time &&
                    suggested_action === 'CLOSE_DELAYED' &&
                    '!text-white/20',
                )}
              >
                {dayjs(exit_time ?? entry_time).fromNow()}
              </span>
            </div>
            <div>
              <PriceChange
                value={hideSignal ? 10 : pnl}
                className="h-6 min-w-[66px]"
              />
            </div>
          </div>
          <div className="flex grow flex-col items-center justify-center bg-black/10 p-2">
            <div className="flex w-full items-center justify-start">
              <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
                Side
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
                <span className="capitalize text-white/20">
                  {position_side.toLowerCase()}
                </span>
              </span>
            </div>
          </div>
          <div className="flex w-full items-center justify-between p-2">
            <span
              className={clsx(
                'text-xxs text-white',
                exit_time &&
                  suggested_action === 'CLOSE_DELAYED' &&
                  'text-white/20',
              )}
            >
              Suggest
            </span>

            <p
              className={clsx(
                'rounded-full px-2 py-1 text-xxs leading-none',
                suggested_action.includes('NO_ACTION') &&
                  (exit_time
                    ? 'bg-white/10 text-white/20'
                    : 'bg-white/10 text-white/80'),

                suggested_action.includes('OPEN') &&
                  'bg-[#40F19C33] text-[#40f19ccc]',
                suggested_action === 'CLOSE' &&
                  'bg-[#F1405633] text-[#F14056CC]',
                suggested_action === 'CLOSE_DELAYED' &&
                  'bg-white/5 text-white/20',
              )}
            >
              {suggested_action.includes('NO_ACTION')
                ? 'No Action'
                : suggested_action.includes('OPEN')
                ? 'Open'
                : 'Close'}
            </p>
          </div>
        </section>

        <div className="absolute left-0 top-0 hidden h-full w-full flex-col justify-evenly rounded-lg opacity-0 transition-opacity duration-1000 group-hover:flex group-hover:opacity-100">
          <div className="flex flex-col items-center justify-between bg-black/10 p-2">
            {[
              ['Entry Price', entry_price],
              ['Date', dayjs(entry_time).format('HH:mm D MMM')],
            ].map(row => (
              <div
                key={row[0]}
                className="flex w-full items-center justify-start"
              >
                <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
                  {row[0]}
                </span>
                <div className="mx-1 grow basis-auto border-t border-white/5" />
                <span
                  className={clsx(
                    'grow-0 basis-auto text-xxs text-white/90',
                    exit_time &&
                      suggested_action === 'CLOSE_DELAYED' &&
                      '!text-white/20',
                  )}
                >
                  <span
                    className={clsx(
                      'capitalize text-white',
                      row[0] === 'Date' && 'text-white/40',
                    )}
                  >
                    {row[1]}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between bg-black/10 p-2">
            {[
              ['TP', take_profit ?? 'None'],
              ['SL', stop_loss ?? 'None'],
            ].map(row => (
              <div
                key={row[0]}
                className="flex w-full items-center justify-start"
              >
                <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
                  {row[0]}
                </span>
                <div className="mx-1 grow basis-auto border-t border-white/5" />
                <span
                  className={clsx(
                    'grow-0 basis-auto text-xxs text-white/90',
                    exit_time &&
                      suggested_action === 'CLOSE_DELAYED' &&
                      '!text-white/20',
                  )}
                >
                  <span
                    className={clsx(
                      'capitalize text-white',
                      row[0] === 'Date' && 'text-white/40',
                    )}
                  >
                    {row[1]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hideSignal && (
        <button
          onClick={onUpgradeClick}
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-4 py-2 text-xs leading-none text-white max-md:text-xxs"
        >
          <LockIcon />
          Upgrade
        </button>
      )}
    </div>
  );
};
