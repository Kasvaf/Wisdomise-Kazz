import dayjs from 'dayjs';
import {
  type MarkLineOption,
  type MarkAreaOption,
  type MarkPointOption,
} from 'echarts/types/dist/shared';
import { bxsDownArrow } from 'boxicons-quasar';
import { type Candle, type Resolution } from 'api';

export interface ChartPosition {
  actual_position: ActualPosition;
  strategy_position?: Position | null;
}

interface Position {
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
}

interface ActualPosition extends Position {
  position_side: 'LONG' | 'SHORT';
  pnl: number;
}

const formatter = 'YYYY-MM-DD HH:mm';
const durs: Record<Resolution, number> = {
  '1m': 1000 * 60,
  '3m': 1000 * 60 * 3,
  '5m': 1000 * 60 * 5,
  '15m': 1000 * 60 * 15,
  '30m': 1000 * 60 * 30,
  '1h': 1000 * 60 * 60,
};

export function bestResolution(rng?: [Date, Date]): Resolution {
  if (!rng) return '1h';

  const rss: Resolution[] = ['5m', '15m', '30m', '1h'];
  const diff = +rng[1] - +rng[0];
  for (const d of rss) {
    if (diff / durs[d] < 2500) {
      return d;
    }
  }
  return '1h';
}

export const roundDate = (
  dateString: string | Date,
  resolution: Resolution,
) => {
  const dateMs = +new Date(dateString);
  const dur = durs[resolution];
  const roundedDate = new Date(Math.round(dateMs / dur) * dur);
  return dayjs(roundedDate).utc().format(formatter);
};

export function parseCandles(candles: Candle[], resolution: Resolution) {
  const categoryData = [];
  const values = [];
  for (const candle of candles) {
    categoryData.unshift(roundDate(candle.related_at, resolution));
    values.unshift([candle.open, candle.close, candle.low, candle.high]);
  }
  return {
    categoryData,
    values,
  };
}

export function parsePositions(
  positions: ChartPosition[],
  resolution: Resolution,
  lastCandle?: string,
) {
  const roundedPositions = positions.map(
    ({ actual_position: ap, strategy_position: sp }) =>
      ({
        actual_position: {
          ...ap,
          entry_time: roundDate(ap.entry_time + 'Z', resolution),
          exit_time: ap.exit_time && roundDate(ap.exit_time + 'Z', resolution),
        },
        strategy_position: sp && {
          ...sp,
          entry_time: roundDate(sp.entry_time + 'Z', resolution),
          exit_time: sp.exit_time && roundDate(sp.exit_time + 'Z', resolution),
        },
      }) satisfies ChartPosition,
  );

  const brushes = roundedPositions.map(({ actual_position: ap }) => ({
    brushType: 'lineX',
    coordRange: [ap.entry_time, ap.exit_time || lastCandle],
    xAxisIndex: 0,
  }));

  const cleanRoundedPositions = roundedPositions.filter(
    ({ actual_position: ap }) =>
      ap.exit_price !== undefined &&
      ap.exit_time !== undefined &&
      ap.entry_time !== ap.exit_time,
  ) as Array<{
    actual_position: Required<ChartPosition['actual_position']>;
    strategy_position: Required<ChartPosition['strategy_position']>;
  }>;

  // make areas data
  const areas = cleanRoundedPositions.map(
    ({ actual_position: ap }) =>
      [
        {
          xAxis: ap.entry_time,
          yAxis: ap.entry_price,
          itemStyle: {
            color: ap.pnl >= 0 ? '#00ff00' : '#ff0000',
          },
          value: 'text',
        },
        {
          xAxis: ap.exit_time,
          yAxis: ap.exit_price,
        },
      ] satisfies NonNullable<MarkAreaOption['data']>[number],
  );

  // make lines data
  const lines = cleanRoundedPositions.map(
    ({ actual_position: ap }) =>
      [
        {
          coord: [ap.entry_time, ap.entry_price],
          lineStyle: { color: '#fff' },
          value: ap.pnl,
        },
        {
          coord: [ap.exit_time, ap.exit_price],
        },
      ] satisfies NonNullable<MarkLineOption['data']>[number],
  );

  const points = roundedPositions.flatMap(
    ({ actual_position: ap, strategy_position: sp }) => {
      const dir = ap.position_side === 'LONG' ? 1 : -1;
      const markers: NonNullable<MarkPointOption['data']> = [];
      markers.push(marker([ap.entry_time, ap.entry_price], dir, '#11C37E'));
      if (ap.exit_time && ap.exit_price) {
        markers.push(
          marker([ap.exit_time, ap.exit_price], -1 * dir, '#F14056'),
        );
      }

      if (sp) {
        if (sp.entry_time !== ap.entry_time) {
          markers.push(marker([sp.entry_time, sp.entry_price], dir, '#fff'));
        }
        if (sp.exit_time && sp.exit_price && sp.exit_time !== ap.exit_time) {
          markers.push(marker([sp.exit_time, sp.exit_price], -1 * dir, '#fff'));
        }
      }

      return markers;
    },
  );

  return { brushes, areas, lines, points };
}

function marker(coord: [string, number], dir: number, color: string) {
  return {
    name: 'Mark',
    coord,
    value: coord[1],
    symbolSize: 15,
    symbol: 'path://' + bxsDownArrow,
    symbolRotate: dir > 0 ? 180 : 0,
    symbolOffset: [0, dir * 10],
    label: {
      offset: [0, dir * 15],
      color: '#ffffff',
    },
    itemStyle: {
      color,
    },
  };
}
