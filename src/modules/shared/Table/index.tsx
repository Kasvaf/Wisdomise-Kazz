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
          title: (
            <span className="inline-flex items-center gap-1">
              {Array.isArray(col.title) ? col.title[0] : col.title}
              {Array.isArray(col.title) && col.title[1] && (
                <Tooltip
                  rootClassName="!max-w-[350px] [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:!p-4 [&_.ant-tooltip-inner]:!text-xxs [&_.ant-tooltip-inner]:!leading-normal [&_.ant-tooltip-inner]:!font-normal"
                  overlayClassName="pointer-events-none"
                  title={col.title[1]}
                >
                  <Icon name={bxInfoCircle} size={16} strokeWidth={0.5} />
                </Tooltip>
              )}
            </span>
          ),
        }))}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              showPrevNextJumpers: true,
              showLessItems: true,
              responsive: false,
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
