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
  /* NAITODO translate */
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
      label: 'Verified contract source code',
      info: 'This token has an open source contract and details can be retrieved from the contract code.',
      badge: calcBadge('is_open_source', '0', 'risk'),
    },
    is_proxy: {
      label: 'No proxy found',
      badge: calcBadge('is_proxy', '1', 'warning'),
    },
    is_mintable: {
      label: 'Mint function is transparent or non-existent',
      badge: calcBadge('is_mintable', '1', 'warning'),
    },
    can_take_back_ownership: {
      label: 'No retrievable ownership function found',
      badge: calcBadge('can_take_back_ownership', '1', 'warning'),
    },
    owner_change_balance: {
      label: 'Contract owner cannot modify balance',
      badge: calcBadge('owner_change_balance', '1', 'risk'),
    },
    hidden_owner: {
      label: 'No hidden owner address',
      badge: calcBadge('hidden_owner', '1', 'warning'),
    },
    external_call: {
      label: 'No external call risk',
      badge: calcBadge('external_call', '1', 'warning'),
    },
    selfdestruct: {
      label: 'This token cannot self-destruct',
      badge: calcBadge('selfdestruct', '1', 'risk'),
    },
    gas_abuse: {
      label: 'This token is not a gas abuser',
      badge: calcBadge('gas_abuse', '1', 'risk'),
    },
    buy_tax: {
      label: 'Buy tax',
      badge: detail.buy_tax
        ? 100 * +(detail.buy_tax ?? 0) >= 10 &&
          100 * +(detail.buy_tax ?? 0) < 50
          ? 'warning'
          : 100 * +(detail.buy_tax ?? 0) >= 50
          ? 'risk'
          : 'trusted'
        : 'warning',
      info: 'More than 10% is considered a high tax rate, and anything beyond 50% tax rate means it may not be tradable.',
    },
    sell_tax: {
      label: 'Sell tax',
      badge: detail.sell_tax
        ? 100 * +(detail.sell_tax ?? 0) >= 10 &&
          100 * +(detail.sell_tax ?? 0) < 50
          ? 'warning'
          : 100 * +(detail.sell_tax ?? 0) >= 50
          ? 'risk'
          : 'trusted'
        : 'warning',
      info: 'More than 10% is considered a high tax rate, and anything beyond 50% tax rate means it may not be tradable.',
    },
    is_honeypot: {
      label: 'This token does not appear to be a honeypot',
      badge: calcBadge('is_honeypot', '1', 'risk'),
    },
    transfer_pausable: {
      label: 'Contains no code for suspending trading',
      badge: calcBadge('transfer_pausable', '1', 'warning'),
    },
    trading_cooldown: {
      label: 'No cooldown period function',
      badge: calcBadge('trading_cooldown', '1', 'warning'),
    },
    is_anti_whale: {
      label: 'No anti-whale function',
      badge: calcBadge('is_anti_whale', '1', 'warning'),
    },
    anti_whale_modifiable: {
      label: 'Anti-whale modifiable function found',
      badge: calcBadge('anti_whale_modifiable', '1', 'warning'),
    },
    cannot_buy: {
      label: 'This token can be bought',
      badge: calcBadge('cannot_buy', '1', 'warning'),
    },
    cannot_sell_all: {
      label: 'Holders can sell all of their tokens',
      badge: calcBadge('cannot_sell_all', '1', 'warning'),
    },
    slippage_modifiable: {
      label: 'Transaction tax cannot be modified',
      badge: calcBadge('slippage_modifiable', '1', 'warning'),
    },
    is_blacklisted: {
      label: 'No blacklist function',
      badge: calcBadge('is_blacklisted', '1', 'warning'),
    },
    is_whitelisted: {
      label: 'No whitelist function',
      badge: calcBadge('is_whitelisted', '1', 'warning'),
    },
    personal_slippage_modifiable: {
      label: 'Taxes cannot be modified for assigned addresses',
      badge: calcBadge('personal_slippage_modifiable', '1', 'warning'),
    },
  };
};
