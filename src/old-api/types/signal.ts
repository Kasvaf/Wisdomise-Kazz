import { type TickerSymbol } from './common';

type PositionType = 'OPEN' | 'CLOSE' | 'WEAK';

export interface Signal {
  last_stop_loss: string;
  updated_at: number;
  enter_price: number;
  first_stop_loss: number;
  pair: TickerSymbol;
  created_at: number;
  side: 'LONG' | 'SHORT';
  intensity: number;
  executed: boolean;
  key: string;
  status: PositionType;
  position_value: number;
  profit_and_loss: number;
  reason_to_close: string;
  exited_at: number;
  exit_price: number;
}
