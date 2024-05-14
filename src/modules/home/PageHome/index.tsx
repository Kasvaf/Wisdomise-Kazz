import PageWrapper from 'modules/base/PageWrapper';
import {
  useFinancialProductsQuery,
  useInvestorAssetStructuresQuery,
} from 'api';
import { useUserSignalQuery } from 'api/notification';

import GuideSection from './GuideSection';
import WsdmSection from './WsdmSection';
import InsightSection from './InsightSection';
import PassiveIncomeSection from './PassiveIncomceSection';

export default function HomePage() {
  const userSignals = useUserSignalQuery();
  const ias = useInvestorAssetStructuresQuery();
  const financialProducts = useFinancialProductsQuery({ page: 1 });

  return (
    <PageWrapper
      loading={
        financialProducts.isLoading || ias.isLoading || userSignals.isLoading
      }
    >
      <GuideSection />
      <WsdmSection />
      <InsightSection />
      <PassiveIncomeSection />
    </PageWrapper>
  );
}
