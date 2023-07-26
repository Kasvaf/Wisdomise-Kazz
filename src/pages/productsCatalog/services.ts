import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "config/reactQuery";
import { convertDate } from "utils/utils";
import { FinancialProduct, FinancialProductsReponse } from "./types/financialProduct";

export const useFinancialProductsQuery = () =>
  useQuery<FinancialProductsReponse>(
    ["fps"],
    async () => {
      const { data } = await axios.get("/catalog/financial-products");
      return data;
    },
    { staleTime: Infinity }
  );

export const useFinancialProductQuery = (fpKey: string) =>
  useQuery<FinancialProduct>(
    ["fp", fpKey],
    async () => {
      const { data } = await axios.get(`/catalog/financial-products/${fpKey}`);
      return data;
    },
    { staleTime: Infinity }
  );

export const useCreateFPIMutation = () =>
  useMutation<{ key: string }, unknown, string>(
    async (fpKey) => {
      const { data } = await axios.post("/ias/financial-product-instances", {
        financial_product: {
          key: fpKey,
        },
      });
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["ias"]),
    }
  );

export const useFPBacktestQuery = (fpKey: string) =>
  useQuery(["fp", fpKey, "backtest"], async () => {
    const { data } = await axios.get(
      `https://stage-strategy.wisdomise.io/api/v1/financial-products/${fpKey}/backtest`,
      {
        params: {
          id: fpKey,
          params: {
            start_date: convertDate(new Date(import.meta.env.VITE_BACKTEST_START_DATE)),
            end_date: convertDate(),
          },
        },
      }
    );
    return data;
  });
