import PageWrapper from 'modules/base/PageWrapper';
import { useTournaments } from 'api/tournament';
import Tournaments from 'modules/insight/PageHome/Tournaments';
import { useHasFlag } from 'api';
import DailyTradeQuest from 'modules/autoTrader/PageQuests/DailyTradeQuest';

export default function PageQuests() {
  const { isLoading } = useTournaments();
  const hasFlag = useHasFlag();

  return (
    <PageWrapper loading={isLoading}>
      {hasFlag('/trader-quests/daily') && <DailyTradeQuest />}
      {hasFlag('/trader-quests/tournaments') && <Tournaments />}
    </PageWrapper>
  );
}
