import { clsx } from 'clsx';
import { type ReactNode } from 'react';

export interface TopTableColumn<T> {
  render: (row: T, index: number) => ReactNode;
  className?: string;
}

export function TopTable<T extends object>({
  className,
  dataSource,
  columns,
  rowKey,
  loading,
}: {
  className?: string;
  dataSource?: T[];
  rowKey?: (row: T) => string;
  columns: Array<TopTableColumn<T>>;
  loading?: boolean;
}) {
  return (
    <div className={clsx(loading && 'animate-pulse blur-[2px]', className)}>
      <table className="w-full rounded-2xl bg-transparent text-start">
        <tbody>
          {dataSource?.map((row, index) => (
            <tr
              key={rowKey?.(row) ?? index.toString()}
              className="space-x-4 [&:nth-child(even)]:bg-transparent [&:nth-child(odd)]:bg-v1-surface-l3"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className={clsx(
                    'h-full py-4 ps-4',
                    columnIndex + 1 === columns.length && 'rounded-r-lg pe-4',
                    columnIndex === 0 && 'rounded-l-lg',
                    column.className,
                  )}
                >
                  {column.render(row, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
