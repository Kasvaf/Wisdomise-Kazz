import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, notification, Skeleton } from 'antd';
import { ReactComponent as CloseIcon } from '@images/close.svg';
import { ReactComponent as LeftArrow } from '@images/icons/left-arrow.svg';
import { ReactComponent as TickCircleIcon } from '@images/tickCircle.svg';
import { ReactComponent as WarningIcon } from '@images/warningIcon.svg';
import { floatData, roundDown } from 'utils/numbers';
import { useIsMobile } from 'utils/useIsMobile';
import {
  useUserInfoQuery,
  useInvestorAssetStructuresQuery,
  useMarketNetworksQuery,
} from 'api';
import {
  useConfirmWithdrawMutation,
  useCreateWithdrawMutation,
  useGetWithdrawSymbolQuery,
  useResendEmailWithdrawMutation,
} from 'old-api/horosApi';
import Modal from 'shared/Modal';
import ButtonV1, { BUTTON_TYPE } from 'shared/ButtonV1';
import { PageWrapper } from 'modules/base/PageWrapper';
import { coins } from '../constants';
import SelectNetwork from '../SelectNetwork';
import GradientBox from '../GradientBox';

const initialValues = {
  adr: '',
  amount: '',
};

const confirmNetworkModal = (
  name: string,
  desc: string,
  onClickYesConformNetwork: () => void,
  onClickNoConformNetwork: () => void,
) => {
  return (
    <div className="flex flex-col items-center p-5 ">
      <WarningIcon />
      <p className="my-8 text-center text-white">
        The network you selected is {name}, Please confirm that your withdrawal
        address supports the {desc} network. If the other platform does not
        support It, Your assets may be lost. If You are not sure whether the
        receiver support It, You can click the button below to verify It
        yourself.
      </p>
      <div className="flex justify-between gap-4">
        <ButtonV1
          text="Yes, I'm Sure"
          type={BUTTON_TYPE.FILLED}
          className="!w-full sm:!w-[180px]"
          onClick={onClickYesConformNetwork}
        />
        <ButtonV1
          text="No, I'm not sure"
          type={BUTTON_TYPE.OUTLINED}
          className="!w-full sm:!w-[180px]"
          onClick={onClickNoConformNetwork}
        />
      </div>
    </div>
  );
};

const confirmWithdrawModal = (
  onClickYesConformWithdraw: () => void,
  onClickNoConformWithdraw: () => void,
) => {
  return (
    <div className="flex flex-col items-center p-5 ">
      <WarningIcon />
      <p className="my-8 text-center text-white">
        Are you sure about the network and withdraw amount? If yes tap on
        continue ,If not tap on return and double check your information .
      </p>
      <div className="flex justify-between gap-4">
        <ButtonV1
          text="Continue"
          type={BUTTON_TYPE.FILLED}
          className="!w-full sm:!w-[180px]"
          onClick={onClickYesConformWithdraw}
        />
        <ButtonV1
          text="Return"
          type={BUTTON_TYPE.OUTLINED}
          className="!w-full sm:!w-[180px]"
          onClick={onClickNoConformWithdraw}
        />
      </div>
    </div>
  );
};

const WithdrawSummeryModal = (
  onContinueSummery: () => void,
  data: any,
  isLoading: boolean,
  isMobile: boolean,
) => {
  const address = isMobile
    ? `${data.address.substring(0, 18)}...`
    : data.address;
  return (
    <div className="p-5">
      <div className="mb-4 flex flex-col bg-paper p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-gray-light">Amount</p>
          <p className="text-white mobile:text-xs ">{`${roundDown(
            data.amount - data.networkFee,
          )} ${data.symbol} (Network fee ${data.networkFee} ${
            data.symbol
          })`}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Address</p>
          <p className="text-white">{address}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Network</p>
          <p className="text-white ">{`${data.networkDescription}`}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Source</p>
          <p className="text-white ">Spot Wallet</p>
        </div>
      </div>
      <ButtonV1
        disabled={isLoading}
        text={isLoading ? 'Loading' : 'Confirm'}
        type={BUTTON_TYPE.FILLED}
        className="!w-full "
        onClick={onContinueSummery}
      />
    </div>
  );
};

const SecurityVerificationModal = (
  userInfo: any,
  onGetCode: any,
  onSubmit: any,
  onClose: any,
  loading: boolean,
  invitationCodeRef: any,
) => {
  const onClickSubmit = () => {
    onSubmit();
  };
  return (
    <>
      <div className="mb-2 flex w-full justify-between  pb-5 pt-2">
        <p className="text-xl text-white">Security Verification</p>
        <CloseIcon className="cursor-pointer fill-white" onClick={onClose} />
      </div>
      <div className="flex flex-col">
        <p className="mb-8  text-gray-light">
          Please open your email and enter 6-code sent to:{' '}
          {userInfo?.customer.user.email}
        </p>
        <div className=" flex w-full flex-row items-center justify-between rounded  ">
          <div className="flex w-full flex-row items-center justify-start">
            <div className=" w-full">
              <p className="mb-4 text-white">Email verification code</p>
              <div className="buttonInput mb-8">
                <input
                  type="text"
                  ref={invitationCodeRef}
                  className="h-[47px] w-full  bg-gray-dark pl-2 text-white"
                />
                <p
                  className="min-w-[75px] cursor-pointer bg-gray-dark pt-[10px] text-primary"
                  onClick={onGetCode}
                  title="If you have not gotten the email please press resend button to send again."
                >
                  Resend
                </p>
              </div>
            </div>
          </div>
        </div>

        <ButtonV1
          text={loading ? 'loading ...' : 'submit'}
          type={BUTTON_TYPE.FILLED}
          className="mb-4 !w-full"
          onClick={onClickSubmit}
          disabled={loading}
        />
      </div>
    </>
  );
};

const CompletedModal = (
  onCompleted: () => void,
  data: any,
  isMobile: boolean,
) => {
  const address = isMobile
    ? `${data.address.substring(0, 25)}...`
    : data.address;

  return (
    <div className="flex flex-col items-center p-5 ">
      <TickCircleIcon />
      <p className="mt-8 text-center text-2xl text-white">
        Withdrawal Request Submitted
      </p>
      <p className="mb-16 mt-2 text-center text-base text-gray-light">
        Please note that you will receive an email once it is completed
      </p>
      <div className="mb-4 flex w-full flex-col bg-paper p-4 text-sm">
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Amount</p>
          <p className="text-xs text-white">{`${roundDown(
            data.amount - data.networkFee,
          )} ${data.symbol} (Network fee ${data.networkFee} ${
            data.symbol
          })`}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Address</p>
          <p className="text-white ">{address}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Network</p>
          <p className="text-white ">{`${data.networkDescription}`}</p>
        </div>
        <div className="mb-3 flex justify-between">
          <p className="text-gray-light">Source</p>
          <p className="text-white ">Spot Wallet</p>
        </div>
      </div>
      <ButtonV1
        text="Go To Dashboard"
        type={BUTTON_TYPE.FILLED}
        className="!w-full "
        onClick={onCompleted}
      />
    </div>
  );
};

const WithdrawPage = () => {
  const isMobile = useIsMobile();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [showSelectNetwork, setShowSelectNetwork] = useState<boolean>(false);
  const [showConfirmNetwork, setShowConfirmNetwork] = useState<boolean>(false);
  const [showConfirmWithdraw, setShowConfirmWithdraw] =
    useState<boolean>(false);
  const [showSummery, setShowSummery] = useState<boolean>(false);
  const [showSecurityVerification, setShowSecurityVerification] =
    useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [inputs, setInputs] = useState(initialValues);
  const symbols = useGetWithdrawSymbolQuery({});
  const ias = useInvestorAssetStructuresQuery();
  const { data: userInfo } = useUserInfoQuery();

  const [createWithdrawTrigger, createWithdraw] = useCreateWithdrawMutation();

  const [confirmWithdrawTrigger, confirmWithdraw] =
    useConfirmWithdrawMutation();

  const [resendWithdrawTrigger] = useResendEmailWithdrawMutation();

  const mea = ias.data?.[0]?.main_exchange_account;

  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: selectedSymbol,
    exchangeAccountKey: mea?.key,
  });

  const fpi = ias.data?.[0]?.financial_product_instances[0];

  const onConfirm = () => {
    setShowConfirmWithdraw(true);
  };

  const onClickSymbol = (_symbol: string) => {
    if (selectedSymbol === '') {
      setSelectedSymbol(_symbol);
    }
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value && name === 'amount' && !Number(value)) {
      return;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickNetwork = () => {
    if (networks.data) setShowSelectNetwork(true);
  };

  const getMinimumWithdraw = () => {
    if (selectedNetwork) return selectedNetwork?.binance_info.withdrawMin;
    return 0;
  };

  const getMinMaxWithdrawFee = useMemo(
    () =>
      !networks.data
        ? { min: 0, max: 0 }
        : {
            min: Math.min(
              ...networks.data.map(item =>
                Number(item.binance_info.withdrawFee),
              ),
            ),
            max: Math.max(
              ...networks.data.map(item =>
                Number(item.binance_info.withdrawFee),
              ),
            ),
          },
    [networks.data],
  );

  const onCloseNetwork = () => {
    setShowSelectNetwork(false);
  };

  const onSelectNetwork = (_network: any) => {
    setShowConfirmNetwork(true);
    setShowSelectNetwork(false);
    setSelectedNetwork(_network);
  };

  const onClickYesConformNetwork = () => {
    setShowConfirmNetwork(false);
  };

  const onClickNoConformNetwork = () => {
    setShowConfirmNetwork(false);
    setShowSelectNetwork(true);
    setSelectedNetwork(null);
  };

  const onClickNoConformWithdraw = () => {
    setShowConfirmWithdraw(false);
  };

  const onClickYesConformWithdraw = () => {
    setShowConfirmWithdraw(false);
    setShowSummery(true);
  };

  const onContinueSummery = async () => {
    const exchangeAccountKey = ias?.data?.[0]?.main_exchange_account.key;
    if (!exchangeAccountKey) return;

    const body = {
      tx_type: 'WITHDRAW',
      symbol_name: selectedSymbol,
      network_name: selectedNetwork.name,
      address: inputs.adr,
      amount: inputs.amount,
      exchangeAccountKey,
    };
    const { data }: any = await createWithdrawTrigger(body);

    if (data) {
      setShowSummery(false);
      setShowSecurityVerification(true);
    }
  };

  const getSummeryData = () => {
    return {
      amount: inputs.amount,
      address: inputs.adr,
      networkDescription: selectedNetwork?.description,
      networkName: selectedNetwork?.name,
      symbol: selectedSymbol,
      networkFee: selectedNetwork?.binance_info.withdrawFee,
    };
  };
  const invitationCodeRef = useRef<HTMLInputElement>(null);

  const onSetMaxAmount = () => {
    const max = roundDown(
      ias?.data?.[0]?.main_exchange_account.quote_equity || 0,
    );
    setInputs({
      ...inputs,
      amount: String(max),
    });
  };

  const onResendCode = async () => {
    const exchangeAccountKey = ias?.data?.[0]?.main_exchange_account.key;
    if (!exchangeAccountKey) return;

    const params = {
      exchangeAccountKey,
      transactionKey: createWithdraw.data.key,
    };

    const { data }: any = await resendWithdrawTrigger(params);

    if (data) {
      notification.success({
        message: 'A new code has been sent to your email',
      });
    }
  };

  const onSubmitWithdraw = async () => {
    const codeEl = invitationCodeRef.current;
    const exchangeAccountKey = ias?.data?.[0]?.main_exchange_account.key;
    if (!exchangeAccountKey || !codeEl) return;

    const params = {
      verificationCode: codeEl.value,
      exchangeAccountKey,
      transactionKey: createWithdraw.data.key,
    };
    const { data }: any = await confirmWithdrawTrigger(params);

    if (data) {
      setShowSecurityVerification(false);
      setShowCompleted(true);
    }
  };

  const getTransactionAmount = () => {
    if (inputs.amount === '') return null;
    const amount = parseFloat(inputs.amount);
    return floatData(amount - selectedNetwork?.binance_info.withdrawFee);
  };

  const onUpdateIAS = async () => {
    await ias?.refetch();
  };

  const navigate = useNavigate();
  const onCompleted = async () => {
    navigate('/app/dashboard');
    await onUpdateIAS();
  };

  useEffect(() => {
    if (!ias.isFetching) {
      setTimeout(() => {
        onClickSymbol('BUSD');
      }, 100);
    }
  });

  return (
    <PageWrapper loading={ias.isLoading || networks.isLoading}>
      <div className="mx-0 flex flex-col ">
        <div className=" flex w-full flex-row items-center justify-between rounded">
          <div className="flex w-full flex-row items-center justify-start">
            <div className="w-full">
              <p className=" mb-4 text-white">Select coin</p>
              <div className="flex w-full flex-row justify-between gap-3">
                {symbols.isLoading ? (
                  <div className="flex w-full flex-row justify-between gap-3">
                    <Skeleton.Input
                      className=" mb-4 !h-[74px] w-full "
                      active
                    />
                    <Skeleton.Input
                      className=" mb-4 !h-[74px]  w-full "
                      active
                    />
                  </div>
                ) : (
                  symbols.data?.results.map((item: any) => {
                    return (
                      <GradientBox
                        className={
                          item.name !== 'USDT'
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        }
                        key={item.key}
                        disabled={item.name === 'USDT'}
                        selected={item.name === selectedSymbol}
                        onClick={() => {
                          onClickSymbol(item.name);
                        }}
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
            </div>
          </div>
        </div>

        <div className=" flex w-full flex-row items-center justify-between rounded">
          <div className="flex w-full flex-row items-center justify-start">
            <div className="ml-2 w-full">
              <p className="mb-4 text-white">Network</p>
              <div
                onClick={onClickNetwork}
                className="flex h-[47px] w-full cursor-pointer items-center justify-between rounded-sm bg-gray-dark pl-2 text-gray-light"
              >
                <p>
                  {networks.isLoading
                    ? 'Loading ...'
                    : selectedNetwork !== null
                    ? selectedNetwork.name
                    : 'Click to select a network'}
                </p>
                <LeftArrow className="rotate-180" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-row items-center justify-between rounded">
          <div className="flex w-full flex-row items-center justify-start">
            <div className="ml-2 w-full">
              <p className="mb-4 text-white">Enter address</p>
              <div className="flex flex-col">
                <input
                  type="text"
                  name="adr"
                  autoComplete="off"
                  onChange={onChangeInput}
                  placeholder="Enter Wallet Address"
                  className="h-[47px] w-full rounded-sm bg-gray-dark pl-2 text-white"
                />
                <p
                  className={`mt-2 text-error  ${
                    inputs.adr !== '' &&
                    selectedNetwork !== null &&
                    inputs.adr.match(
                      `${selectedNetwork.binance_info.addressRegex}`,
                    )
                      ? 'flex'
                      : 'hidden'
                  }`}
                >
                  Invalid wallet address
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-row items-center justify-between rounded">
          <div className="flex w-full flex-row items-center justify-start">
            <div className="ml-2 w-full">
              <p className="mb-4 text-white">Amount</p>
              <div className="flex flex-col">
                <div className="buttonInput">
                  <input
                    disabled={!selectedNetwork}
                    name="amount"
                    value={inputs.amount}
                    autoComplete="off"
                    onChange={onChangeInput}
                    placeholder={`0.00 ${selectedSymbol}`}
                    className="h-[47px] w-full rounded-sm bg-gray-dark pl-2 text-white"
                  />
                  <p
                    className="min-w-[45px] cursor-pointer bg-gray-dark pl-1 pt-[10px] text-primary"
                    onClick={onSetMaxAmount}
                  >
                    Max
                  </p>
                </div>
                <p
                  className={`mt-2 text-error  ${
                    selectedNetwork !== null &&
                    inputs.amount !== '' &&
                    Number(inputs.amount) < getMinimumWithdraw()
                      ? 'flex'
                      : 'hidden'
                  }`}
                >
                  The amount should be greater than minimum withdraw
                </p>
                <p
                  className={`mt-2 text-error ${
                    fpi &&
                    mea &&
                    selectedNetwork !== null &&
                    inputs.amount !== '' &&
                    Number(inputs.amount) - 0.01 > mea.quote_equity
                      ? 'flex'
                      : 'hidden'
                  }`}
                >
                  The amount can not be greater than total withdrawable amount
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex w-full flex-row items-center justify-between rounded  p-4 pr-0">
          <div className=" flex flex-col justify-start">
            <p className="text-base text-white">Total withdrawable amount</p>
            <p className="text-xs text-gray-light">
              {mea?.quote_equity ? roundDown(mea.quote_equity) : 0}
            </p>
          </div>
          <div className="ml-2 flex flex-col justify-start">
            <p className="text-base text-white">Minimum withdraw</p>
            <p className="text-xs text-gray-light">
              {selectedSymbol && selectedNetwork
                ? `${getMinimumWithdraw()} ${selectedSymbol}`
                : '- -'}
            </p>
          </div>
          <div className="ml-2 flex flex-col justify-start">
            <p className="text-base text-white">Network fee</p>
            <p className="text-xs text-gray-light">
              {selectedNetwork
                ? selectedNetwork.binance_info.withdrawFee
                : selectedSymbol
                ? `${getMinMaxWithdrawFee.min} - ${getMinMaxWithdrawFee.max}`
                : '- -'}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-between  p-4 pr-0">
          <p className="text-2xl text-white">
            {getTransactionAmount() || '0.00'} {selectedSymbol}
          </p>
          <ButtonV1
            text="withdraw"
            type={BUTTON_TYPE.FILLED}
            className="!w-full sm:!w-[234px]"
            onClick={onConfirm}
            disabled={
              inputs.amount === '' ||
              inputs.adr === '' ||
              selectedSymbol === '' ||
              selectedNetwork === null ||
              Number(inputs.amount) < getMinimumWithdraw() ||
              (mea && Number(inputs.amount) > mea.quote_equity) ||
              inputs.adr.match(
                `${selectedNetwork.binance_info.addressRegex}`,
              ) == null
            }
          />
        </div>
      </div>

      {showSelectNetwork && (
        <Modal className="!w-full sm:!w-[600px]">
          <SelectNetwork
            networks={networks?.data ?? []}
            selectedNetwork={selectedNetwork}
            onSelectNetwork={onSelectNetwork}
            onCloseSelectNetwork={onCloseNetwork}
          />
        </Modal>
      )}

      {showConfirmNetwork && (
        <Modal className="!w-full sm:!w-[420px]">
          {confirmNetworkModal(
            selectedNetwork?.name,
            selectedNetwork?.description,
            onClickYesConformNetwork,
            onClickNoConformNetwork,
          )}
        </Modal>
      )}

      {showConfirmWithdraw && (
        <Modal className="!w-full sm:!w-[420px]">
          {confirmWithdrawModal(
            onClickYesConformWithdraw,
            onClickNoConformWithdraw,
          )}
        </Modal>
      )}

      {showSummery && (
        <Modal className="!w-full sm:!w-[630px]">
          <div className="flex items-center justify-between">
            <p className="p-5 text-left text-xl text-white">Withdrawal</p>
            <CloseIcon
              className="mr-4 cursor-pointer fill-white"
              onClick={() => {
                setShowSummery(false);
              }}
            />
          </div>
          {WithdrawSummeryModal(
            () => onContinueSummery(),
            getSummeryData(),
            createWithdraw?.isLoading,
            isMobile,
          )}
        </Modal>
      )}

      {showSecurityVerification && (
        <Modal className="!w-full sm:!w-[530px]">
          {SecurityVerificationModal(
            userInfo,
            onResendCode,
            onSubmitWithdraw,
            () => {
              setShowSecurityVerification(false);
            },
            confirmWithdraw.isLoading,
            invitationCodeRef,
          )}
        </Modal>
      )}
      {showCompleted && (
        <Modal className="!w-full sm:!w-[530px]">
          {CompletedModal(onCompleted, getSummeryData(), isMobile)}
        </Modal>
      )}
    </PageWrapper>
  );
};

export default WithdrawPage;
