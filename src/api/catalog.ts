import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  type InvestmentProtocol,
  type FinancialProduct,
  type FinancialProductsResponse,
} from 'api/types/financialProduct';
import { API_ORIGIN } from 'config/constants';

export const useFinancialProductsQuery = () =>
  useQuery(
    ['fps'],
    async () => {
      const { data } = await axios.get<FinancialProductsResponse>(
        '/catalog/financial-products',
      );
      return data.results.sort(
        (a, b) =>
          (a.config.weight ?? 1e5) - (b.config.weight ?? 1e5) ||
          (a.config.subscription_level ?? 0) -
            (b.config.subscription_level ?? 0) ||
          a.title.localeCompare(b.title),
      );
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );

export const useInvestmentProtocolsQuery = () =>
  useQuery(
    ['ipq'],
    async () => {
      const { data } = await axios.get<{ protocols: InvestmentProtocol[] }>(
        `${API_ORIGIN}/api/v0/delphi/protocol/`,
      );
      return data.protocols;
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );

export const useFinancialProductQuery = (fpKey: string) =>
  useQuery<FinancialProduct>(
    ['fp', fpKey],
    async () => {
      const { data } = await axios.get(`/catalog/financial-products/${fpKey}`);
      return data;
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );
