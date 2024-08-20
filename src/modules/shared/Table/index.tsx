import { Table as AntTable, type TableProps } from 'antd';
import { clsx } from 'clsx';
import expandSrc from './expand.svg';
import './style.css';

export default function Table<RecordType extends object>({
  pagination,
  columns,
  ...props
}: TableProps<RecordType>) {
  return (
    <AntTable<RecordType>
      bordered={false}
      showSorterTooltip={false}
      {...props}
      columns={columns?.filter(col => col.colSpan !== 0)}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              showPrevNextJumpers: true,
              ...pagination,
            }
      }
      expandable={{
        ...props.expandable,
        expandIcon: props.expandable
          ? props => (
              <button onClick={e => props.onExpand(props.record, e)}>
                <img
                  src={expandSrc}
                  className={clsx('transition', props.expanded && 'rotate-180')}
                />
              </button>
            )
          : undefined,
      }}
    />
  );
}
Table.EXPAND_COLUMN = AntTable.EXPAND_COLUMN;
