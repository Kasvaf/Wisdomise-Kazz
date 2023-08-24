import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { isProduction } from 'utils/version';
import { convertDate } from 'utils/dates';
import { type BackTestBenchmark } from './ias/backtest';

export const useFPBacktestQuery = (fpKey: string) =>
  useQuery(['fpb', fpKey, 'backtest'], async () => {
    const { data } = await axios.get<BackTestBenchmark>(
      `https://${
        isProduction ? '' : 'stage-'
      }strategy.wisdomise.io/api/v1/financial-products/${fpKey}/backtest`,
      {
        params: {
          id: fpKey,
          params: {
            start_date: convertDate(
              new Date(import.meta.env.VITE_BACKTEST_START_DATE),
            ),
            end_date: convertDate(),
          },
        },
      },
    );
    return data;
  });
