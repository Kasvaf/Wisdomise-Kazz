import { clsx } from 'clsx';
import { type KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAthena, useRemainQuestionsCount } from 'modules/athena/core';
import generateIcon from '../images/generate.svg';
import newQuestionIcon from '../images/newQuestion.svg';

export const NewQuestions = () => {
  const { t } = useTranslation('athena');
  const remains = useRemainQuestionsCount();
  const [question, setQuestion] = useState('');
  const { askQuestion, leftQuestions, isAnswerFinished } = useAthena();

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (question.length > 0) {
        askQuestion(question.trim());
        setQuestion('');
      }
      e.preventDefault();
    }
  };

  if (!isAnswerFinished) return null;

  return (
    <section className="border-t border-white/30 pt-8">
      <p className="mb-4 flex items-center gap-4 text-xl text-white/50">
        <img src={newQuestionIcon} alt="new question" /> {t('new-question')}
      </p>

      <div className="relative h-36">
        <textarea
          onKeyDown={onKeyDown}
          disabled={leftQuestions <= 0}
          onChange={e => setQuestion(e.target.value)}
          placeholder={t('input-placeholder')}
          className="h-full w-full resize-none rounded-2xl bg-black/40 p-6 text-white/50 caret-[#FF29C3] outline-none"
        />
        <div className="pl-3 text-sm font-light text-white/50">{remains}</div>
        <button
          onClick={() => {
            askQuestion(question.trim());
            setQuestion('');
          }}
          className={clsx(
            'rounded-lg border border-white/30 px-4 py-1 leading-7 transition hover:bg-white/10',
            'invisible absolute bottom-5 right-5 flex items-center gap-2 opacity-0 duration-300',
            question.trim() && '!visible !opacity-100',
          )}
        >
          <img src={generateIcon} alt="generate" />
          {t('generate')}
        </button>
      </div>
    </section>
  );
};
