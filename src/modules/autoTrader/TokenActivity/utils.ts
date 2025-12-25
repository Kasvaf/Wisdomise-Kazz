export function calcHold(balance?: number, price?: number) {
  return (balance ?? 0) * (price ?? 0);
}

export function calcPnl(
  bought?: number,
  sold?: number,
  balance?: number,
  price?: number,
) {
  const hold = calcHold(balance, price);
  return (sold ?? 0) + hold - (bought ?? 0);
}

export function calcPnlPercent(bought?: number, pnl?: number) {
  return !bought ? 0 : ((pnl ?? 0) / bought) * 100;
}
