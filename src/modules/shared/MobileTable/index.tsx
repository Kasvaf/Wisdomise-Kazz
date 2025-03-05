import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Spinner from 'shared/Spinner';
import { type Surface, useSurface } from 'utils/useSurface';
import { ReactComponent as EmptyIcon } from './empty.svg';

export interface MobileTableColumn<RecordType extends object> {
  key: string | number;
  hidden?: boolean;
  render: (row: RecordType) => ReactNode;
  className?: string;
}
export function MobileTable<RecordType extends object>({
  dataSource,
  columns,
  className,
  rowClassName,
  surface = 2,
  rowKey,
  loading,
  onClick,
}: {
  dataSource: RecordType[];
  loading?: boolean;
  className?: string;
  rowClassName?: string;
  surface?: Surface;
  columns: Array<MobileTableColumn<RecordType>>;
  rowKey: (row: RecordType) => string | number;
  onClick?: (row: RecordType) => void;
}) {
  const colors = useSurface(surface);
  return (
    <table
      style={{
        ['--row-color' as never]: colors.current,
        ['--active-color' as never]: colors.next,
      }}
      className={clsx(
        'w-full max-w-full border-separate border-spacing-y-2',
        (loading || dataSource.length === 0) &&
          'items-center justify-center px-2 py-10',
        className,
      )}
    >
      {loading ? (
        <tbody>
          <tr data-table="placeholder">
            <td className="flex w-full items-center justify-center p-4">
              <Spinner />
            </td>
          </tr>
        </tbody>
      ) : dataSource.length === 0 ? (
        <tbody>
          <tr data-table="placeholder" className="w-full text-center">
            <td>
              <EmptyIcon className="mx-auto h-auto w-40" />
              Nothing to Show
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {dataSource?.map(row => (
            <tr
              key={rowKey(row)}
              className={clsx(
                'w-full rounded-lg',
                typeof onClick === 'function' &&
                  'bg-[--row-color] transition-all active:bg-[--active-color]',
                rowClassName,
              )}
              data-table="tr"
              onClick={() => onClick?.(row)}
              tabIndex={typeof onClick === 'function' ? 0 : -1}
            >
              {columns
                .filter(x => !x.hidden)
                .map((col, i, self) => (
                  <td
                    key={col.key}
                    className={clsx(
                      'overflow-hidden px-1 py-2',
                      col.className,
                      i === 0 && 'rounded-l-lg ps-2',
                      i === self.length - 1 && 'rounded-r-lg pe-2',
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
