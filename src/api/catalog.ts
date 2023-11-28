import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  type InvestmentProtocol,
  type FinancialProduct,
  type FinancialProductsResponse,
} from 'api/types/financialProduct';
import { API_ORIGIN } from 'config/constants';

export const useFinancialProductsQuery = () =>
  useQuery<FinancialProductsResponse>(
    ['fps'],
    async () => {
      const { data } = await axios.get('/catalog/financial-products');
      return data;
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
