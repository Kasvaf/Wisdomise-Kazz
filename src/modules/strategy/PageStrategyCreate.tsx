import PageWrapper from 'modules/base/PageWrapper';
import Card from 'shared/Card';

export default function PageStrategyCreate() {
  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Create New Strategy</h1>

      <Card>
        <div>Strategy Name</div>
      </Card>
    </PageWrapper>
  );
}
