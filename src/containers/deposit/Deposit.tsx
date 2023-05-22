import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationManager } from "react-notifications";
import { Avatar, Skeleton } from "antd";
import GradientBox from "components/gradientBox";
import { ReactComponent as CloseIcon } from "@images/close.svg";
import { coins } from "containers/dashboard/constants";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import QRCode from "react-qr-code";
import {
  useGetDepositSymbolQuery,
  useLazyGetDepositNetworkQuery,
  useLazyGetDepositWalletAddressQuery,
  useUpdateDepositAddressMutation,
  useRefreshExchangeAccountMutation,
  useGetInvestorAssetStructureQuery,
  useGetUserInfoQuery,
} from "api/horosApi";
import { useParams } from "react-router-dom";
import { ReactComponent as LeftArrow } from "@images/icons/left-arrow.svg";
import SelectNetwork from "components/selectNetwork";
import Modal from "components/modal";
import { TOAST_TIME } from "components/constants";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

const DepositAddressModal = (
  data: any,
  onDone: () => void,
  isLoading: boolean
) => {
  const onClickCopy = () => {
    NotificationManager.success("Copy was successful");
  };
  return (
    <div className="flex flex-col p-4">
      <div className="bg-paper p-4 text-white">
        <Avatar size="large" src={coins[data.name]?.icon} className="mr-2" />
        {data.name} | {data.description}
      </div>
      <p className="tex-xl my-4 text-white">Wallet address</p>
      <div className="flex justify-between bg-paper p-4 text-white">
        <input
          value={data.wallet}
          readOnly
          className="mr-2 flex-grow bg-transparent"
        />

        <CopyToClipboard onCopy={onClickCopy} text={data.wallet}>
          <p className="cursor-pointer text-primary">COPY</p>
        </CopyToClipboard>
      </div>
      <div className="flex items-start justify-start">
        <QRCode
          size={180}
          className="m-auto text-center"
          value={data.wallet}
          viewBox={`0 0 256 256`}
        />
        <div className="flex flex-col items-start justify-between pl-[20px] pt-[35px]">
          <p className="pb-10 text-base text-white ">
            Send only {data.name} to this deposit address.
          </p>
          <p className="text-base text-gray-light">
            Sending coin or token other than {data.name} to this address may
            result in the loss of your deposit.
          </p>
        </div>
      </div>
      <Button
        className="my-6 !w-full"
        text={isLoading ? "Loading ..." : "Done"}
        type={BUTTON_TYPE.FILLED}
        onClick={onDone}
        disabled={isLoading}
      />
    </div>
  );
};

const Deposit: FunctionComponent = () => {
  const { data: userInfo } = useGetUserInfoQuery({});

  const params = useParams();

  const [showSelectNetwork, setShowSelectNetwork] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [showDepositAddress, setShowDepositAddress] = useState<boolean>(false);

  const symbols = useGetDepositSymbolQuery({});
  const [networksTrigger, networks] = useLazyGetDepositNetworkQuery({});

  const [walletAddressTrigger, walletAddress] =
    useLazyGetDepositWalletAddressQuery({});

  const [RefreshExchangeAccountExecuter] = useRefreshExchangeAccountMutation();

  const investorAsset = useGetInvestorAssetStructureQuery({});

  const [updateDepositAddress, updateDeposit] =
    useUpdateDepositAddressMutation();

  const onCloseQRModal = () => {
    setShowDepositAddress(false);
  };

  const onClickTransfer = async () => {
    await updateDepositAddress(params.exchangeAccountKey as string);
  };

  const onClickSymbol = (_symbol: string) => {
    if (_symbol !== "USDT") {
      setSelectedSymbol(_symbol);
      networksTrigger(_symbol);
    }
  };

  const onClickNetwork = () => {
    if (networks?.data?.results) setShowSelectNetwork(true);
  };

  const onCloseSelectNetwork = () => {
    setShowSelectNetwork(false);
  };

  const onSelectNetwork = (_network: any) => {
    setShowSelectNetwork(false);
    setSelectedNetwork(_network);
    walletAddressTrigger({
      exchangeAccountKey: params.exchangeAccountKey,
      symbol: selectedSymbol,
      network: _network.name,
    });
  };

  const onClickSeeDeposit = () => {
    setShowDepositAddress(true);
  };

  const getWalletData = () => {
    return {
      name: selectedSymbol,
      network: selectedNetwork?.name,
      description: selectedNetwork?.description,
      wallet: walletAddress?.data && walletAddress?.data.address,
    };
  };

  const onCompleted = useCallback(async () => {
    await RefreshExchangeAccountExecuter(params.exchangeAccountKey);
    investorAsset?.refetch();
    window.location.href = "/app/dashboard";
  }, [investorAsset]);

  const successToastRef = useRef<boolean>(false);
  useEffect(() => {
    if (successToastRef.current) return;
    successToastRef.current = true;
    if (updateDeposit.isSuccess) {
      NotificationManager.success(
        "Wallet has been updated, It takes some time to affect your account",
        "",
        TOAST_TIME
      );
      onCompleted();
    }
  }, [updateDeposit.isSuccess, onCompleted]);

  useEffect(() => {
    setTimeout(() => {
      onClickSymbol("BUSD");
    }, 0);
  }, []);

  return (
    <>
      <div className="mx-0 flex flex-col  sm:mx-[200px] ">
        <div className="mt-[50px] flex w-full grid-cols-12 flex-col items-center justify-center">
          <h2 className="mb-4   text-4xl capitalize text-white">
            Deposit Your Investment
          </h2>
          <p className="mb-6  w-[390px] text-center text-base text-gray-light ">
            Your subscription fee will be deducted from your deposit at the end
            of each month and may affect your subscription tier
          </p>
          <div className="my-10 flex w-full justify-between">
            {/* <div className="flex flex-col">
            <p className="mb-4 text-lg text-white"> Subscription Plans</p>
            <GradientBox selected>
              <div className="flex min-w-[230px] items-start">
                <p className="font-bold text-white">30-days free trial</p>
              </div>
            </GradientBox>
            <GradientBox>
              <div className="flex flex-col ">
                <p className="self-start font-bold text-white">Rabbit</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xs text-gray-light">portfolio under $1k</p>
                  <p className="text-sm text-white">$00 per year</p>
                </div>
              </div>
            </GradientBox>
            <GradientBox>
              <div className="flex flex-col">
                <p className="self-start font-bold text-white">Fox</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xs text-gray-light">Between $1k - $5k</p>
                  <p className="text-sm text-white">$00 per year</p>
                </div>
              </div>
            </GradientBox>
            <GradientBox>
              <div className="flex flex-col">
                <p className="self-start font-bold text-white">Shark</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xs text-gray-light">Between $10k - $50k</p>
                  <p className="text-sm text-white">$00 per year</p>
                </div>
              </div>
            </GradientBox>
            <GradientBox>
              <div className="flex flex-col">
                <p className="self-start font-bold text-white">Whale</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xs text-gray-light">
                    Portfolio over $50k+
                  </p>
                  <p className="text-sm text-white">$00 per year</p>
                </div>
              </div>
            </GradientBox>
          </div> */}

            <div className=" flex w-full flex-col">
              <p className="mb-4 text-white"> Select currency</p>
              <div className="mb-8 flex flex-row justify-between gap-3">
                {symbols.isLoading ? (
                  <>
                    <Skeleton.Input className=" mb-4 !h-[74px]  " active />
                    <Skeleton.Input className=" mb-4 !h-[74px]   " active />
                  </>
                ) : (
                  symbols.data &&
                  symbols.data.results.map((item: any) => {
                    return (
                      <GradientBox
                        className={
                          item.name !== "USDT"
                            ? "cursor-pointer"
                            : "cursor-default"
                        }
                        key={item.key}
                        disabled={item.name === "USDT"}
                        selected={item.name === selectedSymbol}
                        onClick={() => onClickSymbol(item.name)}
                      >
                        <div className="flex flex-row  items-center  md:min-w-[160px]">
                          <Avatar size="large" src={coins[item.name]?.icon} />
                          <div className="ml-3 flex flex-col items-start justify-between">
                            <p className="text-gray-light">{item.name}</p>
                            <p className="text-white">{item.name}</p>
                          </div>
                        </div>
                      </GradientBox>
                    );
                  })
                )}
              </div>

              <div className=" mb-4 flex w-full flex-row items-center justify-start">
                <div className=" w-full">
                  <p className="mb-4 text-white">Network</p>
                  <div
                    onClick={onClickNetwork}
                    className="flex h-[47px] w-full cursor-pointer items-center justify-between rounded-sm bg-gray-dark pl-2 text-gray-light"
                  >
                    <p>
                      {networks.isFetching
                        ? "Loading ..."
                        : selectedNetwork !== null
                        ? selectedNetwork.name
                        : "Click to select a network"}
                    </p>
                    <LeftArrow className="rotate-180" />
                  </div>
                </div>
              </div>

              <Button
                className="my-6 !w-full"
                text={
                  walletAddress.isFetching
                    ? "Loading ..."
                    : "see deposit address"
                }
                type={BUTTON_TYPE.FILLED}
                onClick={onClickSeeDeposit}
                disabled={
                  !selectedNetwork ||
                  !selectedSymbol ||
                  !(walletAddress?.data && walletAddress?.data.address)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {showSelectNetwork && (
        <Modal className="!w-full sm:!w-[600px]">
          <SelectNetwork
            networks={networks?.data?.results || []}
            selectedNetwork={selectedNetwork}
            onSelectNetwork={onSelectNetwork}
            onCloseSelectNetwork={onCloseSelectNetwork}
            isDeposit
          />
        </Modal>
      )}

      {showDepositAddress && (
        <Modal className="!w-full sm:!w-[600px]">
          <div className="mb-8 flex w-full justify-between px-5 pb-5 pt-2">
            <p className="font-body text-xl text-white">Deposit address</p>
            <CloseIcon
              className="cursor-pointer fill-white"
              onClick={onCloseQRModal}
            />
          </div>
          {DepositAddressModal(
            getWalletData(),
            onClickTransfer,
            updateDeposit.isLoading
          )}
        </Modal>
      )}
    </>
  );
};

export default Deposit;
