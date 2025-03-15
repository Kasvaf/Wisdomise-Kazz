import { useHasFlag } from 'api';
import { useTournaments } from 'api/tournament';
import PageWrapper from 'modules/base/PageWrapper';
import DailyTradeQuest from 'modules/autoTrader/PageQuests/DailyTradeQuest';
import { PageTitle } from 'shared/PageTitle';
import Referral from 'modules/autoTrader/PageQuests/Referral';
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

      <div className="flex gap-4 mobile:flex-col">
        {hasFlag('/trader-quests/daily') && (
          <DailyTradeQuest className="shrink-0 grow" />
        )}
        <Referral className="shrink-0 grow" />
        {hasFlag('/trader-quests/tournaments') && (
          <Tournaments className="shrink-0 grow" />
        )}
      </div>
    </PageWrapper>
  );
}
