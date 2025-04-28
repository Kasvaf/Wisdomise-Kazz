import { type ReactNode } from 'react';
import { type Surface } from 'utils/useSurface';

export interface TableColumn<RecordType extends object> {
  key?: string;
  title?: ReactNode;
  info?: ReactNode;
  hidden?: boolean;
  width?: string | number;
  className?: string;
  render: (row: RecordType, index: number) => ReactNode;
  sticky?: 'start' | 'end';
  align?: 'start' | 'end' | 'center';
}

export type RowFunction<RecordType extends object, ReturnType = void> = (
  row: RecordType,
  index: number,
) => ReturnType;

export interface TableProps<RecordType extends object> {
  dataSource: RecordType[];
  rowKey: RowFunction<RecordType, string | number>;
  columns: Array<TableColumn<RecordType>>;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
  surface?: Surface;
  isActive?: RowFunction<RecordType, boolean>;
  onClick?: RowFunction<RecordType>;
  rowHeight: number;
  rowHoverPrefix?: RowFunction<RecordType, ReactNode>;
  rowHoverSuffix?: RowFunction<RecordType, ReactNode>;
}
