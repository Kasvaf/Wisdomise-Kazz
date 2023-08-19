import { notification } from 'antd';
import { type AxiosError } from 'axios';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
} from 'api';
import { Button } from 'modules/shared/Button';
import { PageWrapper } from 'modules/base/PageWrapper';
import Balance from './Balance';
import ArrowSrc from './arrow.svg';
import TradeSrc from './trade.svg';
const enum IAS_STATUS {
  stop = 'stop',
  start = 'start',
  pause = 'pause',
  resume = 'resume',
}

function Dashboard() {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const fpi = ias.data?.[0]?.financial_product_instances[0];

  const onClickStatus = async (status: keyof typeof IAS_STATUS) => {
    if (updateFPIStatus.isLoading || !fpi) return;
    try {
      await updateFPIStatus.mutateAsync({
        fpiKey: fpi.key,
        status,
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message:
          (error as AxiosError<{ message: string }>).response?.data.message ||
          '',
      });
    }
  };

  return (
    <PageWrapper loading={ias.isLoading}>
      <div className="flex w-full flex-row justify-center">
        <div className="flex w-full flex-col">
          <a
            href="https://athena.wisdomise.io"
            target="_blank"
            className="mb-6 flex h-16 cursor-pointer items-center justify-between rounded-3xl bg-white/5 px-8 py-3 text-xl text-white/20 mobile:p-2 mobile:pl-8 mobile:text-sm"
          >
            Ask Athena anything about crypto
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <img src={ArrowSrc} />
            </div>
          </a>

          {fpi == null ? (
            <div className="flex w-full flex-row justify-between rounded-3xl bg-white/5 px-8 py-6  mobile:p-6">
              <div className="flex flex-col justify-between">
                <div className="w-2/3 mobile:w-full">
                  <h1 className="text-xl font-semibold text-white">
                    We Trade On Your Behalf!
                  </h1>
                  <div className="my-5 w-auto text-sm !leading-normal text-gray-light mobile:-mr-5 mobile:text-sm">
                    <img
                      src={TradeSrc}
                      className="float-right hidden h-[202px] mobile:block"
                      alt="trade"
                      style={{
                        shapeMargin: '20px',
                        shapeImageThreshold: '0.05',
                        shapeOutside: `url(${TradeSrc})`,
                      }}
                    />
                    <div className="hidden h-3 mobile:block" />
                    Wisdomise offers{' '}
                    <span className="whitespace-nowrap">AI-based</span>{' '}
                    strategies tailored to your risk tolerance. Check out our
                    strategies and start making a profit today.
                  </div>
                </div>
                <Button
                  className="self-start"
                  onClick={() => navigate('/app/products-catalog')}
                >
                  Check Products
                </Button>
              </div>
              <img
                src={TradeSrc}
                className="h-[200px] mobile:hidden"
                alt="trade"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between sm:flex-row">
              <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/5 p-5 mobile:flex-col mobile:items-start sm:w-auto">
                <div className="flex flex-col">
                  <p className="mb-1 text-gray-light">
                    Current strategy{' '}
                    <span className="text-xs">
                      ({updateFPIStatus.isLoading ? 'UPDATING' : fpi?.status})
                    </span>
                  </p>
                  <h5 className="text-base text-white">
                    {fpi?.financial_product.title}
                  </h5>
                </div>
                <div className="flex">
                  <p
                    onClick={() => {
                      onClickStatus(
                        fpi.status === 'RUNNING'
                          ? IAS_STATUS.pause
                          : IAS_STATUS.resume,
                      );
                    }}
                    className={`cursor-pointer font-bold uppercase text-primary ${
                      ['DRAFT', 'STOPPED'].includes(fpi?.status) &&
                      'invisible mobile:hidden'
                    }
                  ${updateFPIStatus.isLoading && 'opacity-40'}`}
                  >
                    {fpi.status === 'RUNNING' ? 'PAUSE' : 'RESUME'}
                  </p>
                  {fpi.status === 'DRAFT' && (
                    <p
                      onClick={() => {
                        onClickStatus(IAS_STATUS.stop);
                      }}
                      className={`ml-2 cursor-pointer font-bold uppercase text-primary
                  ${updateFPIStatus.isLoading && 'opacity-40'}
                  `}
                    >
                      Deactivate
                    </p>
                  )}
                  <p
                    onClick={() => {
                      onClickStatus(
                        fpi.status === 'DRAFT'
                          ? IAS_STATUS.start
                          : IAS_STATUS.stop,
                      );
                    }}
                    className={`ml-2 cursor-pointer font-bold uppercase text-primary
                  ${updateFPIStatus.isLoading && 'opacity-40'}
                  `}
                  >
                    {fpi.status === 'DRAFT' ? 'START' : 'STOP'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {fpi != null && <Balance />}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
