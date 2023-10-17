import { bxDownload, bxLinkExternal } from 'boxicons-quasar';
import CopyInputBox from 'modules/shared/CopyInputBox';
import Card from 'modules/shared/Card';
import Button from 'modules/shared/Button';
import Icon from 'modules/shared/Icon';
import TitleHint from '../../TitleHint';

interface Props {
  strategyId: string;
  secretKey: string;
}

const sample = `curl -X POST https://reqbin.com/echo/post/json
     -H 'Content-Type: application/json'
     -d '{"login":"my_login","password":"my_password"}'`;

const PartDocs: React.FC<Props> = ({ strategyId, secretKey }) => {
  return (
    <section className="flex gap-10">
      <div className="flex basis-1/2 flex-col gap-8">
        <div>
          <TitleHint title="Signal API">
            {
              'Copy the Strategy snippet and paste it in the <head> of your website.'
            }
          </TitleHint>

          <Card className="mt-4 !py-4">
            <pre>{sample}</pre>
          </Card>
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

      <div className="flex basis-1/2 flex-col gap-8">
        <div>
          <TitleHint title="Strategy ID">
            For webhooks and S3 integrations, you can differentiate strategy by
            the strategy id.
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={strategyId} />
          </div>
        </div>

        <div>
          <TitleHint title="Secret Key">
            Use this write key to send data to this strategy from our partners,
            plugins, libraries or REST API.
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={secretKey} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartDocs;
