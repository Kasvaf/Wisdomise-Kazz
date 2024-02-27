import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface MyFinancialProduct {
  key: string;
  is_active: boolean;
  title: string;
  description: string;
  risk_level: RiskLevel;
  expected_drawdown: string;
  expected_apy: string;
  symbols: string[];
  assets: Array<{
    strategy: string;
    share: number;
    asset: {
      name: string;
      display_name: string;
      symbol: string;
    };
  }>;
}

export const useMyFinancialProductsQuery = () =>
  useQuery(
    ['my-products'],
    async () => {
      const { data } = await axios.get<MyFinancialProduct[]>(
        '/factory/financial-products',
      );
      return data.map(s => ({
        ...s,
        assets: s.assets.map((a: any) => ({
          strategy: a.strategy,
          share: a.share,
          asset: {
            name: a.asset.symbol?.name,
            display_name: a.asset.symbol?.title || a.asset.pair?.title,
            base: a.asset.symbol,
            quote: { name: 'USDT' },
            ...a.asset.pair,
          },
        })),
      })) as MyFinancialProduct[];
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useCreateMyFinancialProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { key: string },
    unknown,
    {
      title: string;
      description: string;
      risk_level: RiskLevel;
      expected_drawdown: string;
      expected_apy: string;
    }
  >(
    async body => {
      const { data } = await axios.post<{ key: string }>(
        '/factory/financial-products',
        {
          is_active: true,
          ...body,
        },
      );
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['my-products']);
      },
    },
  );
};

export const useMyFinancialProductQuery = (fpKey?: string) =>
  useQuery(
    ['my-product', fpKey],
    async () => {
      if (!fpKey) throw new Error('unexpected');
      const { data } = await axios.get<MyFinancialProduct>(
        `factory/financial-products/${fpKey}`,
      );
      return data;
    },
    {
      enabled: !!fpKey,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useUpdateMyFinancialProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { key: string },
    unknown,
    {
      fpKey: string;
      title: string;
      description: string;
      risk_level: RiskLevel;
      expected_drawdown: string;
      expected_apy: string;
      assets: Array<{
        strategy: string;
        share: number;
        asset: {
          name: string;
        };
      }>;
    }
  >(async body => {
    const { data } = await axios.put<{ key: string }>(
      '/factory/financial-products/' + body.fpKey,
      {
        is_active: true,
        ...body,
      },
    );
    await queryClient.invalidateQueries(['my-products', body.fpKey]);
    return data;
  });
};

export const useMyFinancialProductUsageQuery = (fpKey?: string) =>
  useQuery(
    ['my-product', fpKey],
    async () => {
      if (!fpKey) throw new Error('unexpected');
      const { data } = await axios.get<{
        subscribers: number;
        aum: number;
        trading_volume: number;
      }>(`factory/financial-products/${fpKey}/usage-stats`);
      return data;
    },
    {
      enabled: !!fpKey,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useMyFinancialProductPerfQuery = ({
  fpKey,
  startTime,
  endTime,
}: {
  fpKey?: string;
  startTime?: string;
  endTime?: string;
}) =>
  useQuery(
    ['productPerf', fpKey, startTime, endTime],
    async () => {
      if (!fpKey) throw new Error('unexpected');
      const { data } = await axios.get<{
        positions: number;
        pnl: number;
        max_drawdown: number;
        equities: Array<{
          d: string;
          v: number;
        }>;
      }>(`/factory/financial-products/${fpKey}/performance`, {
        params: {
          start_time: startTime,
          end_time: endTime,
        },
      });
      return data;
    },
    {
      enabled: !!fpKey && !!startTime && !!endTime,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
