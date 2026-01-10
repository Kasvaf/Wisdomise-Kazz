import type { ReactNode } from 'react';
import type { Surface } from 'utils/useSurface';

export interface TableColumn<RecordType extends object> {
  key?: string;
  title?: ReactNode;
  info?: ReactNode;
  hidden?: boolean;
  width?: string | number;
  className?: string;
  render: (row: RecordType, index: number) => ReactNode;
  sorter?: (a: RecordType, b: RecordType) => number;
  sticky?: 'start' | 'end';
  align?: 'start' | 'end' | 'center';
  headerRender?: () => ReactNode;
}

export type RowFunction<RecordType extends object, ReturnType = void> = (
  row: RecordType,
  index: number,
) => ReturnType;

export interface TableProps<RecordType extends object> {
  dataSource?: RecordType[];
  rowKey?: RowFunction<RecordType, string | number>;
  columns: Array<TableColumn<RecordType>>;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
  surface?: Surface;
  scrollable?: boolean;
  isActive?: RowFunction<RecordType, boolean>;
  isPaused?: boolean;
  onClick?: RowFunction<RecordType>;
  chunkSize?: number;
  rowHoverPrefix?: RowFunction<RecordType, ReactNode>;
  rowHoverSuffix?: RowFunction<RecordType, ReactNode>;
  footer?: ReactNode;
  size?: 'md' | 'sm' | 'xs';
  minWidth?: string | number;
  emptyMessage?: string;
}
