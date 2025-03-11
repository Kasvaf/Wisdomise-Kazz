import { useHasFlag } from 'api';
import { useTournaments } from 'api/tournament';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Referral from 'modules/quest/PageQuests/Referral';
import League from 'modules/quest/PageQuests/League';
import DailyTrade from './DailyTrade';
import Tournaments from './Tournament';

export default function PageQuests() {
  const { isLoading } = useTournaments();
  const hasFlag = useHasFlag();

  return (
    <PageWrapper loading={isLoading}>
      <PageTitle
        className="py-5"
        title="Quests"
        description="Complete Quests and Earn Rewards."
      />
      {hasFlag('/trader-quests/daily') && <DailyTrade />}
      {hasFlag('/trader-quests/league') && <League />}
      {hasFlag('/account/referral') && <Referral />}
      {hasFlag('/trader-quests/tournaments') && <Tournaments />}
    </PageWrapper>
  );
}
