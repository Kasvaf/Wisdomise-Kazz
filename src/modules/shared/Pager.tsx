import { clsx } from 'clsx';
import { type PropsWithChildren, useCallback } from 'react';
import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import Icon from './Icon';

type Handler = (p: number) => void;
interface Props {
  total: number;
  active: number;
  onChange?: Handler;
  className?: string;
}

const PageItem: React.FC<
  PropsWithChildren<{
    page: number;
    onClick?: Handler;
    className?: string;
  }>
> = ({ page, onClick, className, children }) => {
  const h = useCallback(() => {
    onClick?.(page);
  }, [page, onClick]);

  return (
    <div
      onClick={h}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-full bg-white/10 p-2',
        'shrink-0 text-xs',
        'cursor-pointer hover:bg-white/30',
        'border border-transparent hover:border-white/40',
        className,
      )}
    >
      {children}
    </div>
  );
};

const Pager: React.FC<Props> = ({ total, active, onChange, className }) => {
  const pages: Array<number | undefined> = [1];
  const addPage = (p: number) => {
    if (p < 1 || p > total) return;
    const last = pages.at(-1);
    if (!last || last < p) pages.push(p);
  };

  if (active > 3) pages.push(undefined);
  addPage(active - 1);
  addPage(active);
  addPage(active + 1);
  if (active < total - 2) pages.push(undefined);
  addPage(total);

  return (
    <div
      className={clsx(
        'flex select-none items-center gap-2 text-white',
        className,
      )}
    >
      {active > 2 && (
        <PageItem onClick={onChange} page={active - 1}>
          <Icon name={bxChevronLeft} size={16} />
        </PageItem>
      )}

      {pages.map((p, ind) =>
        p ? (
          <PageItem
            key={ind}
            onClick={onChange}
            page={p}
            className={clsx(active === p && '!bg-secondary/40')}
          >
            {p}
          </PageItem>
        ) : (
          <div key={ind}>...</div>
        ),
      )}

      {active < total - 1 && (
        <PageItem onClick={onChange} page={active + 1}>
          <Icon name={bxChevronRight} size={16} />
        </PageItem>
      )}
    </div>
  );
};

export default Pager;
