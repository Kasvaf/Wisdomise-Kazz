import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { bxChevronRight } from 'boxicons-quasar';
import { type FullPosition } from 'api/builder';
import usePositionDetailModal from 'modules/insight/usePositionDetailModal';
import Badge from 'shared/Badge';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import usePositionStatusMap from '../usePositionStatusMap';
import { ReactComponent as IconEmpty } from './empty-icon.svg';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-between',
        className,
      )}
    >
      <div className="mb-2 text-xs font-light text-white/60">{label}</div>
      <div>{children}</div>
    </div>
  );
};

const ActivePosition: React.FC<{ position?: FullPosition }> = ({
  position: p,
}) => {
  const { t } = useTranslation('strategy');
  const statusMap = usePositionStatusMap();

  const [PositionDetailModal, showPositionDetailModal] =
    usePositionDetailModal(p);

  if (!p) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3">
        <IconEmpty />
        <span className="mt-2 text-xs text-white/20">
          {t('no-active-positions')}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 flex min-h-[72px] flex-wrap justify-between gap-3 rounded-xl bg-white/5 p-3">
        <Labeled label={t('positions-history.status')}>
          {p.status && (
            <Badge
              label={statusMap[p.status].label}
              color={statusMap[p.status].color}
              className="min-w-[80px] !text-sm"
            />
          )}
        </Labeled>

        <Labeled label={t('positions-history.market-side')}>
          {p.position_side}
        </Labeled>
        <Labeled label={t('positions-history.entry-time')}>
          {p.entry_time ? dayjs(p.entry_time).format('HH:mm MMM DD') : '-'}
        </Labeled>
        <Labeled
          label={t('positions-history.pnl')}
          className="mobile:basis-full mobile:border-y mobile:border-y-white/5 mobile:py-3"
        >
          <PriceChange value={p.pnl} textClassName="!text-2xl" />
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
      {PositionDetailModal}
    </>
  );
};

export default ActivePosition;
