import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  type FinancialProduct,
  type FinancialProductsReponse,
} from 'api/types/financialProduct';

export const useFinancialProductsQuery = () =>
  useQuery<FinancialProductsReponse>(
    ['fps'],
    async () => {
      const { data } = await axios.get('/catalog/financial-products');
      return data;
    },
    { staleTime: Infinity },
  );

export const useFinancialProductQuery = (fpKey: string) =>
  useQuery<FinancialProduct>(
    ['fp', fpKey],
    async () => {
      const { data } = await axios.get(`/catalog/financial-products/${fpKey}`);
      return data;
    },
    { staleTime: Infinity },
  );
