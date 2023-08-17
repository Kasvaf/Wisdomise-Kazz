import { G2, type LineConfig } from '@ant-design/plots';
import { deepMix } from '@antv/util';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import * as numerable from 'numerable';
import { useMemo } from 'react';
import { type PointData, type WealthData } from 'old-api/backtest-types';

export const useProvideAatChartDataConfig = (
  aatData: WealthData[] | undefined,
  coinData: PointData[] | undefined,
  options: {
    coin: string;
    is_daily_basis: boolean;
  },
): LineConfig => {
  const { coin } = options;
  return useMemo<LineConfig>(() => {
    if (
      aatData != null &&
      coinData != null &&
      !isEmpty(aatData) &&
      !isEmpty(coinData)
    ) {
      const sortedAATData = sortBy(
        aatData.map(d => processAatData(d, 'Wisdomise (AAT)')),
        'date',
      );

      const sortedCoinData = sortBy(
        coinData.map(d => processCoinData(d, `${coin} HOLD`)),
        'date',
      ).filter(item =>
        sortedAATData.find(_item => _item.timestamp === item.timestamp),
      );

      const coinBasePrice = +Number(sortedCoinData[0].point);
      const addValueCoinData = sortedCoinData.map(d => ({
        ...d,
        value: +Number((d.point * 100) / coinBasePrice - 100).toFixed(2),
      }));

      return updateAatChartConfig([...sortedAATData, ...addValueCoinData]);
    }

    return updateAatChartConfig([]);
    // no need for is_daily_basis
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin, aatData, coinData]);
};

const processAatData = (data: WealthData, category: string) => ({
  ...data,
  category,
  value: +Number(data.wealth / 10 - 100).toFixed(2),
  timestamp: dayjs(data.date).format('YYYY-MM-DD HH'),
});

const processCoinData = (data: PointData, category: string) => ({
  ...data,
  category,
  timestamp: dayjs(data.date).format('YYYY-MM-DD HH'),
  date: new Date(data.date).getTime(),
});

const updateAatChartConfig = (data: Array<{ value: number }>): LineConfig => ({
  data,
  xField: 'timestamp',
  yField: 'value',
  width: 1280,
  seriesField: 'category',
  color: ['#00FAAC', '#FF449F'],
  xAxis: {
    tickCount: 8,
    label: {
      style: {
        fill: 'rgba(255,255,255, 0.6)',
      },
      formatter: v => v.split(' ')[0],
    },
  },
  yAxis: {
    label: {
      style: {
        fill: 'rgba(255,255,255, 0.6)',
      },
      formatter: v => (v === '0' ? '0%' : numerable.format(v, '0.0%')),
    },
    // minLimit: data.length ? minBy(data, 'value')!.value : 0,
  },
  theme: deepMix({}, G2.getTheme('dark'), {
    background: '#051D32',
  }),
  tooltip: {
    title: v => dayjs(v, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH:mm'),
    formatter: datum => ({ name: datum.category, value: `${datum.value}%` }),
    domStyles: {
      'g2-tooltip': {
        backgroundColor: '#03101C',
        color: '#fff',
      },
    },
  },
});
