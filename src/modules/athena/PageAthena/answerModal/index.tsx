import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { useAthena } from 'modules/athena/core';
import { useAthenaFloat } from 'modules/base/Container/AthenaFloat/AthenaFloatProvider';
import closeIcon from '../images/closeAthena.svg';
import { Answer } from './Answer';
import { ContextSources } from './ContextSources';
import { NewQuestions } from './NewQuestion';
import { RelatedQuestions } from './RelatedQuestions';
import { WidgetsColumn } from './WidgetsColumn';

export const AthenaModal = ({ isFloat }: { isFloat?: boolean }) => {
  const isMobile = useIsMobile();
  const { isOpen: isFloatOpen } = useAthenaFloat();
  const { isLoading, question, abort, setQuestion } = useAthena();
  const { value: isOpen, setTrue: open, setFalse: close } = useBoolean();

  useEffect(() => {
    if (question) {
      open();
      document.body.style.overflow = 'hidden';
    }
  }, [open, isLoading, question]);

  useEffect(() => {
    if (isFloat) {
      document.body.style.overflow = isFloatOpen ? 'hidden' : 'unset';
    }
  }, [isFloat, isFloatOpen]);

  const onClose = () => {
    abort?.();
    close();
    setQuestion('');
    document.body.style.overflow = 'unset';
  };

  const closeICon = (
    <img
      src={closeIcon}
      alt="close"
      className="w-10 cursor-pointer"
      onClick={onClose}
    />
  );

  return (
    <div
      className={clsx(
        'z-40 grid grid-cols-[1fr_1fr] p-6 pr-0',
        'invisible absolute h-[calc(100vh-8.5rem)] w-full rounded-3xl bg-[#343942] opacity-0 transition-opacity duration-500',
        isOpen && '!visible !opacity-100',
        'mobile:fixed mobile:bottom-0 mobile:top-[unset] mobile:block mobile:h-full mobile:w-[100vw] mobile:rounded-none',
        'no-scrollbar mobile:overflow-hidden mobile:px-6 mobile:py-16',
        isFloat && '!bg-transparent',
        isFloat && !isFloatOpen && '!invisible opacity-0',
      )}
    >
      <div
        className={clsx(
          'absolute left-6 top-6 flex origin-right -translate-x-full -rotate-90 items-center gap-2 text-xs tracking-tighter',
          'mobile:!translate-x-0 mobile:rotate-0 ',
        )}
      >
        <div className="real-time-data h-2 w-2 rounded-full text-xs" />
        Real-Time Data
      </div>

      <div className="hidden mobile:absolute mobile:right-5 mobile:top-0 mobile:flex mobile:h-16 mobile:w-full mobile:items-center mobile:justify-end">
        {closeICon}
      </div>

      <section className="no-scrollbar flex flex-col gap-8 overflow-auto pl-5 mobile:h-full mobile:overflow-auto mobile:pb-16 mobile:pl-0">
        <p className="text-3xl font-bold mobile:text-2xl">{question}</p>
        <Answer />
        {isMobile && <WidgetsColumn />}
        <ContextSources />
        <RelatedQuestions />
        <NewQuestions />
      </section>

      {!isMobile && <WidgetsColumn />}

      <div className="absolute right-4 top-4 mobile:hidden">{closeICon}</div>
    </div>
  );
};
