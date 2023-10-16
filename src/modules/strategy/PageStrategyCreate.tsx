import { useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import MarketSelector from 'modules/account/MarketSelector';
import TitleHint from './TitleHint';

export default function PageStrategyCreate() {
  const [market, setMarket] = useState('SPOT');

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Create New Strategy</h1>

      <Card>
        <section>
          <TitleHint className="ml-3" title="Strategy Name">
            Pick a name to help you identify this strategy.
          </TitleHint>

          <div className="mt-4 flex max-w-xl gap-6">
            <TextBox
              placeholder="Strategy Name"
              value=""
              className="basis-2/3"
            />

            <MarketSelector
              selectedItem={market}
              onSelect={setMarket}
              className="basis-1/3"
            />
          </div>
        </section>

        <section className="mt-12">
          <TitleHint className="ml-3" title="Labels & Tags">
            Set labels to help organize and filter your sources, as well as
            enforce more granular access permissions.
          </TitleHint>

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
