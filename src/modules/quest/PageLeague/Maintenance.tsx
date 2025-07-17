import { useNavigate } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import { Button } from 'shared/v1-components/Button';

export default function LeagueMaintenance() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="m-10 mx-auto max-w-xl flex-col items-center justify-center text-white/70 md:text-justify">
        <h1 className="mb-10 text-2xl font-medium text-white">
          We’re Upgrading Your Experience
        </h1>
        <p>
          We’re making some changes to our gamification system — including the
          League. As part of this, the current League format will be paused.
          We’ll be back soon with a new and improved rewards system that brings
          even more value and excitement. Thanks for being part of the journey.
          Stay tuned.
        </p>
        <Button
          className="mt-10"
          variant="outline"
          onClick={() => navigate('/trader/quests')}
        >
          Back to Earn & Win
        </Button>
      </div>
    </PageWrapper>
  );
}
