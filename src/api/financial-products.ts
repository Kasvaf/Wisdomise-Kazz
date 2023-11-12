import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type BackTestBenchmark } from './ias/backtest';

export const useFPBacktestQuery = (fpKey: string) =>
  useQuery(['fpb', fpKey, 'backtest'], async () => {
    const { data } = await axios.get<BackTestBenchmark>(
      `/catalog/financial-products/${fpKey}/backtest`,
    );
    return data;
  });
