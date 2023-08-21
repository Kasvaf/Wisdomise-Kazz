import { useCallback, useRef, useState } from 'react';
import { clsx } from 'clsx';
import useModal from 'modules/shared/useModal';

interface IProps {
  title: string;
  ContractDoc: React.FC;
  onResolve?: (confirmed: boolean) => void;
}

function ModalContract({ title, ContractDoc, onResolve }: IProps) {
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollableRef.current == null) return;

    const { clientHeight, scrollTop, scrollHeight } = scrollableRef.current;
    if (scrollTop + clientHeight + 300 > scrollHeight) {
      setScrolledToEnd(true);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-white">{title}</h1>
      <div className="h-2 border-b border-white/10" />

      <div
        className="h-[30rem] overflow-auto"
        style={{ maxHeight: 'calc(100vh - 180px)' }}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        <div
          className={clsx(
            'prose prose-invert',
            'prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-1 prose-h2:text-xl',
            'prose-h3:text-base',
            'prose-em:not-italic prose-em:text-warning',
          )}
        >
          <ContractDoc />
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <button
          onClick={useCallback(() => onResolve?.(true), [onResolve])}
          disabled={!isScrolledToEnd}
          className="w-full rounded-full border-none bg-white px-9 py-3 text-base text-black disabled:bg-gray-main disabled:text-[#cccc] md:px-14 md:py-3 md:text-xl"
        >
          I have read and accept the {title}.
        </button>
      </div>
    </div>
  );
}

export default function useModalContract(
  p: Omit<IProps, 'onResolve'>,
): [React.FC, () => Promise<boolean>] {
  const [Component, update] = useModal(ModalContract, {
    width: '80ch',
    centered: true,
  });
  return [Component, async () => Boolean(await update(p))];
}
