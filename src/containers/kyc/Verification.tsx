import { FC, useCallback, useState } from "react";
import clsx from "classnames";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SumsubWebSdk from "@sumsub/websdk-react";
import { useGetKycAccessTokenQuery, useGetUserInfoQuery } from "api/horosApi";
import Spinner from "containers/dashboard/common/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import sumsubCss from "./sumsub.css";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";

const VerificationPage: FC = () => {
  const [search] = useSearchParams();
  const {
    data: sumSubAccessToken,
    isLoading: isLoadingToken,
    refetch: refetchToken,
  } = useGetKycAccessTokenQuery({ level: search.get("level") });

  const { data: userInfo, refetch } = useGetUserInfoQuery({});

  const navigate = useNavigate();
  const goToDashboard = useCallback(() => {
    navigate("/app");
  }, []);
  const [isCompleted, setCompleted] = useState(false);

  if (!isLoadingToken && sumSubAccessToken)
    return (
      <>
        <SumsubWebSdk
          className="SumSub-wrapper"
          config={{
            email: userInfo?.customer.user.email,
            uiConf: {
              customCssStr: sumsubCss,
            },
          }}
          accessToken={sumSubAccessToken?.token}
          expirationHandler={refetchToken}
          onMessage={(msg: any, arg: any) => {
            console.log(msg, arg);
            if (msg !== "idCheck.onResize") {
              // TODO: Later we may want to use a more precise filter for refetching the KYC levels
              // TODO: here's the list of all message types: https://developers.sumsub.com/web-sdk/#websdk-messages

              refetch();
            }
            if (msg === "idCheck.stepCompleted") {
              console.log("stepCompleted", arg);
              setCompleted(true);
            }
          }}
          onError={(error: any) => console.error(error)}
        />
        <Button
          className={clsx("mx-auto", !isCompleted && "hidden")}
          type={BUTTON_TYPE.FILLED}
          text="Go to dashboard"
          onClick={goToDashboard}
        />
      </>
    );

  return <Spinner />;
};

export default VerificationPage;
