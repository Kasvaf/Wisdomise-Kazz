import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { type PairSignalerItem } from 'api/signaler';
import { useSuggestionsMap } from 'modules/strategy/PageSignalsMatrix/constants';
import Badge from 'shared/Badge';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';

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

const ActivePosition: React.FC<{ signaler: PairSignalerItem }> = ({
  signaler: s,
}) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();

  return (
    <div className="mt-3 flex min-h-[72px] flex-wrap justify-between gap-3 rounded-xl bg-white/5 p-3">
      <Labeled label={t('positions-history.suggest')}>
        <Badge
          label={suggestions[s.suggested_action].label}
          color={suggestions[s.suggested_action].color}
          className="min-w-[80px] !text-sm"
        />
      </Labeled>

      <Labeled label={t('positions-history.market-side')}>
        {s.position_side}
      </Labeled>
      <Labeled label={t('positions-history.entry-time')}>
        {s.entry_time ? dayjs(s.entry_time).format('HH:mm MMM DD') : '-'}
      </Labeled>
      <Labeled
        label={t('positions-history.pnl')}
        className="mobile:basis-full mobile:border-y mobile:border-y-white/5 mobile:py-3"
      >
        <PriceChange value={s.pnl} textClassName="!text-2xl" />
      </Labeled>
      <Labeled label={t('positions-history.entry-price')}>
        <FancyPrice value={s.entry_price} />
      </Labeled>
      <Labeled label={t('positions-history.take-profit')}>
        <FancyPrice value={s.take_profit} />
      </Labeled>
      <Labeled label={t('positions-history.stop-loss')}>
        <FancyPrice value={s.stop_loss} />
      </Labeled>
    </div>
  );
};

export default ActivePosition;
