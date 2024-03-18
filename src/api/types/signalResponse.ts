import { type ThinStrategy, type StrategyItem } from 'api/signaler';
import { type PairData } from './strategy';

export interface SignalsResponse {
  pairs: Pair[];
  strategies: StrategyItem[];
  last_positions: LastPosition[];
}

interface Pair extends PairData {
  time_window_pnl: number;
  time_window_prices: number[];
}

export type SuggestedAction =
  | 'OPEN'
  | 'CLOSE'
  | 'NO_ACTION'
  | 'OPEN_DELAYED'
  | 'CLOSE_DELAYED';

export interface RawPosition {
  position_side: 'LONG' | 'SHORT';
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
  pnl: number;
}

export interface LastPosition extends RawPosition {
  strategy: ThinStrategy;
  leverage: number;

  strategy_name: string; // removed
  pair_name: string;

  take_profit?: number;
  stop_loss: number;

  suggested_action: SuggestedAction;
}
