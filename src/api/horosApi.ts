import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { DB } from "../config/keys";
import { UserInfo } from "./types/userInfo";
import { GetSignalsQueryData } from "./types/signal";
import { State } from "./types/state";
import {
  SimulateTradeData,
  SimulateTradeQueryVariables,
} from "./backtest-types";

import { setIAS } from "store/slices/IAS";
import { API_list_response, KYC_Level } from "types/kyc";
import { NetworksResponse } from "./types/transferNetworks";
import {
  FinancialProduct,
  FinancialProductsReponse,
} from "containers/catalog/types/financialProduct";
import { InvestorAssetStructureResponse } from "containers/catalog/types/investorAssetStructure";

const horosBaseQuery = fetchBaseQuery({
  baseUrl: DB,
  prepareHeaders: (headers, api) => {
    const authToken = (api.getState() as State).user?.jwtToken;
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    return headers;
  },
});

const horosApiBaseQueryRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await horosBaseQuery(args, api, extraOptions);
  // const error: any = result.error;
  // if (error && (error?.status === 401 || error.status === 403)) {

  //   // refresh token and refetch query
  //   localStorage.removeItem(WISDOMISE_TOKEN_KEY);
  //   window.location.replace(`${DB}/api/v1/account/login`);
  // }
  return result;
};

export const horosApi = createApi({
  reducerPath: "horosApi",
  baseQuery: horosApiBaseQueryRefreshToken,
  keepUnusedDataFor: 0,
  tagTypes: ["userInfo"],
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfo, unknown>({
      query: () => "/api/v1/account/investors/me",
      providesTags: ["userInfo"],
    }),
    getHourlySignals: builder.query<GetSignalsQueryData, any>({
      query: (params) => ({
        url: "/api/v1/decision/positions",
        params,
      }),
    }),

    simulateTrade: builder.query<
      SimulateTradeData,
      SimulateTradeQueryVariables
    >({
      query: (params) => ({
        url: "/api/v1/decision/backtest",
        params,
      }),
    }),

    createFPI: builder.mutation({
      query: (body) => ({
        body,
        method: "POST",
        url: "/api/v1/ias/financial-product-instances",
      }),
    }),

    updateDepositAddress: builder.mutation({
      query: (exchangeAccountKey) => {
        return {
          url: `/api/v1/market/exchange-accounts/${exchangeAccountKey}`,
          method: "PATCH",
        };
      },
    }),

    getDepositAddress: builder.query<any, any>({
      query: (exchangeAccountKey) => {
        return {
          url: `/api/v1/market/exchange-accounts/${exchangeAccountKey}/deposit-addresses`,
        };
      },
    }),

    refreshExchangeAccount: builder.mutation<any, any>({
      query: (exchangeAccountKey) => {
        return {
          url: `/api/v1/market/exchange-accounts/${exchangeAccountKey}`,
          method: "PATCH",
        };
      },
    }),

    setWaitingList: builder.mutation<any, any>({
      query: (body) => {
        return {
          url: "/api/v1/trader/investor-asset-structures",
          method: "POST",
          body: {
            ...body,
          },
        };
      },
    }),

    getInvestorAssetStructure: builder.query<
      InvestorAssetStructureResponse,
      unknown
    >({
      query: () => ({
        url: "/api/v1/ias/investor-asset-structures",
      }),
      async onQueryStarted(_, api) {
        const { data } = await api.queryFulfilled;
        api.dispatch(setIAS({ ...data }));
      },
    }),

    getFinancialProducts: builder.query<FinancialProductsReponse, any>({
      query: (params) => ({
        url: "/api/v1/catalog/financial-products",
        params,
      }),
    }),

    getFinancialProductDetail: builder.query<FinancialProduct, any>({
      query: (params) => ({
        url: `/api/v1/catalog/financial-products/${params.id}`,
      }),
    }),

    getExchangeList: builder.query<any, any>({
      query: () => ({
        url: `/api/v1/market/exchanges`,
      }),
    }),

    getTransactionHistory: builder.query<any, any>({
      query: (exchangeAccountKey) => ({
        url: `/api/v1/market/exchange-accounts/${exchangeAccountKey}/transaction-history`,
      }),
    }),

    getETFBacktest: builder.query<any, any>({
      query: (data) => {
        return {
          url: `/api/v1/catalog/etf-packages/${data.id}/backtest`,
          params: data.params,
        };
      },
    }),

    getExchangeAccountHistoricalStatistic: builder.query<any, any>({
      query: (iasKey) => {
        return {
          url: `/api/v1/ias/investor-asset-structures/${iasKey}/historical-statistics?resolution=1d`,
        };
      },
    }),

    updateIASStatus: builder.mutation({
      query: (params) => {
        return {
          url: `/api/v1/ias/financial-product-instances/${params.key}/${params.status}`,
          method: "POST",
        };
      },
      transformErrorResponse(response) {
        const responseClone = { ...response };
        delete (responseClone?.data as any)?.data;

        return responseClone;
      },
    }),
    getKycLevels: builder.query<API_list_response<KYC_Level>, any>({
      query: () => ({
        url: "/api/v1/account/kyc-levels",
      }),
    }),
    getKycAccessToken: builder.query<any, any>({
      query: (data) => ({
        url: "/api/v1/account/sumsub-access-token?level_name=" + data.level,
      }),
    }),

    getDepositSymbol: builder.query<any, any>({
      query: () => ({
        url: "/api/v1/market/symbols?depositable=true",
      }),
    }),

    getDepositNetwork: builder.query<NetworksResponse, any>({
      query: (symbol) => ({
        url: `/api/v1/market/symbols/${symbol}/networks?depositable=true`,
      }),
    }),

    getDepositWalletAddress: builder.query<any, any>({
      query: (params) => ({
        url: `/api/v1/market/exchange-accounts/${params.exchangeAccountKey}/deposit-addresses?symbol_name=${params.symbol}&network_name=${params.network}`,
      }),
    }),

    getWithdrawSymbol: builder.query<any, any>({
      query: () => ({
        url: "/api/v1/market/symbols?withdrawable=true",
      }),
    }),

    getWithdrawNetwork: builder.query<NetworksResponse, any>({
      query: ({ symbol, exchangeAccountKey }) => ({
        url: `/api/v1/market/symbols/${symbol}/networks?withdrawable=true&exchange_account_key=${exchangeAccountKey}`,
      }),
    }),

    createWithdraw: builder.mutation({
      query: (body: any) => {
        return {
          url: `/api/v1/market/exchange-accounts/${body.exchangeAccountKey}/transactions`,
          method: "POST",
          body: {
            ...body,
          },
        };
      },
    }),

    confirmWithdraw: builder.mutation({
      query: (params: any) => {
        return {
          url: `/api/v1/market/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}?verification_code=${params.verificationCode}`,
          method: "PATCH",
        };
      },
    }),

    resendEmailWithdraw: builder.mutation({
      query: (params: any) => {
        return {
          url: `/api/v1/market/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}/verification-email`,
          method: "POST",
        };
      },
    }),

    getReferralLevels: builder.query<any, any>({
      query: () => ({
        url: `/api/v1/engagement/referral-levels`,
      }),
    }),

    updateReferrer: builder.mutation({
      query: (referral_code) => {
        return {
          url: `/api/v1/account/customers/me?referral_code=${referral_code}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["userInfo"],
    }),
    agreeToTerms: builder.mutation({
      query: (data) => ({
        url: `/api/v1/account/customers/me`,
        method: "PATCH",
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: `/api/v1/account/customers/me/verification-email`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetHourlySignalsQuery,
  useLazySimulateTradeQuery,
  useGetFinancialProductsQuery,
  useGetFinancialProductDetailQuery,
  useGetInvestorAssetStructureQuery,
  useGetExchangeListQuery,
  useGetETFBacktestQuery,
  useCreateFPIMutation,
  useUpdateDepositAddressMutation,
  useLazyGetExchangeAccountHistoricalStatisticQuery,
  useLazyGetTransactionHistoryQuery,
  useGetDepositAddressQuery,
  useUpdateIASStatusMutation,
  useRefreshExchangeAccountMutation,
  useSetWaitingListMutation,
  useGetDepositSymbolQuery,
  useLazyGetDepositNetworkQuery,
  useLazyGetDepositWalletAddressQuery,

  //withdraw
  useGetWithdrawSymbolQuery,
  useLazyGetWithdrawNetworkQuery,
  useCreateWithdrawMutation,
  useConfirmWithdrawMutation,
  useResendEmailWithdrawMutation,
  // KYC
  useGetKycAccessTokenQuery,
  useGetKycLevelsQuery,
  // referral
  useGetReferralLevelsQuery,
  useUpdateReferrerMutation,
  // secondary form
  useAgreeToTermsMutation,
  //email verification
  useResendVerificationEmailMutation,
} = horosApi;
