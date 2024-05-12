import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  type InvestmentProtocol,
  type FinancialProduct,
  type FinancialProductsResponse,
} from 'api/types/financialProduct';
import { TEMPLE_ORIGIN } from 'config/constants';

export const useFinancialProductsQuery = ({
  type = 'ALL',
  page,
}: {
  type?: 'WISDOMISE' | 'MINE' | 'ALL';
  page?: number;
}) =>
  useQuery({
    queryKey: ['fp-catalog', type, page],
    queryFn: async () => {
      const allProducts = [];
      let count = 1;

      if (page === undefined) {
        for (let page = 1; page <= Math.ceil(count / 10); ++page) {
          const url = `/catalog/financial-products?type=${type}&page=${page}`;
          const { data } = await axios.get<FinancialProductsResponse>(url);
          allProducts.push(...data.results);
          count = data.count;
        }
      } else {
        const url = `/catalog/financial-products?type=${type}&page=${page}`;
        const { data } = await axios.get<FinancialProductsResponse>(url);
        allProducts.push(...data.results);
        count = data.count;
      }

      const products = allProducts.sort(
        (a, b) =>
          (a.config.weight ?? 1e5) - (b.config.weight ?? 1e5) ||
          (a.config.subscription_level ?? 0) -
            (b.config.subscription_level ?? 0) ||
          a.title.localeCompare(b.title),
      );
      return { products, count };
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useInvestmentProtocolsQuery = () =>
  useQuery(
    ['ipq'],
    async () => {
      const { data } = await axios.get<{ protocols: InvestmentProtocol[] }>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/protocols/`,
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
