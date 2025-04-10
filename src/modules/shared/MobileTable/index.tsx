import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { type Surface, useSurface } from 'utils/useSurface';
import { Lazy } from 'shared/Lazy';
import Spinner from 'shared/Spinner';
import { ReactComponent as EmptyIcon } from './empty.svg';

export interface MobileTableColumn<RecordType extends object> {
  key: string | number;
  hidden?: boolean;
  render: (row: RecordType, index: number) => ReactNode;
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
  const rowRender: MobileTableColumn<RecordType>['render'] = (
    row,
    rowIndex,
  ) => (
    <tr
      key={rowKey(row)}
      className={clsx(
        'relative w-full rounded-lg bg-[--row-color]',
        typeof onClick === 'function' &&
          'transition-all active:bg-[--active-color]',
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
              'relative overflow-hidden px-[2px]',
              'h-14 align-middle',
              col.className,
              i === 0 && 'rounded-l-lg ps-2',
              i === self.length - 1 && 'rounded-r-lg pe-2',
            )}
          >
            {col.render(row, rowIndex)}
          </td>
        ))}
    </tr>
  );
  const loadingCols = (
    <td colSpan={99}>
      <div className="flex w-full max-w-full items-center justify-center overflow-hidden p-4 py-20">
        <Spinner className="!size-20" />
      </div>
    </td>
  );
  return (
    <table
      style={{
        ['--row-color' as never]: colors.current,
        ['--active-color' as never]: colors.next,
      }}
      className={clsx(
        'w-full max-w-full border-separate border-spacing-x-0 border-spacing-y-2',
        (loading || dataSource.length === 0) &&
          'items-center justify-center px-2 py-10',
        className,
      )}
    >
      {loading ? (
        <tbody>
          <tr data-table="placeholder" className="w-full">
            {loadingCols}
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
        <>
          <tbody>{dataSource.slice(0, 25).map(rowRender)}</tbody>
          {dataSource.length > 25 && (
            <Lazy
              freezeOnceVisible
              tag="tbody"
              fallback={loadingCols}
              unMountedClassName="table-row w-full"
            >
              {dataSource.slice(25).map(rowRender)}
            </Lazy>
          )}
        </>
      )}
    </table>
  );
}
