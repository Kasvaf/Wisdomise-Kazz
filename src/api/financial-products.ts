import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { isProduction } from 'utils/version';
import { convertDate } from 'utils/dates';

export const useFPBacktestQuery = (fpKey: string) =>
  useQuery(['fp', fpKey, 'backtest'], async () => {
    const { data } = await axios.get(
      `https://${
        !isProduction ? 'stage-' : ''
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
