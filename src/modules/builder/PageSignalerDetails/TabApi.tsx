import { bxLinkExternal } from 'boxicons-quasar';
import { useParams } from 'react-router-dom';
import { useSignalerQuery } from 'api/builder';
import CopyInputBox from 'shared/CopyInputBox';
import Spinner from 'shared/Spinner';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import TitleHint from '../TitleHint';

const TabApi = () => {
  const params = useParams<{ id: string }>();
  const { data: signaler, isLoading } = useSignalerQuery(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!signaler) return null;

  return (
    <section className="mt-8 flex gap-10 mobile:flex-col">
      <div className="flex grow-0 basis-1/2 flex-col gap-8 md:w-1/2">
        <div>
          <TitleHint title="Signaler ID">
            For webhooks and S3 integrations, you can differentiate strategy by
            the strategy id.
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={signaler?.strategy_id} />
          </div>
        </div>

        <div>
          <TitleHint title="Secret Key">
            Use this write key to send data to this strategy from our partners,
            plugins, libraries or REST API.
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={signaler?.secret_key} />
          </div>
        </div>

        <Card className="flex items-center gap-4 !py-4 mobile:flex-col">
          <TitleHint title="Documentation">
            API documentation is a set of readable instructions for using and
            integrating with an API
          </TitleHint>
          <Button className="shrink-0">
            <span className="mr-2">Documentation</span>
            <Icon name={bxLinkExternal} />
          </Button>
        </Card>
      </div>

      <div className="flex grow-0 basis-1/2 flex-col gap-8 md:w-1/2">
        <TitleHint title="Signaler API">
          {
            'Copy the Signaler snippet and paste it in the <head> of your website.'
          }
        </TitleHint>

        <Card className="mt-4 max-w-full overflow-x-scroll !py-4">
          <pre className="max-w-full">{signaler.signal_api_call_example}</pre>
        </Card>
      </div>
    </section>
  );
};

export default TabApi;
