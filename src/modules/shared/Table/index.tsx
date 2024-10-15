import { Table as AntTable, Tooltip, type TableProps } from 'antd';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import Icon from 'shared/Icon';
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
      columns={columns
        ?.filter(col => col.colSpan !== 0)
        .map(col => ({
          ...col,
          title: Array.isArray(col.title) ? (
            <span className="inline-flex items-center gap-1">
              <span>{col.title[0]}</span>
              <Tooltip
                color="#151619"
                overlayInnerStyle={{
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                }}
                title={col.title[1]}
                overlayClassName="pointer-events-none"
              >
                <Icon name={bxInfoCircle} size={16} strokeWidth={0.5} />
              </Tooltip>
            </span>
          ) : (
            col.title
          ),
        }))}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              showPrevNextJumpers: true,
              ...pagination,
            }
      }
      scroll={{ x: true }}
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
