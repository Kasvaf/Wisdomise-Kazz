import PageWrapper from 'modules/base/PageWrapper';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';

export default function PageStrategyCreate() {
  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Create New Strategy</h1>

      <Card>
        <section>
          <div className="ml-3">
            <h2 className="text-base font-semibold">Strategy Name</h2>
            <div className="mt-2 text-sm text-white/60">
              Pick a name to help you identify this strategy.
            </div>
          </div>

          <div className="mt-4 flex max-w-xl gap-6">
            <TextBox
              placeholder="Strategy Name"
              value=""
              className="basis-2/3"
            />
            <TextBox
              placeholder="Select Market"
              value=""
              className="basis-1/3"
            />
          </div>
        </section>

        <section className="mt-12">
          <div className="ml-3">
            <h2 className="text-base font-semibold">Labels & Tags</h2>
            <div className="mt-2 text-sm text-white/60">
              Set labels to help organize and filter your sources, as well as
              enforce more granular access permissions.
            </div>
          </div>

          <div className="mt-4 flex max-w-xl gap-6">
            <TextBox
              placeholder="Strategy tags"
              value=""
              className="basis-2/3"
            />
          </div>
        </section>

        <section className="mt-12">
          <Button>Create Strategy</Button>
        </section>
      </Card>
    </PageWrapper>
  );
}
