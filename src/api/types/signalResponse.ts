export interface RawPosition {
  status: 'OPENING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'CANCELLED';
  position_side: 'LONG' | 'SHORT';
  entry_time?: string | null;
  entry_price?: number | null;
  exit_time?: string | null;
  exit_price?: number | null;
  pnl?: number | null;
}
