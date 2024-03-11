import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useState } from 'react';
import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { type LastPosition } from 'api/types/signalResponse';
import isTouchDevice from 'utils/isTouchDevice';
import PriceChange from 'shared/PriceChange';
import Badge from 'shared/Badge';
import { useSuggestionsMap } from './constants';
import ValuesRow from './ValuesRow';

interface Props {
  position: LastPosition;
}

const isClosed = (p: LastPosition) => Boolean(p.exit_time);

const SignalBoxTitle: React.FC<Props> = ({ position: p }) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();
  const { greyTitle } = suggestions[p.suggested_action];

  return (
    <div className="flex w-full items-center justify-between p-1">
      <div className="flex flex-col items-start justify-start pl-2">
        <span
          className={clsx(
            'text-sm',
            greyTitle ? 'text-white/40' : 'text-white',
          )}
        >
          {isClosed(p) ? t('status.closed') : t('status.opened')}
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
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();
  const { label, color } = suggestions[p.suggested_action];
  return (
    <div className="flex w-full items-center justify-between p-2">
      <span
        className={clsx(
          'text-xxs',
          color === 'grey' ? 'text-white/40' : 'text-white',
        )}
      >
        {t('matrix.suggestion')}
      </span>
      <Badge label={label} color={color} />
    </div>
  );
};

const SignalBox: React.FC<Props> = ({ position: p }) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();
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
      className="flex h-full w-[160px] cursor-pointer select-none flex-col justify-center rounded-lg bg-white/5"
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
                label: t('matrix.side'),
                value: side,
                isMuted: suggestions[p.suggested_action].greyTitle,
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
                label: t('matrix.entry-price'),
                value:
                  p.entry_price && numerable.format(p.entry_price, '0,0.00'),
              },
              {
                label: t('matrix.date'),
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
                      label: t('matrix.exit-price'),
                      value:
                        p.entry_price &&
                        numerable.format(p.exit_price, '0,0.00'),
                    },
                    {
                      label: t('matrix.date'),
                      value: dayjs(p.exit_time).format('HH:mm MMM DD'),
                      isMuted: true,
                    },
                  ]
                : [
                    {
                      label: t('matrix.tp'),
                      value:
                        p.take_profit &&
                        numerable.format(p.take_profit, '0,0.00'),
                    },
                    {
                      label: t('matrix.sl'),
                      value:
                        p.stop_loss && numerable.format(p.stop_loss, '0,0.00'),
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
