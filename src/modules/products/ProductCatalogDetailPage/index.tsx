import { useParams } from 'react-router-dom';
import { useFinancialProductQuery, useFPBacktestQuery } from 'api';
import Button from 'shared/Button';
import LineChart from 'shared/LineChart';
import CoinsIcons from 'shared/CoinsIcons';
import PageWrapper from 'modules/base/PageWrapper';
import FPActivateButton from '../ProductsCatalogPage/FPActivateButton';
import { ColorByRisk } from '../constants';
import NoticeBox from './NoticeBox';
import ProfilePropsBox from './ProfilePropsBox';
import InvestmentInfoBox from './InvestmentInfoBox';

const ProductCatalogDetail = () => {
  const params = useParams<{ fpKey: string }>();
  const fpKey = params.fpKey;
  if (!fpKey) throw new Error('unexpected');

  const fp = useFinancialProductQuery(fpKey);
  const backtest = useFPBacktestQuery(fpKey);
  const rrr = fp.data?.profile.return_risk_ratio;

  return (
    <PageWrapper loading={fp.isLoading}>
      <h1 className="text-base font-semibold text-white">{fp.data?.title}</h1>

      <div className="mb-7 flex mobile:flex-col">
        <div className="basis-2/3 mobile:basis-auto">
          <p className="mt-6 text-sm text-white/60 ">{fp.data?.description}</p>
        </div>

        <div className="flex basis-1/3 items-end justify-between pl-4 mobile:mt-8 mobile:basis-auto mobile:pl-0">
          <Button
            className="mr-4 w-1/2"
            variant="secondary"
            to="/app/products-catalog"
          >
            Back
          </Button>
          <FPActivateButton
            inDetailPage
            className="w-1/2"
            financialProduct={fp.data!}
          />
        </div>
      </div>

      <div className="flex mobile:flex-col">
        <div className="basis-2/3 mobile:order-2 mobile:basis-auto">
          <div className="flex h-full items-center justify-center rounded-3xl bg-white/5 p-8">
            <LineChart
              className="w-full"
              title={fp.data?.title}
              chartData={backtest.data}
              loading={backtest.isLoading}
            />
          </div>
        </div>

        <div className="flex basis-1/3 flex-col gap-4 pl-4 mobile:order-1 mobile:mb-4 mobile:basis-auto mobile:pl-0">
          <div className="flex flex-wrap gap-2 text-base font-medium">
            <div className="flex flex-1 items-center rounded-3xl bg-white/5 p-2">
              <CoinsIcons coins={fp.data?.config.assets || ''} />
            </div>

            <div
              className={`flex-1 whitespace-pre rounded-full px-4 py-3 text-center ${
                ColorByRisk[rrr || 'Low']
              }`}
            >
              {String(rrr || '') + ' Risk'}
            </div>
          </div>

          <ProfilePropsBox fp={fp.data} />
          <InvestmentInfoBox fp={fp.data} />
        </div>
      </div>
      <NoticeBox className="mt-4" />
    </PageWrapper>
  );
};

export default ProductCatalogDetail;
