import { clsx } from 'clsx';
import { useLandingQuestions } from 'api';
import { useAthena } from 'modules/athena/core';

export const PredefinedQuestions = () => {
  const questions = useLandingQuestions();
  const { askQuestion, leftQuestions, question } = useAthena();

  return (
    <section
      className={clsx(
        'w-3/4 mobile:w-[calc(100vw-3rem)]',
        question && 'invisible',
      )}
    >
      <section
        className={clsx(
          'no-scrollbar grid grid-cols-3 justify-between gap-10',
          'mobile:flex mobile:w-full mobile:gap-6 mobile:overflow-x-auto',
        )}
      >
        {questions.data?.children.map(sec => (
          <div
            key={sec.title}
            className="flex flex-col gap-5 rounded-2xl bg-black/40 p-6 mobile:w-[75vw]"
          >
            <p className="truncate text-2xl font-bold capitalize tracking-tighter text-white mobile:text-xl">
              {sec.title}
            </p>
            {sec.template_questions.map(item => (
              <button
                key={item.key}
                disabled={leftQuestions <= 0}
                onClick={() => askQuestion(item.template_prompt)}
                className={clsx(
                  'w-fit cursor-pointer whitespace-nowrap rounded-lg bg-white/10 p-3 disabled:cursor-not-allowed mobile:text-sm',
                  'transition-colors hover:bg-white/20',
                  leftQuestions <= 0 && '!text-white/10 hover:!bg-white/10',
                )}
              >
                {item.interface_prompt}
              </button>
            ))}
          </div>
        ))}
      </section>
    </section>
  );
};
