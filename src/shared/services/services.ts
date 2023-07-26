import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "config/reactQuery";
import { InvestorAssetStructures } from "pages/productsCatalog/types/investorAssetStructure";
import { UserInfoResponse } from "./UserInfoResponse";

export const useUserInfoQuery = () =>
  useQuery<UserInfoResponse>(["user"], async () => {
    const { data } = await axios.get("/account/investors/me");
    return data;
  });

export const useInvestorAssetStructuresQuery = () =>
  useQuery<InvestorAssetStructures>(
    ["ias"],
    async () => {
      const { data } = await axios.get<InvestorAssetStructures>("/ias/investor-asset-structures");
      data[0]?.asset_bindings.forEach((ab) => {
        ab.name = ab.asset.type === "SYMBOL" ? ab.asset.symbol.name : ab.asset.pair.base.name;
      });
      data[0]?.financial_product_instances.forEach((fpi) => {
        fpi.asset_bindings.forEach((ab) => {
          ab.name = ab.asset.type === "SYMBOL" ? ab.asset.symbol.name : ab.asset.pair.base.name;
        });
      });
      return data;
    },
    {
      staleTime: Infinity,
      refetchInterval: (data?: InvestorAssetStructures) =>
        data?.[0] && data?.[0].financial_product_instances.length > 0 ? 3000 : false,
    }
  );

export const useUpdateFPIStatusMutation = () =>
  useMutation<unknown, unknown, { fpiKey: string; status: "stop" | "start" | "pause" | "resume" }>(
    (data) => axios.post(`ias/financial-product-instances/${data.fpiKey}/${data.status}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["ias"]),
    }
  );
