import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFinancialProductQuery, useFPBacktestQuery } from 'api';
import Button from 'shared/Button';
import LineChart from 'shared/LineChart';
import CoinsIcons from 'shared/CoinsIcons';
import PageWrapper from 'modules/base/PageWrapper';
import Card from 'modules/shared/Card';
import ButtonFPActivate from '../ButtonFPActivate';
import RiskBadge from '../RiskBadge';
import NoticeBox from './NoticeBox';
import ProfilePropsBox from './ProfilePropsBox';
import InvestmentInfoBox from './InvestmentInfoBox';

const PageProductCatalogDetail = () => {
  const { t } = useTranslation('products');
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
            {t('common:actions.back')}
          </Button>
          <ButtonFPActivate
            inDetailPage
            className="w-1/2"
            financialProduct={fp.data}
          />
        </div>
      </div>

      <div className="flex mobile:flex-col">
        <div className="basis-2/3 mobile:order-2 mobile:basis-auto">
          <Card className="flex h-full items-center justify-center">
            <LineChart
              className="w-full"
              title={fp.data?.title}
              chartData={backtest.data}
              loading={backtest.isLoading}
            />
          </Card>
        </div>

        <div className="flex basis-1/3 flex-col gap-4 pl-4 mobile:order-1 mobile:mb-4 mobile:basis-auto mobile:pl-0">
          <div className="flex flex-wrap gap-2 text-base font-medium">
            <div className="flex flex-1 items-center rounded-3xl bg-white/5 p-2">
              <CoinsIcons coins={fp.data?.config.assets || ''} />
            </div>
            <RiskBadge risk={rrr} className="px-4 py-3" />
          </div>

          <ProfilePropsBox fp={fp.data} />
          <InvestmentInfoBox fp={fp.data} />
        </div>
      </div>
      <NoticeBox className="mt-4" />
    </PageWrapper>
  );
};

export default PageProductCatalogDetail;
