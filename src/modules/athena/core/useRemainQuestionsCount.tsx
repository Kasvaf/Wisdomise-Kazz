import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useSubscription } from 'api';
import { useAthena } from './AthenaProvider';

export const useRemainQuestionsCount = () => {
  const { leftQuestions } = useAthena();
  const { isTrialPlan } = useSubscription();

  let text = (
    <Trans ns="athena" i18nKey="enjoy-remain-question" count={leftQuestions}>
      Enjoy your remaining {{ leftQuestions }} question
    </Trans>
  );

  if (leftQuestions <= 0) {
    if (isTrialPlan) {
      text = (
        <Trans i18nKey="trial-limit" ns="athena">
          <span>
            Trial Question limit reached,{' '}
            <NavLink
              to="/account/billing"
              className="text-white underline underline-offset-4 hover:cursor-pointer"
            >
              Subscribe to continue
            </NavLink>
          </span>
        </Trans>
      );
    }
    if (!isTrialPlan) {
      text = (
        <span>
          <Trans i18nKey="question-limit" ns="athena">
            Question limit reached.{' '}
            <NavLink
              to="/account/billing"
              className="text-white underline underline-offset-4 hover:cursor-pointer"
            >
              Upgrade your plan to continue
            </NavLink>
          </Trans>
        </span>
      );
    }
  }

  return text;
};
