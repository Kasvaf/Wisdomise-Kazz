import { Switch } from 'antd';
import { useState } from 'react';
import Card from 'modules/shared/Card';
import TextBox from 'modules/shared/TextBox';
import MarketSelector from 'modules/account/MarketSelector';
import Button from 'modules/shared/Button';
import TitleHint from '../TitleHint';
import PartDocs from './PartDocs';

const TabSettings = () => {
  const [market, setMarket] = useState('SPOT');

  return (
    <div className="my-10 flex flex-col gap-10">
      <Card className="flex items-center justify-between">
        <TitleHint title="Strategy Status">
          Enabling this strategy source will allow it to send data into Segment
          and any connected enabled destinations.
        </TitleHint>

        <div>
          <Switch />
        </div>
      </Card>

      <section>
        <TitleHint className="ml-3" title="Strategy Name">
          Pick a name to help you identify this strategy.
        </TitleHint>

        <div className="mt-4 flex max-w-xl gap-6">
          <TextBox placeholder="Strategy Name" value="" className="basis-2/3" />

          <MarketSelector
            selectedItem={market}
            onSelect={setMarket}
            className="basis-1/3"
          />
        </div>
      </section>

      <section>
        <TitleHint className="ml-3" title="Labels & Tags">
          Set labels to help organize and filter your sources, as well as
          enforce more granular access permissions.
        </TitleHint>

        <div className="mt-4 flex max-w-xl gap-6">
          <TextBox placeholder="Strategy tags" value="" className="basis-2/3" />
        </div>
      </section>

      <section className="flex justify-center gap-3">
        <Button>Save</Button>
        <Button variant="secondary">Go to Cockpit</Button>
      </section>

      <hr className="border-white/10" />

      <PartDocs
        strategyId="EMA-20-60-200-Strategy"
        secretKey="EtRvhNrMOgvo7O2ePMUOWxdkGJ4I60A0nxbbq"
      />
    </div>
  );
};

export default TabSettings;
