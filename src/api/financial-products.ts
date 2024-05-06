import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type BackTestBenchmark } from './ias/backtest';

export const useFPBacktestQuery = (fpKey: string) =>
  useQuery(['fpb', fpKey, 'backtest'], async () => {
    const { data } = await axios.get<BackTestBenchmark>(
      `/catalog/financial-products/${fpKey}/backtest`,
    );
    return data;
  });

export const useJoinWaitList = () =>
  useMutation({
    async mutationFn() {
      const { data } = await axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-attribute/join-waitlist`,
      );
      return data;
    },
  });
