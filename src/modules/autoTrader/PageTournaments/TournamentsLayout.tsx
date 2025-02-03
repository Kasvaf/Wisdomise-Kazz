import { Outlet } from 'react-router-dom';
import { useUserStorage } from 'api/userStorage';
import PageWrapper from 'modules/base/PageWrapper';
import Button from 'shared/Button';
import onboardingBg from './images/onboarding-bg.png';
import { ReactComponent as IconStar } from './images/star.svg';

export default function TournamentsLayout() {
  const { value, save, isLoading } = useUserStorage('tournament-onboarding');

  return (
    <PageWrapper loading={isLoading}>
      {value === null ? (
        <div className="">
          <img
            src={onboardingBg}
            alt=""
            className="fixed inset-y-0 end-0 start-0 z-20 h-screen w-full object-cover"
          />
          <div className="fixed bottom-24 start-0 z-30 px-6 text-center">
            <h1 className="mb-4 text-lg font-semibold">
              The Tournament Begins!
            </h1>
            <p className="mb-10">
              Compete for stellar rewards and claim your share of the $10,000
              prize pool. Join now!
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => save('true')}
            >
              <IconStar className="me-2" />
              Join the Cosmic Challenge
            </Button>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </PageWrapper>
  );
}
