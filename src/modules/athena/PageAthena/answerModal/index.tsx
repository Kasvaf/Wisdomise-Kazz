import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { useAthena } from 'modules/athena/core';
import closeIcon from '../images/closeAthena.svg';
import { Answer } from './Answer';
import { ContextSources } from './ContextSources';
import { NewQuestions } from './NewQuestion';
import { RelatedQuestions } from './RelatedQuestions';
import { WidgetsColumn } from './WidgetsColumn';

export const AthenaModal = () => {
  const isMobile = useIsMobile();
  const { isLoading, question, abort, setQuestion } = useAthena();
  const { value: isOpen, setTrue: open, setFalse: close } = useBoolean();

  useEffect(() => {
    if (question) {
      open();
      document.body.style.overflow = 'hidden';
    }
  }, [open, isLoading, question]);

  const onClose = () => {
    abort?.();
    close();
    setQuestion('');
    document.body.style.overflow = 'unset';
  };

  return (
    <div
      className={clsx(
        'z-40 grid grid-cols-[fit-content(40px)_1fr_1.1fr] p-6 pr-0',
        'invisible absolute h-[calc(100vh-8.5rem)] w-full rounded-3xl bg-[#343942] opacity-0 transition-opacity duration-500',
        isOpen && '!visible !opacity-100',
        'mobile:fixed mobile:bottom-0 mobile:top-[unset] mobile:block mobile:h-[calc(100dvh-80px)] mobile:w-[100vw] mobile:rounded-b-none',
        'no-scrollbar mobile:overflow-auto mobile:px-6 mobile:pt-0',
      )}
    >
      <div className="mobile:sticky mobile:top-[-2px] mobile:z-10 mobile:bg-[#343942] mobile:pb-2 mobile:pt-4">
        <img
          src={closeIcon}
          alt="close"
          className="w-10 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <section className="no-scrollbar flex flex-col gap-8 overflow-auto pl-5 mobile:overflow-visible mobile:pb-4 mobile:pl-0">
        <p className="text-3xl font-bold mobile:text-2xl">{question}</p>
        <Answer />
        {isMobile && <WidgetsColumn />}
        <ContextSources />
        <RelatedQuestions />
        <NewQuestions />
      </section>

      {!isMobile && <WidgetsColumn />}
    </div>
  );
};
