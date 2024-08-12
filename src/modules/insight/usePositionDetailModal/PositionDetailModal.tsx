import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { type FullPosition } from 'api/builder';
import { type MarketTypes } from 'api/types/financialProduct';
import { type SuggestedAction } from 'api/types/signalResponse';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Badge from 'shared/Badge';
import Button from 'shared/Button';
import usePositionStatusMap from '../signaler/usePositionStatusMap';
import { useSuggestionsMap } from '../PageSignalsMatrix/constants';
import { ReactComponent as HeaderIcon } from './header-icon.svg';
import OrdersList from './OrdersList';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div className={clsx('flex flex-col items-start', className)}>
      <div className="mb-1 text-xs text-white/50">{label}</div>
      {children}
    </div>
  );
};

export interface PositionDetails extends FullPosition {
  suggested_action?: SuggestedAction;
  strategy?: {
    name: string;
    market_name?: MarketTypes;
    profile?: {
      title: string;
    };
  };
}

const PositionDetailModal: React.FC<{
  position: PositionDetails;
  exploreLink?: string;
  onResolve?: (account?: string) => void;
}> = ({ position, exploreLink }) => {
  const { t } = useTranslation('strategy');
  const market = position.strategy?.market_name || 'FUTURES';
  const statusMap = usePositionStatusMap();
  const suggestionsMap = useSuggestionsMap();

  return (
    <div>
      <h2 className="mb-3 flex items-center justify-between text-base font-semibold">
        <div className="flex items-center gap-1">
          <HeaderIcon />
          <span>{t('position-detail-modal.title')}</span>
        </div>
      </h2>

      <div className="mb-3 mt-6 flex items-center">
        <PairInfo
          market={market}
          name={position?.pair_name}
          className="w-1/2 !justify-start"
        />
        <div className="w-1/2">
          <div className="text-xs text-white/50">
            {t('position-detail-modal.signaler')}
          </div>
          <div className="line-clamp-1 text-base">
            {position.strategy?.profile?.title || position.strategy?.name}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-black/10 p-3">
        <section>
          <div className="flex flex-wrap items-center">
            {position.status ? (
              <Labeled label={t('positions-history.status')} className="w-1/2">
                <Badge
                  label={statusMap[position.status].label}
                  color={statusMap[position.status].color}
                  className="grow-0 !text-sm"
                />
              </Labeled>
            ) : position.suggested_action ? (
              <Labeled
                label={t('position-detail-modal.suggestion')}
                className="w-1/2"
              >
                <Badge
                  label={suggestionsMap[position.suggested_action].label}
                  color={suggestionsMap[position.suggested_action].color}
                  className="grow-0 !text-sm"
                />
              </Labeled>
            ) : (
              <div />
            )}

            <Labeled label={t('positions-history.pnl')} className="w-1/2">
              <PriceChange
                value={position.pnl}
                valueToFixed
                textClassName="!text-sm"
              />
            </Labeled>
            <Labeled
              label={t('positions-history.position-side')}
              className="mt-3 w-1/2"
            >
              <div className="text-sm">{position.position_side}</div>
            </Labeled>
            <Labeled
              label={t('position-detail-modal.current-size')}
              className="mt-3 w-1/2"
            >
              <div className="text-sm">
                <ReadableNumber label="%" value={position.amount * 100} />
              </div>
            </Labeled>
          </div>
        </section>
        <div className="my-3 border-b border-white/10" />
        <OrdersList
          title={t('position-detail-modal.open')}
          items={position.manager?.open_orders?.map(oo => ({
            ...oo,
            amount_ratio: oo.amount,
            price_exact: oo.price,
          }))}
          className="mb-3"
          priceClassName="text-info"
        />
        <OrdersList
          title={t('position-detail-modal.take-profit')}
          items={position.manager?.take_profit}
          className="mb-3"
          priceClassName="text-success"
        />
        <OrdersList
          title={t('position-detail-modal.stop-loss')}
          items={position.manager?.stop_loss}
          priceClassName="text-error"
        />
      </div>

      {exploreLink && (
        <div className="mt-6 flex justify-center">
          <Button variant="alternative" to={exploreLink}>
            Explore Signaler
          </Button>
        </div>
      )}
    </div>
  );
};

export default PositionDetailModal;
