import { useParams } from 'react-router-dom';
import { ReactComponent as Attention } from '@images/attention.svg';
import { useFinancialProductQuery, useFPBacktestQuery } from 'api';
import useMainQuote from 'shared/useMainQuote';
import LineChart from 'shared/LineChart';
import CoinsIcons from 'shared/CoinsIcons';
import PriceChange from 'shared/PriceChange';
import PageWrapper from 'modules/base/PageWrapper';
import FPActivateButton from './ProductsCatalogPage/FPActivateButton';
import { ColorByRisk } from './constants';

const ProductCatalogDetail = () => {
  const params = useParams<{ fpKey: string }>();
  const fpKey = params.fpKey;
  if (!fpKey) throw new Error('unexpected');

  const fp = useFinancialProductQuery(fpKey);
  const backtest = useFPBacktestQuery(fpKey);
  const mainQuote = useMainQuote();

  const rrr = fp.data?.profile.return_risk_ratio;

  return (
    <PageWrapper loading={fp.isLoading}>
      <h1 className="text-base font-semibold text-white">{fp.data?.title}</h1>

      <div className="mb-7 flex mobile:flex-col">
        <div className="basis-2/3 mobile:basis-auto">
          <p className="mt-6 text-sm text-white/60 ">{fp.data?.description}</p>
        </div>

        <div className="flex basis-1/3 items-end justify-end mobile:mt-8 mobile:basis-auto">
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
          <div className="flex items-center rounded-3xl bg-white/5 p-2">
            <CoinsIcons coins={fp.data?.config.assets || ''} />
          </div>

          <div className="flex gap-2 text-base font-medium">
            <div
              className={`basis-1/2 rounded-full px-4 py-3 text-center ${
                ColorByRisk[rrr || 'Low']
              }`}
            >
              {String(rrr || '') + ' Risk'}
            </div>

            <div className="basis-1/2 rounded-full bg-white/5 px-4 py-3 text-center  text-white/60">
              {fp.data?.config.market_type}
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm font-medium">
            <div className="mb-4 flex justify-between">
              <p className="text-white">Expected Yield (APY)</p>
              <PriceChange
                valueToFixed={false}
                value={Number(fp.data?.profile.expected_yield.replace('%', ''))}
              />
            </div>

            <div className="flex justify-between">
              <p className="text-white">Expected Max Drawdown</p>
              <PriceChange
                bg={false}
                colorize={false}
                valueToFixed={false}
                value={Number(fp.data?.profile.max_drawdown.replace('%', ''))}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm">
            <p className="mb-4 text-white/80">Investment</p>
            <div className="flex items-center justify-between">
              <p className="w-full text-left text-white">
                <span className="text-white/40">Min</span>
                <br />
                <span className="font-medium">
                  {fp.data?.min_deposit}{' '}
                  <span className="text-white/80">{mainQuote}</span>
                </span>
              </p>
              <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
              <p className="w-full text-right text-white">
                <span className="text-white/40">Max</span>
                <br />
                <span className="font-medium">
                  {fp.data?.max_deposit}{' '}
                  <span className="text-white/80">{mainQuote}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-3xl bg-white/5 p-6 text-sm text-white/60">
        <div className="flex gap-4">
          <Attention className="shrink-0" />
          <div>
            This website contains forward-looking statements. Such
            forward-looking statements are based on estimates, assumptions and
            presumptions that Wisdomise (Switzerland) AG believes are reasonable
            at this time. These forward-looking statements are inherently
            subject to risks and uncertainties as they relate to future events.
            Therefore, it is possible that actual events, including the
            performance of cryptocurrencies, may differ materially from those
            forecast. You should also note that past events and results are no
            guarantee of future events or results. Wisdomise (Switzerland) AG or
            any other person does not guarantee that the developments described
            on this website will occur. The User should therefore not base their
            investment decision with regard to the services offered by Wisdomise
            (Switzerland) AG on the forward-looking statements expressed on this
            website.
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductCatalogDetail;
