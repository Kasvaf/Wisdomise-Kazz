import { Table as AntTable, type TableProps } from 'antd';
import { clsx } from 'clsx';
import expandSrc from './expand.svg';
import preSrc from './pre.svg';
import nextSrc from './next.svg';

export default function Table<RecordType extends object>({
  pagination,
  ...props
}: TableProps<RecordType>) {
  return (
    <AntTable<RecordType>
      {...props}
      pagination={{
        ...pagination,
        showSizeChanger: false,
        showPrevNextJumpers: false,
        nextIcon: <img src={nextSrc} />,
        prevIcon: <img src={preSrc} />,
      }}
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
