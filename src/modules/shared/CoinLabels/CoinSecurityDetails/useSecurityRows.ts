import { useTranslation } from 'react-i18next';
import { type NetworkSecurity } from 'api/types/shared';

type BadgeType = 'trusted' | 'warning' | 'risk' | null;

export const useSecurityRows = (
  detail: NetworkSecurity['detail'],
): Partial<
  Record<
    keyof NetworkSecurity['detail'],
    {
      label: string;
      info?: string;
      badge: BadgeType;
    }
  >
> => {
  const { t } = useTranslation('coin-radar');
  const calcBadge = (
    field: keyof NetworkSecurity['detail'],
    conditionExp: string,
    ifResult: BadgeType = 'warning',
    elseResult: BadgeType = 'trusted',
  ) => {
    if (!detail[field]) return null;
    return detail[field].toString() === conditionExp ? ifResult : elseResult;
  };
  return {
    is_open_source: {
      label: t('coin_security.fields.is_open_source.title'),
      info: t('coin_security.fields.is_open_source.subtitle'),
      badge: calcBadge('is_open_source', '0', 'risk'),
    },
    is_proxy: {
      label: t('coin_security.fields.is_proxy.title'),
      badge: calcBadge('is_proxy', '1', 'warning'),
    },
    is_mintable: {
      label: t('coin_security.fields.is_mintable.title'),
      badge: calcBadge('is_mintable', '1', 'warning'),
    },
    can_take_back_ownership: {
      label: t('coin_security.fields.can_take_back_ownership.title'),
      badge: calcBadge('can_take_back_ownership', '1', 'warning'),
    },
    owner_change_balance: {
      label: t('coin_security.fields.owner_change_balance.title'),
      badge: calcBadge('owner_change_balance', '1', 'risk'),
    },
    hidden_owner: {
      label: t('coin_security.fields.hidden_owner.title'),
      badge: calcBadge('hidden_owner', '1', 'warning'),
    },
    external_call: {
      label: t('coin_security.fields.external_call.title'),
      badge: calcBadge('external_call', '1', 'warning'),
    },
    selfdestruct: {
      label: t('coin_security.fields.selfdestruct.title'),
      badge: calcBadge('selfdestruct', '1', 'risk'),
    },
    gas_abuse: {
      label: t('coin_security.fields.gas_abuse.title'),
      badge: calcBadge('gas_abuse', '1', 'risk'),
    },
    buy_tax: {
      label: t('coin_security.fields.buy_tax.title'),
      badge: detail.buy_tax
        ? 100 * +(detail.buy_tax ?? 0) >= 10 &&
          100 * +(detail.buy_tax ?? 0) < 50
          ? 'warning'
          : 100 * +(detail.buy_tax ?? 0) >= 50
          ? 'risk'
          : 'trusted'
        : 'warning',
      info: t('coin_security.fields.tax.subtitle'),
    },
    sell_tax: {
      label: t('coin_security.fields.sell_tax.title'),
      badge: detail.sell_tax
        ? 100 * +(detail.sell_tax ?? 0) >= 10 &&
          100 * +(detail.sell_tax ?? 0) < 50
          ? 'warning'
          : 100 * +(detail.sell_tax ?? 0) >= 50
          ? 'risk'
          : 'trusted'
        : 'warning',
      info: t('coin_security.fields.tax.subtitle'),
    },
    is_honeypot: {
      label: t('coin_security.fields.is_honeypot.title'),
      badge: calcBadge('is_honeypot', '1', 'risk'),
    },
    transfer_pausable: {
      label: t('coin_security.fields.transfer_pausable.title'),
      badge: calcBadge('transfer_pausable', '1', 'warning'),
    },
    trading_cooldown: {
      label: t('coin_security.fields.trading_cooldown.title'),
      badge: calcBadge('trading_cooldown', '1', 'warning'),
    },
    is_anti_whale: {
      label: t('coin_security.fields.is_anti_whale.title'),
      badge: calcBadge('is_anti_whale', '1', 'warning'),
    },
    anti_whale_modifiable: {
      label: t('coin_security.fields.anti_whale_modifiable.title'),
      badge: calcBadge('anti_whale_modifiable', '1', 'warning'),
    },
    cannot_buy: {
      label: t('coin_security.fields.cannot_buy.title'),
      badge: calcBadge('cannot_buy', '1', 'warning'),
    },
    cannot_sell_all: {
      label: t('coin_security.fields.cannot_sell_all.title'),
      badge: calcBadge('cannot_sell_all', '1', 'warning'),
    },
    slippage_modifiable: {
      label: t('coin_security.fields.slippage_modifiable.title'),
      badge: calcBadge('slippage_modifiable', '1', 'warning'),
    },
    is_blacklisted: {
      label: t('coin_security.fields.is_blacklisted.title'),
      badge: calcBadge('is_blacklisted', '1', 'warning'),
    },
    is_whitelisted: {
      label: t('coin_security.fields.is_whitelisted.title'),
      badge: calcBadge('is_whitelisted', '1', 'warning'),
    },
    personal_slippage_modifiable: {
      label: t('coin_security.fields.personal_slippage_modifiable.title'),
      badge: calcBadge('personal_slippage_modifiable', '1', 'warning'),
    },
  };
};
