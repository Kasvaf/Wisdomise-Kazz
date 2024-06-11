/* eslint-disable import/max-dependencies */
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren, useCallback, useState } from 'react';
import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import { useSubscription } from 'api';
import { type LastPosition } from 'api/types/signalResponse';
import isTouchDevice from 'utils/isTouchDevice';
import NotificationButton from 'modules/account/PageNotification/NotificationButton';
import PriceChange from 'shared/PriceChange';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import usePositionDetailModal from '../usePositionDetailModal';
import useSignalSubscriptionModal from './useSignalSubscriptionModal';
import { useSuggestionsMap } from './constants';
import ValuesRow from './ValuesRow';

interface Props {
  position: LastPosition;
  className?: string;
}

const isClosed = (p: LastPosition) => Boolean(p.exit_time);

const SignalBoxTitle: React.FC<Props> = ({ position: p, className }) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();
  const { greyTitle } = suggestions[p.suggested_action];

  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between px-4',
        className,
      )}
    >
      <div className="flex flex-col items-start justify-start">
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

const SignalBoxSuggestion: React.FC<Props> = ({ position: p, className }) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();
  const { label, color, greyTitle } = suggestions[p.suggested_action];
  const side = p.position_side?.toLowerCase();
  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between gap-1 px-4',
        className,
      )}
    >
      <Badge className="grow !text-xs" label={label} color={color} />
      <Badge
        className="grow !text-xs"
        label={
          <span>
            {t('matrix.side')}:{' '}
            <span className={greyTitle ? '' : 'text-white'}>{side}</span>
          </span>
        }
        color="grey"
      />
    </div>
  );
};

const Quoted: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center">
    <Icon size={16} name={bxChevronLeft} />
    {children}
    <Icon size={16} name={bxChevronRight} />
  </div>
);

const SignalBox: React.FC<Props> = ({ position: p, className }) => {
  const { t } = useTranslation('strategy');
  const { level } = useSubscription();
  const requiredLevel = p.strategy.profile?.subscription_level ?? 0;
  const isLocked = requiredLevel > level;

  const isTouch = isTouchDevice();
  const [summary, setSummary] = useState(true);

  const [PositionDetailModal, showPositionDetailModal] =
    usePositionDetailModal(p);

  const [SubModal, showSubModal] = useSignalSubscriptionModal(requiredLevel);
  const clickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    async e => {
      if (isLocked) {
        e.preventDefault();
        if (await showSubModal()) {
          await showPositionDetailModal();
        }
      }
      if (isTouch) {
        setSummary(currentSummary => {
          if (currentSummary) {
            void showPositionDetailModal();
          }
          return !currentSummary;
        });
      } else {
        await showPositionDetailModal();
      }
    },
    [isLocked, isTouch, showPositionDetailModal, showSubModal],
  );

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

  return (
    <>
      <div
        className={clsx(
          'flex h-[112px] w-[200px] cursor-pointer select-none flex-col justify-center overflow-hidden rounded-lg bg-white/5',
          className,
        )}
        onClick={clickHandler}
        onMouseEnter={enterHandler}
        onMouseLeave={leaveHandler}
      >
        {summary ? (
          <>
            <SignalBoxTitle position={p} className="h-1/2" />
            <div className="mx-4 border-b border-white/5" />
            <SignalBoxSuggestion position={p} className="h-1/2" />
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
              className="h-1/2 bg-white/5"
            />
            <ValuesRow
              className="h-1/2"
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
                        isLocked,
                        value:
                          (p.manager?.take_profit?.length ?? 0) > 1 ? (
                            <Quoted>Multi-TP</Quoted>
                          ) : p.take_profit ? (
                            numerable.format(p.take_profit, '0,0.00')
                          ) : undefined,
                      },
                      {
                        label: t('matrix.sl'),
                        isLocked,
                        value:
                          (p.manager?.stop_loss?.length ?? 0) > 1 ? (
                            <Quoted>Multi-SL</Quoted>
                          ) : p.stop_loss ? (
                            numerable.format(p.stop_loss, '0,0.00')
                          ) : undefined,
                      },
                    ]
              }
            >
              {!isLocked && !isClosed(p) && (
                <NotificationButton
                  size="small"
                  className="h-10 w-10"
                  pairName={p.pair_name}
                  strategy={p.strategy}
                />
              )}
            </ValuesRow>
          </>
        )}
      </div>

      {SubModal}
      {PositionDetailModal}
    </>
  );
};

export default SignalBox;
