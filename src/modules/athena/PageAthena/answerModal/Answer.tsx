import { useTranslation } from 'react-i18next';
import { useAthena } from 'modules/athena/core';
import answerIcon from '../images/answer.svg';
import { ThinkingLoading } from './Thinking';

export const Answer = () => {
  const { answer } = useAthena();
  const { t } = useTranslation('athena');

  return (
    <section>
      <p className="mb-4 flex gap-4 text-xl text-white/50">
        <img src={answerIcon} alt="answer" />
        {t('answer')}
      </p>
      {!answer && <ThinkingLoading />}
      <div
        className="text-base leading-6 mobile:text-sm"
        dangerouslySetInnerHTML={{
          __html: answer.replaceAll('<br><br>', '<br/><br/>'),
        }}
      />
    </section>
  );
};
