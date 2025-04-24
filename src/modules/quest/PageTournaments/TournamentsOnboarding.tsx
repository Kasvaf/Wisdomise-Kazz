import { type PropsWithChildren } from 'react';
import { useUserStorage } from 'api/userStorage';
import PageWrapper from 'modules/base/PageWrapper';
import Button from 'shared/Button';
import { ReactComponent as IconStar } from 'modules/quest/PageTournaments/images/star.svg';

export default function TournamentsOnboarding({ children }: PropsWithChildren) {
  const { value, save, isLoading } = useUserStorage('tournament-onboarding');

  return (
    <PageWrapper loading={isLoading}>
      {value === null ? (
        <div className="">
          {/* <img */}
          {/*   src={onboardingBg} */}
          {/*   alt="" */}
          {/*   className="fixed inset-y-0 end-0 start-0 z-20 hidden h-screen w-full object-cover mobile:block" */}
          {/* /> */}

          <div className="bottom-24 start-0 z-30 mx-auto max-w-96 px-6 text-center mobile:fixed">
            <h1 className="mb-4 text-lg font-semibold">
              The Tournament Begins!
            </h1>
            <p className="mb-10">
              Compete for stellar rewards and claim your share of the prize
              pool. Join now!
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
        children
      )}
    </PageWrapper>
  );
}
