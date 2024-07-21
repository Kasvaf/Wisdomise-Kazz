import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { bxChevronRight } from 'boxicons-quasar';
import { type ReactElement, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { type FullPosition } from 'api/builder';
import Icon from 'shared/Icon';
import Badge from 'shared/Badge';
import Button from 'shared/Button';
import Locker from 'shared/Locker';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';
import usePositionDetailModal from 'modules/insight/usePositionDetailModal';
import usePositionStatusMap from '../usePositionStatusMap';
import { ReactComponent as IconEmpty } from './empty-icon.svg';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-between mobile:items-start',
        className,
      )}
    >
      <div className="mb-2 text-xs font-light text-white/60">{label}</div>
      <div className="text-nowrap">{children}</div>
    </div>
  );
};

const ActivePosition: React.FC<{
  position?: FullPosition;
  locked?: false | ReactElement;
}> = ({ position: p, locked }) => {
  const { t } = useTranslation('strategy');
  const statusMap = usePositionStatusMap();

  const [PositionDetailModal, showPositionDetailModal] =
    usePositionDetailModal(p);

  if (!p) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[.03] p-3">
        <IconEmpty />
        <span className="mt-2 text-xs text-white/20">
          {t('no-active-positions')}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 flex min-h-[72px] justify-between rounded-xl bg-white/[.03] mobile:flex-col mobile:gap-0">
        <div className="flex basis-1/4 justify-between p-3 mobile:grid mobile:grid-cols-2">
          <Labeled
            className="shrink-0 basis-1/2"
            label={t('positions-history.status')}
          >
            {p.status && (
              <Badge
                label={statusMap[p.status].label}
                color={statusMap[p.status].color}
                className="min-w-[80px] !text-sm"
              />
            )}
          </Labeled>

          <Labeled
            className="shrink-0 basis-1/2"
            label={t('positions-history.pnl')}
          >
            <PriceChange value={p.pnl} textClassName="!text-2xl" />
          </Labeled>
        </div>

        <Locker
          containerClassName="basis-3/4"
          className="items-center justify-center !rounded-none backdrop-blur-[8px]"
          overlay={locked}
        >
          <div className="flex grow justify-between p-3 mobile:grid mobile:grid-cols-2 mobile:gap-y-4">
            <Labeled label={t('positions-history.position-side')}>
              {p.position_side}
            </Labeled>
            <Labeled label={t('position-detail-modal.current-size')}>
              <div className="text-sm">
                {[
                  ...(p.manager?.take_profit ?? []),
                  ...(p.manager?.stop_loss ?? []),
                ]
                  .filter(x => x.applied)
                  .reduce((a, b) => a * (1 - b.amount_ratio), 1) * 100}{' '}
                %
              </div>
            </Labeled>
            <Labeled label={t('positions-history.entry-time')}>
              {p.entry_time ? dayjs(p.entry_time).format('DD MMM HH:mm') : '-'}
            </Labeled>
            <Labeled label={t('positions-history.entry-price')}>
              <FancyPrice value={p.entry_price} />
            </Labeled>
            <Labeled label={t('positions-history.take-profit')}>
              {(p.manager?.take_profit?.length ?? 0) > 1 ? (
                <Button
                  variant="alternative"
                  className="!rounded-lg !py-1 !pl-2 !pr-1"
                  onClick={showPositionDetailModal}
                >
                  Multi-TP
                  <Icon size={16} name={bxChevronRight} />
                </Button>
              ) : (
                <FancyPrice value={p.take_profit} />
              )}
            </Labeled>
            <Labeled label={t('positions-history.stop-loss')}>
              {(p.manager?.stop_loss?.length ?? 0) > 1 ? (
                <Button
                  variant="link"
                  className="!rounded-lg !py-1 !pl-2 !pr-1"
                  onClick={showPositionDetailModal}
                >
                  Multi-SL
                  <Icon size={16} name={bxChevronRight} />
                </Button>
              ) : (
                <FancyPrice value={p.stop_loss} />
              )}
            </Labeled>
          </div>
        </Locker>
      </div>
      {PositionDetailModal}
    </>
  );
};

export default ActivePosition;
