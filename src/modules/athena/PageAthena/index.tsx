import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useAccountQuery, useChatAppProfile, useLandingQuestions } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { AthenaProvider } from '../core/AthenaProvider';
import { FirstAskInput } from './FirstAskInput';
import { AthenaModal } from './answerModal';
import { BotAlertProvider } from './botAlert/BotAlertProvider';
import { BotAlertMessages } from './botAlert/BotAlertMessages';
import './styles.css';
import { PredefinedQuestions } from './PredefinedQuestions';

export default function PageAthena() {
  const user = useAccountQuery();
  const { t } = useTranslation('athena');
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
          <BotAlertProvider>
            <section className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 mobile:gap-10">
              <section className="mt-4 text-center mobile:mt-10">
                <p className="text-2xl font-light tracking-[-1.4px] text-white/80 mobile:text-xl">
                  {t('heading.title')}
                </p>
                <p className="mt-6 text-5xl font-bold !leading-[137%] tracking-[-2.8px] text-white/90 mobile:text-3xl mobile:!leading-[200%] mobile:tracking-[-1.8px]">
                  <Trans i18nKey="heading.second-title" ns="athena">
                    Navigating Crypto with AI <br /> Chat
                  </Trans>{' '}
                  <span className="text-wsdm-gradient">
                    {t('heading.second-title-word1')}
                  </span>
                </p>
              </section>

              <FirstAskInput />
              <PredefinedQuestions />
              <AthenaModal />
            </section>
            <BotAlertMessages />
          </BotAlertProvider>
        </AthenaProvider>
      </div>
    </PageWrapper>
  );
}
