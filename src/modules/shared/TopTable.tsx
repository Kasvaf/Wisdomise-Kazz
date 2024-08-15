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
      <table className="w-full rounded-2xl bg-black/20 text-start">
        <tbody>
          {dataSource?.map((row, index) => (
            <tr
              key={rowKey?.(row) ?? index.toString()}
              className="space-x-4 [&:nth-child(even)]:bg-black/15 [&:nth-child(odd)]:bg-transparent"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className={clsx(
                    'h-full border-b border-b-black/30 py-4 ps-4',
                    columnIndex + 1 === columns.length && 'pe-4',
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
