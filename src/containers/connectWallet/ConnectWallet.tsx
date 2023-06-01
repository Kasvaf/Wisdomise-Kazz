import { useState, ChangeEvent, useEffect, useMemo } from "react";
import { BUTTON_TYPE } from "utils/enums";
import Button from "components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Input, Select } from "antd";
import { coins } from "containers/dashboard/constants";
import {
  // useCreateInvestorAssetMutation,
  useGetExchangeListQuery,
} from "api/horosApi";
import { NotificationManager } from "react-notifications";

const initialValues = {
  api_key: "",
  secret_key: "",
};

const ConnectWallet: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const exchangeList = useGetExchangeListQuery({});

  const [values, setValues] = useState(initialValues);

  const [exchangeCode, setExchangeCode] = useState("");

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // const [createInvestorAsset, createAsset] = useCreateInvestorAssetMutation();

  const onClickConnectWallet = async () => {
    const data = {
      ...values,
      exchange_key: exchangeCode,
      etf_package_key: params.id,
    };
    // await createInvestorAsset(data);
  };

  const navigateToCongratulation = () => {
    NotificationManager.success("The Wallet was successful connected");

    navigate(`/app/congratulation`);
  };

  // useEffect(() => {
  //   if (createAsset.isSuccess) {
  //     navigateToCongratulation();
  //   }
  // }, [createAsset.isSuccess]);

  const getExchangeList = useMemo(() => {
    const array: Array<{
      value: string;
      label: string;
    }> = [];
    if (exchangeList?.data?.results.length > 0) {
      exchangeList?.data?.results.map((item: any) => {
        return array.push({
          value: item.key,
          label: `${item.name} (${item.type})`,
        });
      });
    }
    return array;
  }, [exchangeList]);

  const onChangeExchange = (value: any) => {
    setExchangeCode(value);
  };

  return (
    <div className="mx-[200px] mt-[100px] flex flex-col items-center justify-center">
      <h1 className="mb-7 text-3xl text-white">Connect Your Wallet </h1>
      <p className="mb-7 text-center text-lg text-gray-light">
        please select the Exchange from following list and fill the black filled
        regarding your key
      </p>
      <div className="flex w-full flex-col  ">
        <div className=" flex w-full flex-row items-center justify-between rounded bg-gray-dark p-5 pr-0">
          <div className="flex w-full flex-row items-center justify-start">
            <Avatar size="large" src={coins["BNB"].icon} />
            <div className="ml-4 w-full">
              <p className="text-gray-light">EXCHANGE</p>
              {/* <p className="text-lg font-bold text-gray-light">
                {exchangeList?.data?.results[0].name}
              </p> */}
              <Select
                className="ml-[-10px] mt-1 w-full"
                onChange={onChangeExchange}
                options={getExchangeList}
              />
            </div>
          </div>
          {/* <ChevronDown className="h-10 w-10 self-end fill-white text-2xl" /> */}
        </div>

        <a
          href="https://www.binance.com/en-NZ/support/faq/how-to-create-api-360002502072"
          target="_blank"
          className="mt-3 text-2xl font-bold text-primary"
          rel="noreferrer noopener"
        >
          How do I create an API on Binance
        </a>
        <div className=" mt-3 flex w-full flex-col items-start justify-between rounded bg-gray-dark p-5">
          <p className="pl-2 text-xs text-gray-light">API KEY *</p>
          <Input
            placeholder="KEY"
            bordered={false}
            className="text-lg text-white"
            name="api_key"
            onChange={onChangeInput}
          />
        </div>
        <div className=" mt-3 flex w-full flex-col items-start justify-between rounded bg-gray-dark p-5">
          <p className="pl-2 text-xs text-gray-light">API SECRET *</p>
          <Input
            placeholder="API"
            bordered={false}
            className="text-lg text-white"
            name="secret_key"
            onChange={onChangeInput}
          />
        </div>
      </div>
      <div className="mt-5 flex w-full items-center gap-5">
        <Button
          type={BUTTON_TYPE.FILLED}
          // text={createAsset.isLoading ? "Loadings..." : "Connect Wallet"}
          className="!w-full"
          onClick={onClickConnectWallet}
          // disabled={
          //   values.api_key.trim().length === 0 ||
          //   values.secret_key.trim().length === 0 ||
          //   exchangeCode === "" ||
          //   createAsset.isLoading
          // }
        />
      </div>
    </div>
  );
};

export default ConnectWallet;
