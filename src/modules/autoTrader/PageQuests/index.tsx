import { useHasFlag } from 'api';
import { useTournaments } from 'api/tournament';
import PageWrapper from 'modules/base/PageWrapper';
import Tournaments from 'modules/insight/PageHome/components/HomeMobile/Tournaments';
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
