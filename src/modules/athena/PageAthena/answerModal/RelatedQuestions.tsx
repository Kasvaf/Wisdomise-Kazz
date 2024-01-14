import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAthena } from 'modules/athena/core';
import relatedQuestionsIcon from '../images/relatedQuestions.svg';
import arrowSrc from '../images/relatedQuestionsArrow.svg';

export const RelatedQuestions = () => {
  const { t } = useTranslation('athena');
  const { terminationData, askQuestion } = useAthena();

  if (!terminationData) {
    return null;
  }

  return (
    <div className="border-t border-white/30 pt-8">
      <div className="mb-4 flex gap-4 text-xl text-white/50">
        <img src={relatedQuestionsIcon} alt="related question" />
        {t('related-questions')}
      </div>
      <div className="grid grid-cols-1 gap-6 mobile:grid-cols-1">
        {terminationData?.following_questions.map(fq => (
          <div
            key={fq.exact_text}
            onClick={() => askQuestion(fq.exact_text)}
            style={
              {
                '--arrow': `url('${arrowSrc}')`,
              } as unknown as React.CSSProperties
            }
            className={clsx(
              'relative basis-1/2 cursor-pointer rounded-2xl bg-white/10 px-8 py-5 font-bold mobile:text-sm',
              "after:absolute after:right-4 after:top-4 after:h-4 after:w-4 after:bg-[image:var(--arrow)] after:bg-cover after:content-['']",
            )}
          >
            {fq.interface_text}
          </div>
        ))}
      </div>
    </div>
  );
};
