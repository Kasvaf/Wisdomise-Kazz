import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';
import { isLocal, isProduction } from 'utils/version';

const USER_SIGNALS_REST =
  ACCOUNT_PANEL_ORIGIN + '/api/v1/notification/user-signals';

export const useSubscribedSignalsQuery = () =>
  useQuery(['subscribedSignals'], async () => {
    const { data } = await axios.get(USER_SIGNALS_REST);
    return data.results as Array<{
      pair_name: string;
      strategy_name: string;
      key: string;
    }>;
  });

export const useSubscribeToSignalMutation = () =>
  useMutation<unknown, unknown, { pairName: string; strategyName: string }>({
    mutationFn: async ({ pairName, strategyName }) => {
      await axios.post(USER_SIGNALS_REST, {
        pair_name: pairName,
        strategy_name: strategyName,
      });
    },
  });

export const useUnsubscribeToSignalMutation = () =>
  useMutation<unknown, unknown, { key: string }>({
    mutationFn: async ({ key }) => {
      await axios.delete(USER_SIGNALS_REST + '/' + key);
    },
  });

export const useFPBacktestQuery = () =>
  useQuery(['fpb', 'backtest'], async () => {
    const { data } = await axios.get(
      `${TEMPLE_ORIGIN}/api/v1/catalog/financial-products/${
        isLocal || !isProduction
          ? 'dc75131a-6e24-4058-80b4-8343371651a8'
          : '32bbe158-5de4-4bf8-bee5-cd9d7b2393aa'
      }/backtest`,
    );
    const benchmark = data.etf_benchmark as Array<{ d: string; v: number }>;
    return benchmark.map(item => ({
      date: item.d,
      value: +(((item.v - benchmark[0].v) / benchmark[0].v) * 100).toFixed(2),
    }));
  });
