import { type ThinStrategy } from 'api/signaler';

export interface SignalsResponse {
  last_positions: LastPosition[];
}

export type SuggestedAction =
  | 'OPEN'
  | 'CLOSE'
  | 'NO_ACTION'
  | 'OPEN_DELAYED'
  | 'CLOSE_DELAYED';

export interface RawPosition {
  status: 'OPENING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'CANCELLED';
  position_side: 'LONG' | 'SHORT';
  entry_time?: string | null;
  entry_price?: number | null;
  exit_time?: string | null;
  exit_price?: number | null;
  pnl: number | null;
}

export interface LastPosition extends RawPosition {
  strategy: ThinStrategy;
  leverage: number;

  strategy_name: string; // removed
  pair_name: string;

  take_profit?: number | null;
  stop_loss?: number | null;

  suggested_action: SuggestedAction;
}
