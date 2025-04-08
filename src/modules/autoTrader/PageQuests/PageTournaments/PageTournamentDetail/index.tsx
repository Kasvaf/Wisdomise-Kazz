import { useUserStorage } from 'api/userStorage';
import PageWrapper from 'modules/base/PageWrapper';
import TournamentDetail from './TournamentDetail';
import TournamentsOnboarding from './TournamentsOnboarding';

export default function PageTournamentDetail() {
  const {
    value,
    save,
    isLoading: tourStateLoading,
  } = useUserStorage('tournament-onboarding');

  return value == null ? (
    <PageWrapper loading={tourStateLoading}>
      <TournamentsOnboarding onJoinClick={() => save('true')} />
    </PageWrapper>
  ) : (
    <TournamentDetail />
  );
}
