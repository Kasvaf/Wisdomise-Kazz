import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAthena, useRemainQuestionsCount } from 'modules/athena/core';
import TextBox from 'shared/TextBox';
import { ReactComponent as Arrow } from '../../images/arrow-right.svg';

export default function AskInput() {
  const [value, setValue] = useState('');
  const { t } = useTranslation('staking');
  const remainQuestion = useRemainQuestionsCount();
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
