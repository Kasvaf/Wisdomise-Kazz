import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuggestionsMap } from 'modules/insight/PageSignalsMatrix/constants';
import Badge from 'shared/Badge';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';
import {
  type RawPosition,
  type SuggestedAction,
} from 'api/types/signalResponse';
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
  suggested_action?: SuggestedAction;
  take_profit?: number | null;
  stop_loss?: number | null;
}

const ActivePosition: React.FC<{ position?: Position }> = ({ position: p }) => {
  const { t } = useTranslation('strategy');
  const suggestions = useSuggestionsMap();

  if (!p) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3">
        <IconEmpty />
        <span className="mt-2 text-xs text-white/20">
          There is no active positions yet.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex min-h-[72px] flex-wrap justify-between gap-3 rounded-xl bg-white/5 p-3">
      <Labeled label={t('positions-history.suggest')}>
        {p.suggested_action && (
          <Badge
            label={suggestions[p.suggested_action].label}
            color={suggestions[p.suggested_action].color}
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
