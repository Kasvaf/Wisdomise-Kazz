import { clsx } from 'clsx';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAthena } from '../core/AthenaProvider';
import { useRemainQuestionsCount } from '../core';
import generateIcon from './images/generate.svg';

export const FirstAskInput = () => {
  const { t } = useTranslation('athena');
  const remains = useRemainQuestionsCount();
  const [question, setQuestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { askQuestion, leftQuestions, question: athenaQuestion } = useAthena();

  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      if (question.length > 0) {
        askQuestion(question.trim());
        setQuestion('');
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  return (
    <div
      className={clsx(
        'w-3/4 mobile:w-[calc(100vw-3rem)]',
        athenaQuestion && 'invisible opacity-0',
      )}
    >
      <div className="relative h-[71px] mobile:h-auto">
        <input
          ref={inputRef}
          value={question}
          onKeyDown={onKeyDown}
          disabled={leftQuestions <= 0}
          onChange={e => setQuestion(e.target.value)}
          placeholder={t('input-placeholder')}
          className={clsx(
            'h-full w-full rounded-2xl bg-black/40 pl-10 pr-40 text-white/50 caret-[#FF29C3] outline-none',
            'mobile:hidden',
            leftQuestions <= 0 && 'placeholder:text-white/10',
          )}
        />

        <textarea
          value={question}
          onKeyDown={onKeyDown}
          disabled={leftQuestions <= 0}
          onChange={e => setQuestion(e.target.value)}
          placeholder={t('input-placeholder')}
          className={clsx(
            'h-full w-full resize-none rounded-2xl bg-black/40 pl-10 pr-40 text-white/50 caret-[#FF29C3] outline-none',
            'hidden mobile:block mobile:h-[140px] mobile:!p-7',
          )}
        />
        <button
          onClick={() => {
            askQuestion(question.trim());
            setQuestion('');
          }}
          className={clsx(
            'rounded-lg border border-white/30 px-4 py-1 leading-7 transition hover:bg-white/10',
            'invisible absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-2 opacity-0 duration-300',
            'mobile:!top-[unset] mobile:bottom-4 mobile:right-4 mobile:translate-y-[unset]',
            question && '!visible !opacity-100',
          )}
        >
          <img src={generateIcon} alt="generate" />
          {t('generate')}
        </button>
      </div>
      <div className="pl-3 pt-1 text-sm font-light text-white/50">
        {remains}
      </div>
      {
        // remove visible and hide on animation end
      }
    </div>
  );
};
