import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';
import { getJwtToken } from 'modules/auth/jwt-store';
import { isLocal, isProduction } from 'utils/version';
import { type SignalsResponse } from './types/signalResponse';

const USER_SIGNALS_REST =
  ACCOUNT_PANEL_ORIGIN + '/api/v1/notification/user-signals';

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<SignalsResponse>(
      `${TEMPLE_ORIGIN}/api/v1/strategy/last-positions`,
    );
    data.last_positions.sort((a, b) => b.pnl - a.pnl);
    for (const p of data.last_positions) {
      p.subscription_level =
        data.strategies.find(s => p.strategy_name === s.name)?.profile
          .subscription_level ?? 0;
    }
    data.last_positions.sort(
      (a, b) => a.subscription_level - b.subscription_level,
    );
    return data;
  });

export const useSubscribedSignalsQuery = () =>
  useQuery(
    ['subscribedSignals'],
    async () => {
      const { data } = await axios.get(ACCOUNT_PANEL_ORIGIN);
      return data.results as Array<{
        pair_name: string;
        strategy_name: string;
        key: string;
      }>;
    },
    { enabled: !!getJwtToken() },
  );

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
