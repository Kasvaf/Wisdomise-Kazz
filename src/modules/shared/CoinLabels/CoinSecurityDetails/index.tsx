import type { NetworkSecurity } from 'api/discovery';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { securityIcons } from '../icons';
import { SecurityRow } from './SecurityRow';
import { TaxesRow } from './TaxesRow';

export function CoinSecurityDetails({
  value,
}: {
  value?: NetworkSecurity[] | null;
}) {
  const { t } = useTranslation('coin-radar');
  const defaultNetwork = useMemo(() => {
    if (!value || value.length === 0) return null;
    let max = {
      score: 0,
      index: 0,
    };
    for (const [index, row] of value.entries()) {
      const score = (row.label.risk ?? 0) * 2 + (row.label.warning ?? 0);
      if (score > max.score) {
        max = {
          score,
          index,
        };
      }
    }
    return value[max.index];
  }, [value]);

  const [selectedNetworkName, setSelectedNetworkName] = useState(
    defaultNetwork?.network_name,
  );

  const activeNetwork = value?.find(
    r => r.network_name === selectedNetworkName,
  );

  if (!value || value.length === 0) return null;

  return (
    <div className="max-h-[350px] mobile:w-full w-[300px] space-y-4">
      {selectedNetworkName && value.length > 1 && (
        <select
          className="!outline-none block w-full rounded-lg border-r-8 border-r-v1-surface-l2 bg-v1-surface-l2 p-2 px-4"
          disabled={value.length === 1}
          onChange={e => setSelectedNetworkName(e.target.value)}
          value={selectedNetworkName}
        >
          {value.map(r => (
            <option key={r.network_name} value={r.network_name}>
              {r.network_name}
            </option>
          ))}
        </select>
      )}
      <div className="rounded-lg bg-v1-surface-l2 p-4">
        <p className="text-v1-content-secondary text-xxs">
          {activeNetwork?.network_name}
        </p>
        <div className="max-w-64 overflow-auto whitespace-nowrap text-base text-v1-content-primary">
          {t('coin_security.security_detection')}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {activeNetwork?.label.trusted && (
            <div className="inline-flex items-center gap-1 text-v1-content-positive">
              <securityIcons.trusted className="size-4 shrink-0" />
              {t('coin_security.trusted')}
            </div>
          )}
          {(activeNetwork?.label.risk ?? 0) > 0 && (
            <div className="inline-flex items-center gap-1 text-v1-content-negative">
              <securityIcons.risk className="size-4 shrink-0" />
              {t('coin_security.risk', {
                count: activeNetwork?.label.risk ?? 0,
              })}
            </div>
          )}
          {(activeNetwork?.label.warning ?? 0) > 0 && (
            <div className="inline-flex items-center gap-1 text-v1-content-notice">
              <securityIcons.warning className="size-4 shrink-0" />
              {t('coin_security.warning', {
                count: activeNetwork?.label.warning ?? 0,
              })}
            </div>
          )}
        </div>
      </div>
      <p className="text-base text-v1-content-primary">
        {t('coin_security.contract_security')}
      </p>
      {activeNetwork && (
        <>
          <SecurityRow field="is_open_source" value={activeNetwork} />
          <SecurityRow field="is_proxy" value={activeNetwork} />
          <SecurityRow field="is_mintable" value={activeNetwork} />
          <SecurityRow field="can_take_back_ownership" value={activeNetwork} />
          <SecurityRow field="owner_change_balance" value={activeNetwork} />
          <SecurityRow field="hidden_owner" value={activeNetwork} />
          <SecurityRow field="external_call" value={activeNetwork} />
          <SecurityRow field="selfdestruct" value={activeNetwork} />
          <SecurityRow field="gas_abuse" value={activeNetwork} />
          <TaxesRow value={activeNetwork} />
          <SecurityRow field="is_honeypot" value={activeNetwork} />
          <SecurityRow field="transfer_pausable" value={activeNetwork} />
          <SecurityRow field="trading_cooldown" value={activeNetwork} />
          <SecurityRow field="is_anti_whale" value={activeNetwork} />
          <SecurityRow field="anti_whale_modifiable" value={activeNetwork} />
          <SecurityRow field="cannot_buy" value={activeNetwork} />
          <SecurityRow field="cannot_sell_all" value={activeNetwork} />
          <SecurityRow field="slippage_modifiable" value={activeNetwork} />
          <SecurityRow field="is_blacklisted" value={activeNetwork} />
          <SecurityRow field="is_whitelisted" value={activeNetwork} />
          <SecurityRow
            field="personal_slippage_modifiable"
            value={activeNetwork}
          />
        </>
      )}
    </div>
  );
}
