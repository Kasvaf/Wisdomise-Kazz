import { type FC, useState } from 'react';
import { PageTitle } from 'shared/PageTitle';
import { Checkbox } from 'shared/v1-components/Checkbox';
import type { MetaTab } from './lib';
import MetaList from './MetaList';

export type MetaFilters = Record<
  MetaTab,
  {
    minTotalVolume?: number;
    maxTotalVolume?: number;
    minTotalMarketCap?: number;
    maxTotalMarketCap?: number;
  }
>;

export const Meta: FC<{ expanded?: boolean; focus?: boolean }> = () => {
  const [skipSimilar, setSkipSimilar] = useState(false);

  return (
    <div className="grid h-[calc(var(--content-height)-1.5rem)] max-h-[calc(var(--content-height)-1.5rem)] grid-cols-3 gap-3">
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
  );
};
