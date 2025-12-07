import { clsx } from 'clsx';
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import { ReactComponent as ArrowDown } from './arrow-down.svg';

export const Expandable: FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ className, children }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    setHasOverflow(
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight,
    );
  }, []);

  return (
    <div
      className={clsx(
        className,
        'relative overflow-hidden',
        isOpen && '!h-auto !max-h-full',
      )}
      ref={ref}
    >
      {children}
      {hasOverflow && !isOpen && (
        <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-b from-transparent to-[#25262d]">
          <hr className="absolute bottom-3 left-0 w-full opacity-30" />
          <Button
            className="-translate-x-1/2 !border !border-white/30 !bg-[#25262D] hover:!bg-[#3c3d47] absolute bottom-0 left-1/2 h-6 px-8 text-xs max-md:px-3"
            contentClassName="font-light text-white/50 flex flex-row gap-2 whitespace-nowrap"
            onClick={() => setIsOpen(true)}
            size="manual"
            variant="alternative"
          >
            {t('common:show-more')} <ArrowDown />
          </Button>
        </div>
      )}
    </div>
  );
};
