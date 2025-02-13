import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Spinner from 'shared/Spinner';
import { type Surface, useSurface } from 'utils/useSurface';
import { ReactComponent as EmptyIcon } from './empty.svg';

export interface MobileTableColumn<RecordType extends object> {
  key: string | number;
  hidden?: boolean;
  width?: string;
  grow?: boolean;
  render: (row: RecordType) => ReactNode;
  className?: string;
}
export function MobileTable<RecordType extends object>({
  dataSource,
  columns,
  className,
  surface = 2,
  rowKey,
  loading,
  onClick,
}: {
  dataSource: RecordType[];
  loading?: boolean;
  className?: string;
  surface?: Surface;
  columns: Array<MobileTableColumn<RecordType>>;
  rowKey: (row: RecordType) => string | number;
  onClick?: (row: RecordType) => void;
}) {
  const colors = useSurface(surface);
  return (
    <div
      style={{
        ['--row-color' as never]: colors.current,
        ['--active-color' as never]: colors.next,
      }}
      className={clsx(
        'flex flex-col gap-2',
        (loading || dataSource.length === 0) &&
          'items-center justify-center px-2 py-10',
        className,
      )}
    >
      {loading ? (
        <Spinner />
      ) : dataSource.length === 0 ? (
        <EmptyIcon className="h-auto w-40" />
      ) : (
        <>
          {dataSource?.map(row => (
            <div
              key={rowKey(row)}
              className={clsx(
                'flex max-w-full flex-nowrap items-center justify-between gap-1 overflow-hidden rounded-lg bg-[--row-color] p-2',
                typeof onClick === 'function' &&
                  'transition-all active:bg-[--active-color]',
              )}
              data-table="tr"
              onClick={() => onClick?.(row)}
              tabIndex={typeof onClick === 'function' ? 0 : -1}
            >
              {columns.map(col => (
                <div
                  key={col.key}
                  className={clsx(
                    col.grow && 'grow',
                    col.hidden && 'hidden',
                    col.width && 'shrink-0',
                    'w-auto',
                    col.className,
                  )}
                  style={{
                    flexBasis: col.width ?? 'auto',
                  }}
                  data-table="td"
                >
                  {col.render(row)}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
