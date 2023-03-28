import { FC, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SumsubWebSdk from "@sumsub/websdk-react";
import { useGetKycAccessTokenQuery, useGetUserInfoQuery } from "api/horosApi";
import Spinner from "containers/dashboard/common/Spinner";
import { useSearchParams } from "react-router-dom";
import sumsubCss from "./sumsub.css";

const VerificationPage: FC = () => {
  const [search] = useSearchParams();
  const { data: sumSubAccessToken, isLoading: isLoadingToken } =
    useGetKycAccessTokenQuery({ level: search.get("level") });

  const { data: userInfo, refetch } = useGetUserInfoQuery({});

  if (!isLoadingToken && sumSubAccessToken)
    return (
      <SumsubWebSdk
        className="SumSub-wrapper"
        config={{
          email: userInfo?.customer.user.email,
          uiConf: {
            customCssStr: sumsubCss,
          },
        }}
        accessToken={sumSubAccessToken?.token}
        expirationHandler={(exp: any) => console.log("exp", exp)}
        onMessage={(msg: any, arg: any) => {
          console.log(msg, arg);
          if (msg !== "idCheck.onResize") {
            // TODO: Later we may want to use a more precise filter for refetching the KYC levels
            // TODO: here's the list of all message types: https://developers.sumsub.com/web-sdk/#websdk-messages

            refetch();
          }
        }}
        onError={(error: any) => console.log("error", error)}
      />
    );

  return <Spinner />;
};

export default VerificationPage;
