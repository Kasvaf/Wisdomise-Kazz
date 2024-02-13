import { clsx } from 'clsx';
import { useAccountQuery, useChatAppProfile, useLandingQuestions } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { AthenaProvider } from '../core/AthenaProvider';
import { FirstAskInput } from './FirstAskInput';
import { AthenaModal } from './answerModal';
import './styles.css';
import { PredefinedQuestions } from './PredefinedQuestions';
import Header from './Header';

export default function PageAthena({ isFloat }: { isFloat?: boolean }) {
  const user = useAccountQuery();
  const chatappProfile = useChatAppProfile();
  const landingQuestion = useLandingQuestions();
  const isLoading =
    user.isLoading || landingQuestion.isLoading || chatappProfile.isLoading;

  return (
    <PageWrapper loading={isLoading}>
      <div
        className={clsx(
          'min-h-[calc(100vh-7rem)] mobile:min-h-[unset] md:relative',
        )}
      >
        <AthenaProvider>
          <section className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 mobile:gap-10">
            <Header isFloat={isFloat} />
            <FirstAskInput />
            <PredefinedQuestions />
            <AthenaModal isFloat={isFloat} />
          </section>
        </AthenaProvider>
      </div>
    </PageWrapper>
  );
}
