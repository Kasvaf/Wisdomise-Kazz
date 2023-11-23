import PageWrapper from 'modules/base/PageWrapper';
import { useDefiProjectsQuestionPool } from 'api/staking';
import ProtocolInfo from './sections/ProtocolInfo';
import { AthenaProvider } from './sections/ask/athena/AthenaProvider';
import AskSection from './sections/ask';
import PoolsTable from './sections/PoolsTable';
import useProtocolInfo from './useProtocolInfo';

export default function PageProtocolDetails() {
  const protocol = useProtocolInfo();
  const questionPool = useDefiProjectsQuestionPool();

  return (
    <PageWrapper loading={protocol.isLoading || questionPool.isLoading}>
      <section className="flex gap-5 mobile:flex-col">
        <div className="basis-2/3 rounded-xl bg-black/20 p-4 mobile:order-2">
          <AthenaProvider>
            <AskSection />
          </AthenaProvider>
        </div>
        <div className="basis-1/3 mobile:order-1 mobile:mt-2">
          <ProtocolInfo />
        </div>
      </section>
      <PoolsTable />
    </PageWrapper>
  );
}
