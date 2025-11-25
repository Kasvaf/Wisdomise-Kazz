import PageWrapper from 'modules/base/PageWrapper';
import DailyTrade from 'modules/quest/PageQuests/DailyTrade';
import League from 'modules/quest/PageQuests/League';
import Referral from 'modules/quest/PageQuests/Referral';
import { useHasFlag } from 'services/rest';
import { useTournaments } from 'services/rest/tournament';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageTitle } from 'shared/PageTitle';
import useIsMobile from 'utils/useIsMobile';
import Tournaments from './Tournament';

export default function PageQuests() {
  const { isLoading } = useTournaments();
  const isMobile = useIsMobile();
  const hasFlag = useHasFlag();

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      footer={null}
      hasBack
      loading={isLoading}
      title="Earn & Win"
    >
      <PageTitle
        className="py-5"
        description="Complete Quests and Earn Rewards."
        title="Earn & Win"
      />

      <div className="grid grid-cols-2 mobile:grid-cols-1 gap-4">
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
