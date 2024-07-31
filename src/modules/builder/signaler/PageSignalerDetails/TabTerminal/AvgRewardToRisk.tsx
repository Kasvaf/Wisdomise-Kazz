import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type PropsWithChildren } from 'react';
import { type FullPosition } from 'api/builder';
import { ReadableNumber } from 'shared/ReadableNumber';
import { isLocal } from 'utils/version';

const Labeled: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ label, children, className }) => {
  return (
    <div className={className}>
      <div className="text-sm text-white/50">{label}</div>
      {children}
    </div>
  );
};

const AvgRewardToRisk: React.FC<{
  className?: string;
  activePosition: FullPosition;
}> = ({ className, activePosition }) => {
  const { t } = useTranslation('builder');
  const takeProfits = activePosition.manager?.take_profit ?? [];
  const tpLen = takeProfits.length;

  if (takeProfits.length === 0 || !isLocal) return null;
  return (
    <div className={clsx('rounded-xl bg-black/30 p-3', className)}>
      <div className="mb-3 border-b border-white/5 pb-3">
        <h2 className="mb-1 text-base font-semibold">{t('rr.avg.title')}</h2>
        <p className="text-sm text-white/30">{t('rr.avg.subtitle')}</p>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${tpLen + 1}, minmax(0, 1fr))`,
        }}
      >
        <div />
        {takeProfits.map((tp, ind) => (
          <Labeled
            label={t('rr.avg.take-profit-x', { ind: ind + 1 })}
            key={tp.key}
            className="px-3 "
          >
            <ReadableNumber
              value={tp.price_exact ?? 0}
              className="text-success"
              label="$"
            />
          </Labeled>
        ))}

        <Labeled label={t('rr.avg.average-entry-points')}>
          <ReadableNumber value={22} label="$" />
        </Labeled>

        <div
          className="row-span-2 grid rounded-lg bg-white/5 pt-2"
          style={{
            gridColumn: `span ${tpLen} / span ${tpLen}`,
            gridTemplateColumns: `repeat(${tpLen}, minmax(0, 1fr))`,
          }}
        >
          {takeProfits.map(tp => (
            <ReadableNumber
              key={tp.key}
              value={1.2}
              className="px-3 py-1 font-bold"
            />
          ))}

          {takeProfits.map(tp => (
            <ReadableNumber
              key={tp.key}
              value={1.2}
              className="px-3 py-1 font-bold"
            />
          ))}
        </div>

        <Labeled label={t('rr.avg.avg-stop-losses')}>
          <ReadableNumber value={22} label="$" className="text-error" />
        </Labeled>
      </div>
    </div>
  );
};

export default AvgRewardToRisk;
