import { clsx } from 'clsx';
import { useState } from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { type Coin, type NetworkSecurity } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import GoPlus from './goplus.png';
import { ReactComponent as Trusted } from './trusted.svg';
import { ReactComponent as Risk } from './risk.svg';
import { ReactComponent as Warning } from './warning.svg';
import { useSecurityRows } from './useSecurityRows';

/* NAITODO improve badge */

function SecurityRow({
  field,
  value,
}: {
  field: keyof NetworkSecurity['detail'];
  value: NetworkSecurity;
}) {
  const rows = useSecurityRows(value.detail);
  const [open, setOpen] = useState(false);
  if (
    !rows[field] ||
    typeof value.detail[field] !== 'string' ||
    value.detail[field] === ''
  )
    return null;
  return (
    <div className="flex flex-col gap-2" onClick={() => setOpen(p => !p)}>
      <div className="flex flex-row items-center gap-1">
        {rows[field].badge === 'risk' ? (
          <Risk className="size-4 shrink-0" />
        ) : rows[field].badge === 'warning' ? (
          <Warning className="size-4 shrink-0" />
        ) : (
          <Trusted className="size-4 shrink-0" />
        )}
        <p className="grow text-xs capitalize">{rows[field].label} </p>
        {rows[field].info && (
          <Icon
            className={clsx(
              'shrink-0 text-v1-content-secondary',
              open && 'rotate-180',
            )}
            name={bxChevronDown}
            size={16}
          />
        )}
      </div>
      {rows[field].info && (
        <p
          className={clsx(
            'text-xxs leading-snug text-v1-content-secondary',
            !open && 'hidden',
          )}
        >
          {rows[field].info}
        </p>
      )}
    </div>
  );
}

function TaxesRow({ value }: { value: NetworkSecurity }) {
  const rows = useSecurityRows(value.detail);
  return (
    <div className="flex flex-col gap-2 py-2 text-xs">
      <div className="flex flex-row items-center gap-1">
        <div className="flex basis-1/2 items-center gap-1">
          {rows.buy_tax?.label}:
          <ReadableNumber
            value={value.detail.buy_tax ? +value.detail.buy_tax * 100 : null}
            popup="never"
            className={clsx(
              rows.buy_tax?.badge === 'risk'
                ? 'text-v1-content-negative'
                : rows.buy_tax?.badge === 'warning'
                ? 'text-v1-content-notice'
                : 'text-v1-content-positive',
            )}
            label="%"
          />
        </div>
        <div className="flex basis-1/2 items-center gap-1">
          {rows.sell_tax?.label}:
          <ReadableNumber
            value={value.detail.sell_tax ? +value.detail.sell_tax * 100 : null}
            popup="never"
            className={clsx(
              rows.sell_tax?.badge === 'risk'
                ? 'text-v1-content-negative'
                : rows.sell_tax?.badge === 'warning'
                ? 'text-v1-content-notice'
                : 'text-v1-content-positive',
            )}
            label="%"
          />
        </div>
      </div>
      {rows.buy_tax?.info && (
        <p className="text-xxs leading-snug text-v1-content-secondary">
          {rows.buy_tax?.info}
        </p>
      )}
    </div>
  );
}

export function CoinSecurityLabel({
  value,
  coin,
}: {
  value?: NetworkSecurity[] | null;
  coin: Coin;
}) {
  const { t } = useTranslation('coin-radar');
  const firstNetwork = !value || value.length === 0 ? null : value[0];

  const [selectedNetworkName, setSelectedNetworkName] = useState(
    firstNetwork ? firstNetwork.network_name : '',
  );

  const activeNetwork = value?.find(
    r => r.network_name === selectedNetworkName,
  );

  const badgeType =
    !value || value.length > 1
      ? 'go+'
      : firstNetwork?.label.trusted
      ? 'trusted'
      : (firstNetwork?.label.risk ?? 0) > 0 &&
        (firstNetwork?.label.warning ?? 0) === 0
      ? 'risk'
      : (firstNetwork?.label.warning ?? 0) > 0 &&
        (firstNetwork?.label.risk ?? 0) === 0
      ? 'warn'
      : 'go+';

  if (!value || value.length === 0) return null;

  return (
    <ClickableTooltip
      title={
        <div className="w-[300px] space-y-4 mobile:w-full">
          {activeNetwork && value.length > 1 && (
            <select
              value={selectedNetworkName}
              onChange={e => setSelectedNetworkName(e.target.value)}
              className="block w-full rounded-lg border-r-8 border-r-v1-surface-l5 bg-v1-surface-l5 p-2 px-4 !outline-none"
              disabled={value.length === 1}
            >
              {value.map(r => (
                <option value={r.network_name} key={r.network_name}>
                  {r.network_name}
                </option>
              ))}
            </select>
          )}
          <div className="rounded-lg bg-v1-surface-l5 p-4">
            <p className="text-xxs text-v1-content-secondary">
              {activeNetwork?.network_name}
            </p>
            <div className="max-w-64 overflow-auto whitespace-nowrap text-base text-v1-content-primary">
              {coin.name} - {t('coin_security.security_detection')}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {activeNetwork?.label.trusted && (
                <div className="inline-flex items-center gap-1 text-v1-content-positive">
                  <Trusted className="size-4 shrink-0" />
                  {t('coin_security.trusted')}
                </div>
              )}
              {(activeNetwork?.label.risk ?? 0) > 0 && (
                <div className="inline-flex items-center gap-1 text-v1-content-negative">
                  <Risk className="size-4 shrink-0" />
                  {t('coin_security.risk', {
                    count: activeNetwork?.label.risk ?? 0,
                  })}
                </div>
              )}
              {(activeNetwork?.label.warning ?? 0) > 0 && (
                <div className="inline-flex items-center gap-1 text-v1-content-notice">
                  <Warning className="size-4 shrink-0" />
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
              <SecurityRow
                field="can_take_back_ownership"
                value={activeNetwork}
              />
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
              <SecurityRow
                field="anti_whale_modifiable"
                value={activeNetwork}
              />
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
      }
      className={clsx(
        'whitespace-nowrap rounded-full px-3 py-1 text-center text-xxs',
        badgeType === 'go+' &&
          'bg-v1-content-primary/10 text-v1-content-primary',
        badgeType === 'trusted' &&
          'bg-v1-content-positive/10 text-v1-content-positive',
        badgeType === 'warn' &&
          'bg-v1-content-notice/10 text-v1-content-notice',
        badgeType === 'risk' &&
          'bg-v1-content-negative/10 text-v1-content-negative',
      )}
    >
      {badgeType === 'go+' ? (
        <>
          <img src={GoPlus} alt="Go Plus" className="w-4" />{' '}
          {t('coin_security.go_plus')}
        </>
      ) : badgeType === 'trusted' ? (
        <>
          <Trusted />
          {t('coin_security.trusted')}
        </>
      ) : badgeType === 'risk' ? (
        <>
          <Risk className="size-4" />
          {t('coin_security.risk', {
            count: firstNetwork?.label.risk ?? 0,
          })}
        </>
      ) : (
        <>
          <Warning className="size-4" />
          {t('coin_security.warning', {
            count: firstNetwork?.label.warning ?? 0,
          })}
        </>
      )}
    </ClickableTooltip>
  );
}
