import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextBox from 'modules/shared/TextBox';
import { useSubscription } from 'api';
import { ReactComponent as Arrow } from '../../images/arrow-right.svg';
import { useAthena } from './athena/AthenaProvider';

export default function AskInput() {
  const [value, setValue] = useState('');
  const { t } = useTranslation('staking');
  const remainQuestion = useRemainQuestionText();
  const { askQuestion, question, leftQuestions } = useAthena();

  const onKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      askFromAthena();
    }
  };

  const askFromAthena = () => {
    if (value) {
      askQuestion(value);
    }
  };

  useEffect(() => {
    if (question) {
      setValue(question);
    }
  }, [question]);

  return (
    <div className="mt-7">
      <TextBox
        suffix={
          <button onClick={askFromAthena} className="flex">
            <Arrow />
          </button>
        }
        value={value}
        onChange={setValue}
        onKeyDown={onKeydown}
        hint={remainQuestion}
        placeholder={t('ask.input-placeholder')}
        inputClassName="rounded-xl text-sm"
        disabled={leftQuestions <= 0}
      />
    </div>
  );
}

const useRemainQuestionText = () => {
  const { leftQuestions } = useAthena();
  const { t } = useTranslation('staking');
  const { isTrialing, isActive } = useSubscription();

  let text =
    t('ask.remain-questions', { leftQuestions }) +
    (leftQuestions > 1 ? 's' : '');

  if (leftQuestions <= 0) {
    if (isTrialing) {
      text = t('ask.trial-limit');
    }
    if (isActive) {
      text = t('ask.active-limit');
    }
  }

  return text;
};
