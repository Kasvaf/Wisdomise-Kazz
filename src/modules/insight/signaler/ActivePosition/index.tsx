import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from 'shared/Badge';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';
import { type RawPosition } from 'api/types/signalResponse';
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

interface Position extends RawPosition {
  take_profit: number;
  stop_loss: number;
}

const ActivePosition: React.FC<{ position?: Position }> = ({ position: p }) => {
  const { t } = useTranslation('strategy');

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

  const statusMap = {
    OPEN: {
      color: 'green',
      label: t('status.open'),
    },
    CLOSED: {
      color: 'red',
      label: t('status.closed'),
    },
    CANCELED: {
      color: 'grey',
      label: t('status.canceled'),
    },
  } as const;

  return (
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
        <FancyPrice value={p.take_profit} />
      </Labeled>
      <Labeled label={t('positions-history.stop-loss')}>
        <FancyPrice value={p.stop_loss} />
      </Labeled>
    </div>
  );
};

export default ActivePosition;
