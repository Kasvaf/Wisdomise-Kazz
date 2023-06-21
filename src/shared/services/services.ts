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
      const { data } = await axios.get("/ias/investor-asset-structures");
      return data;
    },
    {
      staleTime: Infinity,
    }
  );

export const useUpdateFPIStatusMutation = () =>
  useMutation<
    unknown,
    unknown,
    { fpiKey: string; status: "stop" | "start" | "pause" | "resume" }
  >(
    (data) =>
      axios.post(
        `ias/financial-product-instances/${data.fpiKey}/${data.status}`
      ),
    {
      onSuccess: () => queryClient.invalidateQueries(["ias"]),
    }
  );
