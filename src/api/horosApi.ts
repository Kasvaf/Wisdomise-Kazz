import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { DB } from "../config/keys";
import { SimulateTradeData, SimulateTradeQueryVariables } from "./backtest-types";
import { GetSignalsQueryData } from "./types/signal";
import { State } from "./types/state";

import { isLocal, isStage } from "utils/utils";
import { NetworksResponse } from "./types/transferNetworks";

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

const horosApiBaseQueryRefreshToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await horosBaseQuery(args, api, extraOptions);
  return result;
};

export const horosApi = createApi({
  reducerPath: "horosApi",
  baseQuery: horosApiBaseQueryRefreshToken,
  keepUnusedDataFor: 0,
  tagTypes: ["userInfo"],
  endpoints: (builder) => ({
    getHourlySignals: builder.query<GetSignalsQueryData, any>({
      query: (params) => ({
        url: "/api/v1/decision/positions",
        params,
      }),
    }),

    simulateTrade: builder.query<SimulateTradeData, SimulateTradeQueryVariables>({
      query: (params) => ({
        url: "/api/v1/decision/backtest",
        params,
      }),
    }),

    getDepositAddress: builder.query<any, any>({
      query: (exchangeAccountKey) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${exchangeAccountKey}/deposit-addresses`,
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

    getETFBacktest: builder.query<any, any>({
      query: (data) => {
        return {
          url: `https://${isStage() || isLocal() ? "stage-" : ""}strategy.wisdomise.io/api/v1/financial-products/${
            data.id
          }/backtest`,
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
        url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/deposit-addresses?symbol_name=${params.symbol}&network_name=${params.network}`,
      }),
    }),

    getWithdrawSymbol: builder.query<any, any>({
      query: () => ({
        url: "/api/v1/market/symbols?withdrawable=true",
      }),
    }),

    createWithdraw: builder.mutation({
      query: (body: any) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${body.exchangeAccountKey}/transactions`,
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
          url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}?verification_code=${params.verificationCode}`,
          method: "PATCH",
        };
      },
    }),

    resendEmailWithdraw: builder.mutation({
      query: (params: any) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}/verification-email`,
          method: "POST",
        };
      },
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
  useGetHourlySignalsQuery,
  useLazySimulateTradeQuery,
  useGetETFBacktestQuery,
  useLazyGetExchangeAccountHistoricalStatisticQuery,
  useGetDepositAddressQuery,
  useSetWaitingListMutation,
  useGetDepositSymbolQuery,
  useLazyGetDepositNetworkQuery,
  useLazyGetDepositWalletAddressQuery,

  //withdraw
  useGetWithdrawSymbolQuery,
  useCreateWithdrawMutation,
  useConfirmWithdrawMutation,
  useResendEmailWithdrawMutation,

  // secondary form
  useAgreeToTermsMutation,

  //email verification
  useResendVerificationEmailMutation,
} = horosApi;
