import { useCallback, useRef, useState } from 'react';
import { clsx } from 'clsx';
import useModal from 'shared/useModal';
import Button from 'shared/Button';

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

      <div className="flex justify-center border-t border-white/10 pt-5">
        <Button
          onClick={useCallback(() => onResolve?.(true), [onResolve])}
          disabled={!isScrolledToEnd}
        >
          I have read and accept the {title}.
        </Button>
      </div>
    </div>
  );
}

export default function useModalContract(
  p: Omit<IProps, 'onResolve'>,
): [JSX.Element, () => Promise<boolean>] {
  const [Component, update] = useModal(ModalContract, {
    width: '80ch',
    centered: true,
  });
  return [Component, async () => Boolean(await update(p))];
}
