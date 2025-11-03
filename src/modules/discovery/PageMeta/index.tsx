import PageWrapper from 'modules/base/PageWrapper';
import { useDiscoveryBackdropParams } from 'modules/discovery/lib';
import type { MetaTab } from 'modules/discovery/PageMeta/lib';
import MetaList from 'modules/discovery/PageMeta/MetaList';
import { useEffect, useState } from 'react';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageTitle } from 'shared/PageTitle';
import { Checkbox } from 'shared/v1-components/Checkbox';

export type MetaFilters = Record<
  MetaTab,
  {
    minTotalVolume?: number;
    maxTotalVolume?: number;
    minTotalMarketCap?: number;
    maxTotalMarketCap?: number;
  }
>;

export default function PageMeta() {
  const [skipSimilar, setSkipSimilar] = useState(false);
  const [backdropParams, setBackdropParams] = useDiscoveryBackdropParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (backdropParams) {
      setBackdropParams({
        list: 'trench',
      });
    }
  }, []);

  return (
    <PageWrapper extension={<CoinExtensionsGroup />}>
      <div className="grid h-[calc(var(--desktop-content-height)-1.5rem)] max-h-[calc(var(--desktop-content-height)-1.5rem)] grid-cols-3 gap-3">
        <div className="col-span-3 flex h-max justify-between">
          <PageTitle title="Meta" />
          <Checkbox
            className="ml-auto shrink-0"
            label="Skip Similar Groups"
            onChange={setSkipSimilar}
            size="md"
            value={skipSimilar}
          />
        </div>
        <MetaList skipSimilar={skipSimilar} tab="new" title="New Meta" />
        <MetaList skipSimilar={skipSimilar} tab="trend" title="Trend" />
        <MetaList skipSimilar={skipSimilar} tab="high_mc" title="High MC" />
      </div>
    </PageWrapper>
  );
}
