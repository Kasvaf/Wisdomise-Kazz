import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { type RsiMomentumConfirmation } from 'api/market-pulse';
import { RsiNumber } from 'shared/RsiNumber';
import { RsiDivergence } from 'shared/RsiDivergence';

export function MomentumDetailsTable({
  value,
}: {
  value: RsiMomentumConfirmation;
}) {
  const { t } = useTranslation('market-pulse');
  const columns = useMemo(
    () =>
      [
        ...Object.keys(value.rsi_values ?? {}),
        ...Object.keys(value.divergence_types ?? {}),
      ]
        .filter((key, i, self) => self.indexOf(key) === i)
        .sort((a, b) => {
          const labelPower = (s: string) =>
            s.includes('h') ? 60 : s.includes('d') ? 1440 : 1;
          return (
            Number.parseInt(a, 10) * labelPower(a.toLowerCase()) -
            Number.parseInt(b, 10) * labelPower(b.toLowerCase())
          );
        }),
    [value],
  );
  return (
    <div className="max-w-full overflow-auto">
      <table className="w-full text-center text-xs [&_tbody_tr:first-child>td]:pt-4 [&_tr>*]:p-2 [&_tr>*]:px-3">
        <thead className="mb-2 overflow-hidden text-xxs text-v1-content-secondary">
          <tr className="[&>th]:bg-v1-surface-l4">
            <th className="w-full overflow-hidden rounded-l" />
            {columns.map((col, i, self) => (
              <th
                key={col}
                className={clsx(
                  i === self.length - 1 && 'overflow-hidden rounded-r',
                )}
              >
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-start text-xxs">{t('common.rsi')}</td>
            {columns.map(col => (
              <td key={col}>
                <RsiNumber value={value.rsi_values?.[col]?.value ?? null} />
              </td>
            ))}
          </tr>
          <tr>
            <td className="text-start text-xxs">{t('common.divergence')}</td>
            {columns.map(col => (
              <td key={col}>
                <RsiDivergence
                  value={value.divergence_types?.[col]?.value ?? null}
                  mini
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
