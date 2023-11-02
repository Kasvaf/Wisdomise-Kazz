import { useState } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { type Resolution, useCreateStrategyMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import { type MarketTypes } from 'api/types/financialProduct';
import PageWrapper from 'modules/base/PageWrapper';
import MarketSelector from 'modules/account/MarketSelector';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import TitleHint from './TitleHint';
import ResolutionSelector from './ResolutionSelector';

export default function PageStrategyCreate() {
  const [showErrors, setShowErrors] = useState(false);
  const [name, setName] = useState('');
  const [market, setMarket] = useState<MarketTypes>('SPOT');
  const [resolution, setResolution] = useState<Resolution>('1m');
  const [tags, setTags] = useState('');

  const { mutateAsync, isLoading } = useCreateStrategyMutation();
  const navigate = useNavigate();

  const onCreateHandler = async () => {
    setShowErrors(true);
    if (!name) return;

    try {
      const { key } = await mutateAsync({
        name,
        market_name: market,
        resolution,
        tags: tags.split(/[\s,]+/).filter(Boolean),
      });
      navigate(`/app/strategy/${key}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Create New Strategy</h1>

      <Card>
        <section>
          <TitleHint className="ml-3" title="Strategy Name">
            Pick a name to help you identify this strategy.
          </TitleHint>

          <div className="mt-4 flex max-w-4xl gap-6">
            <TextBox
              placeholder="Strategy Name"
              className="basis-3/5"
              value={name}
              onChange={setName}
              error={showErrors && !name && 'This field is required.'}
            />

            <MarketSelector
              selectedItem={market}
              onSelect={setMarket}
              className="basis-1/5"
            />

            <ResolutionSelector
              selectedItem={resolution}
              onSelect={setResolution}
              className="basis-1/5"
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
              className="basis-2/3"
              value={tags}
              onChange={setTags}
            />
          </div>
        </section>

        <section className="mt-12">
          <Button onClick={onCreateHandler} loading={isLoading}>
            Create Strategy
          </Button>
        </section>
      </Card>
    </PageWrapper>
  );
}
