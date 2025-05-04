import { useHasFlag } from 'api';
import { useTournaments } from 'api/tournament';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Referral from 'modules/quest/PageQuests/Referral';
import League from 'modules/quest/PageQuests/League';
import DailyTrade from 'modules/quest/PageQuests/DailyTrade';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import Tournaments from './Tournament';

export default function PageQuests() {
  const { isLoading } = useTournaments();
  const isMobile = useIsMobile();
  const hasFlag = useHasFlag();

  return (
    <PageWrapper
      footer={null}
      hasBack
      title="Earn & Win"
      loading={isLoading}
      extension={!isMobile && <CoinExtensionsGroup />}
    >
      <PageTitle
        className="py-5"
        title="Earn & Win"
        description="Complete Quests and Earn Rewards."
      />

      <div className="grid grid-cols-2 gap-4 mobile:grid-cols-1">
        {hasFlag('/trader/quests/daily') && (
          <DailyTrade className="shrink-0 grow" />
        )}
        {hasFlag('/trader/quests/league') && <League />}
        {hasFlag('/account/referral') && <Referral className="shrink-0 grow" />}
        {hasFlag('/trader/quests/tournaments') && (
          <Tournaments className="shrink-0 grow" />
        )}
      </div>
    </PageWrapper>
  );
}
