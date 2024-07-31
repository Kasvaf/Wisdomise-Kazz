import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { useIsWhalesFetching } from '../useIsWhalesFetching';
import { WhalesTable } from './WhalesTable';
import { CoinsTable } from './CoinsTable';
import { TopCoins } from './TopCoins';
import { WalletInput } from './WalletInput';
import { NetworkSelect } from './NetworkSelect';

export default function PageWhales() {
  const { t } = useTranslation('whale');
  const isFetching = useIsWhalesFetching();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!isFetching) setIsLoading(false);
  }, [isFetching]);

  const [networkAbbreviation, setNetworkAbbrevation] = useState<
    string | undefined
  >(undefined);

  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined,
  );

  const onlyShowWhales = walletAddress || networkAbbreviation;

  return (
    <PageWrapper loading={isLoading} mountWhileLoading>
      <div className="flex flex-col gap-4">
        <div className="mb-2">
          <label className="mb-1 block text-xs opacity-95">
            {t('filters.search-whale')}
          </label>
          <div className="flex items-center gap-2">
            <WalletInput
              value={walletAddress}
              className="w-80 mobile:w-full"
              onChange={setWalletAddress}
            />
            <NetworkSelect
              valueType="abbreviation"
              value={networkAbbreviation}
              onChange={setNetworkAbbrevation}
            />
          </div>
        </div>
        <div className={clsx('contents', onlyShowWhales && 'hidden')}>
          <CoinsTable />
          <hr className="opacity-5" />
        </div>
        <WhalesTable />
        <div className={clsx('contents', onlyShowWhales && 'hidden')}>
          <hr className="opacity-5" />
          <CoinsTable />
          <hr className="opacity-5" />
          <div className="grid grid-cols-2 gap-8 mobile:grid-cols-1">
            <TopCoins signalType="gainer" />
            <TopCoins signalType="loser" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
