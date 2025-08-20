import { useCallback, useMemo, useState, type FC } from 'react';
import { ReactComponent as SortIcon } from './sort.svg';
import { type TableColumn } from './types';

type SortOrder = 'ascending' | 'descending' | 'none';

export function useSorted<RecordType extends object>(
  dataSource: RecordType[],
  columns: Array<TableColumn<RecordType>>,
) {
  const [index, setIndex] = useState<number>();
  const [order, setOrder] = useState<SortOrder>();

  const setSort = useCallback(
    (newIndex: number) => {
      const isIndexChange = index !== newIndex;
      setIndex(newIndex);
      setOrder(
        isIndexChange
          ? 'ascending'
          : order === 'ascending'
            ? 'descending'
            : order === 'descending'
              ? 'none'
              : 'ascending',
      );
    },
    [index, order],
  );

  const value = useMemo(
    () => ({
      index,
      order,
    }),
    [index, order],
  );

  const sortedDataSource = useMemo(() => {
    if (typeof index === 'number' && order !== 'none') {
      const sorter = columns[index].sorter ?? (() => 0);
      return [...dataSource].sort(
        (a, b) => sorter(a, b) * (order === 'ascending' ? -1 : 1),
      );
    }
    return dataSource;
  }, [columns, dataSource, index, order]);

  return useMemo(
    () => [sortedDataSource, value, setSort] as const,
    [sortedDataSource, value, setSort],
  );
}

export const Sort: FC<{
  value: SortOrder;
}> = ({ value }) => (
  <SortIcon
    style={{
      ['--up-opacity' as never]: value === 'ascending' ? '0.8' : '0.2',
      ['--down-opacity' as never]: value === 'descending' ? '0.8' : '0.2',
    }}
  />
);
