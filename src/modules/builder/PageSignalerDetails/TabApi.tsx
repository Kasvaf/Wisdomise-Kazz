import { bxDownload, bxLinkExternal } from 'boxicons-quasar';
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
    <section className="mt-8 flex gap-10">
      <div className="flex w-1/2 grow-0 basis-1/2 flex-col gap-8">
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

        <Card className="flex items-center gap-4 !py-4">
          <TitleHint title="Documentation">
            API documentation is a set of readable instructions for using and
            integrating with an API
          </TitleHint>
          <Button className="shrink-0">
            <span className="mr-2">Documentation</span>
            <Icon name={bxLinkExternal} />
          </Button>
        </Card>

        <Card className="flex items-center gap-4 !py-4">
          <TitleHint title="SDK">
            Download the SDK to get the tools and resources you need to create
            apps for your desired platform.
          </TitleHint>
          <Button className="shrink-0">
            <span className="mr-2">Download SDK</span>
            <Icon name={bxDownload} />
          </Button>
        </Card>
      </div>

      <div className="flex w-1/2 grow-0 basis-1/2 flex-col gap-8">
        <div>
          <TitleHint title="Signaler API">
            {
              'Copy the Signaler snippet and paste it in the <head> of your website.'
            }
          </TitleHint>

          <Card className="mt-4 overflow-x-scroll !py-4">
            <pre>{signaler.signal_api_call_example}</pre>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TabApi;
