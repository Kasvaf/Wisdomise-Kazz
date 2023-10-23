import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateStrategyMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import PageWrapper from 'modules/base/PageWrapper';
import MarketSelector from 'modules/account/MarketSelector';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import TitleHint from './TitleHint';

export default function PageStrategyCreate() {
  const [showErrors, setShowErrors] = useState(false);
  const [name, setName] = useState('');
  const [market, setMarket] = useState('SPOT');
  const [tags, setTags] = useState('');

  const { mutateAsync, isLoading } = useCreateStrategyMutation();
  const navigate = useNavigate();

  const onCreateHandler = useCallback(async () => {
    setShowErrors(true);
    if (!name) return;

    try {
      const { key } = await mutateAsync({
        name,
        market_name: market as any,
        tags: tags.split(/[\s,]+/).filter(Boolean),
      });
      navigate(`/app/strategy/${key}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  }, [mutateAsync, navigate, market, name, tags]);

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
              className="basis-2/3"
              value={name}
              onChange={setName}
              error={showErrors && !name && 'This field is required.'}
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
