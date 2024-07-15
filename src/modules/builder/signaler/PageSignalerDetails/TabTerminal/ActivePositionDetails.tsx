import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type PropsWithChildren } from 'react';
import { type SignalItem, type FullPosition } from 'api/builder';
import usePositionStatusMap from 'modules/insight/signaler/usePositionStatusMap';
import Badge from 'shared/Badge';
import PriceChange from 'shared/PriceChange';
import { roundSensible } from 'utils/numbers';

const DetailInfo: React.FC<PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-xs text-white/50">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
};

const ActivePositionDetails: React.FC<{
  activePosition: FullPosition;
  className?: string;
}> = ({ activePosition, className }) => {
  const { t } = useTranslation('builder');
  const statusMap = usePositionStatusMap();

  const size =
    [
      ...(activePosition.manager?.take_profit ?? []),
      ...(activePosition.manager?.stop_loss ?? []),
    ]
      .filter(x => x.applied)
      .reduce((a, b) => a * (1 - b.amount_ratio), 1) * 100;

  const avg = (items: SignalItem[]) =>
    items.reduce((a, b) => a + (b.price_exact ?? 0), 0) / items.length;

  return (
    <div
      className={clsx(
        'rounded-xl border border-[#615298] bg-black/30 p-3',
        className,
      )}
    >
      <h2 className="mb-3 border-b border-white/5 pb-3 text-base font-semibold">
        {t('signal-form.position-details.title')}
      </h2>

      <div className="mb-2 flex grow flex-wrap items-center justify-between gap-4">
        <DetailInfo label={t('signal-form.position-details.status')}>
          {activePosition.status && (
            <Badge
              label={statusMap[activePosition.status].label}
              color={statusMap[activePosition.status].color}
            />
          )}
        </DetailInfo>

        <DetailInfo label="Leverage">{activePosition.leverage}x</DetailInfo>

        <DetailInfo label="Size">{roundSensible(size) + '%'}</DetailInfo>

        <DetailInfo label="Avg Entry Points">
          {activePosition.entry_price}
        </DetailInfo>

        <DetailInfo label="Avg Liquidity Price">
          {avg(activePosition.manager?.take_profit ?? [])}
        </DetailInfo>

        <DetailInfo label="Avg Stop Losses">
          {avg(activePosition.manager?.stop_loss ?? [])}
        </DetailInfo>

        <DetailInfo label={t('signal-form.position-side')}>
          <Badge label={activePosition.position_side} color="black" />
        </DetailInfo>

        <DetailInfo label={t('actual-pos-table.p-l')}>
          <PriceChange value={activePosition.pnl} valueToFixed />
        </DetailInfo>
      </div>
    </div>
  );
};

export default ActivePositionDetails;
