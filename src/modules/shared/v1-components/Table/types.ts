import { type ReactNode } from 'react';
import { type Surface } from 'utils/useSurface';

export interface TableColumn<RecordType extends object> {
  key: string;
  title?: ReactNode;
  info?: ReactNode;
  sortable?: boolean;
  hidden?: boolean;
  width?: string;
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
  rowKey: RowFunction<RecordType, string>;
  columns: Array<TableColumn<RecordType>>;
  loading?: boolean;
  className?: string;
  surface?: Surface;
  isActive?: RowFunction<RecordType, boolean>;
  onClick?: RowFunction<RecordType>;
  onMouseEnter?: RowFunction<RecordType>;
  onMouseLeave?: RowFunction<RecordType>;
  rowHeight: number;
}
