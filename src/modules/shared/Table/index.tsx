import { Table as AntTable, type TableProps } from 'antd';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import expandSrc from './expand.svg';
import './style.css';
interface TablePagination {
  page: number;
  total?: number;
  pageSize: number;
  sortBy?: string; // keyof Columns
  sortOrder?: 'ascending' | 'descending';
}

const toParam = (prefix: string, param: string) =>
  [prefix, param].filter(x => !!x).join('-');

const TABLE_STATE_ARRAY_SPLITTER = '&&';

export const useTableState = <
  T extends Record<string, string | number | boolean | string[]>,
>(
  queryPrefix: string,
  initialState: TablePagination & T,
) => {
  const initialStateRef = useRef(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localState, setLocalState] = useState(initialStateRef.current);
  const urlState = useMemo(() => {
    const returnValue = {
      ...(initialStateRef.current as Record<string, any>),
    };
    for (const [paramKeyRaw, initialParamValue] of Object.entries(
      initialStateRef.current,
    )) {
      const searchParamValue = searchParams.get(
        toParam(queryPrefix, paramKeyRaw),
      );
      if (typeof searchParamValue !== 'string') continue;
      if (typeof initialParamValue === 'boolean')
        returnValue[paramKeyRaw] = searchParamValue !== 'false';
      else if (
        typeof initialParamValue === 'number' &&
        !Number.isNaN(Number(searchParamValue)) &&
        searchParamValue.trim() !== ''
      )
        returnValue[paramKeyRaw] = Number(searchParamValue);
      else if (Array.isArray(initialParamValue))
        returnValue[paramKeyRaw] = searchParamValue.split(
          TABLE_STATE_ARRAY_SPLITTER,
        );
      else returnValue[paramKeyRaw] = searchParamValue;
    }
    return returnValue as typeof initialState;
  }, [queryPrefix, searchParams]);

  // Read url (Just once)
  const isUrlFetched = useRef(false);
  useEffect(() => {
    if (isUrlFetched.current) return;
    setLocalState(urlState);
    isUrlFetched.current = true;
  }, [urlState]);

  // Set url with delay
  const setUrlTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    const clearUrlTimeout = () => {
      if (setUrlTimeout.current !== null) {
        clearTimeout(setUrlTimeout.current);
      }
    };
    clearUrlTimeout();
    setUrlTimeout.current = setTimeout(() => {
      setSearchParams(
        currentSearchParams => {
          let newSearchParams = Object.fromEntries(
            currentSearchParams.entries(),
          );
          let isModified = false;
          for (const [paramKeyRaw, paramValue] of Object.entries(localState)) {
            if (paramKeyRaw === 'total') continue;
            const paramKey = toParam(queryPrefix, paramKeyRaw);
            const { [paramKey]: prevValue, ...rest } = newSearchParams;
            const isSame =
              Array.isArray(paramValue) &&
              Array.isArray(initialStateRef.current[paramKeyRaw])
                ? JSON.stringify([...paramValue].sort()) ===
                  JSON.stringify(
                    [...initialStateRef.current[paramKeyRaw]].sort(),
                  )
                : initialStateRef.current[paramKeyRaw] === paramValue;
            const isEmpty =
              paramValue === undefined ||
              (Array.isArray(paramValue) && paramValue.length === 0);
            newSearchParams =
              isSame || isEmpty
                ? rest
                : {
                    ...rest,
                    [paramKey]: Array.isArray(paramValue)
                      ? paramValue.join(TABLE_STATE_ARRAY_SPLITTER)
                      : paramValue.toString(),
                  };
            const newValue = newSearchParams[paramKey];
            if (prevValue !== newValue) isModified = true;
          }
          if (!isModified) return currentSearchParams;
          return newSearchParams;
        },
        {
          replace: true,
        },
      );
    }, 150);
    return () => clearUrlTimeout();
  }, [localState, queryPrefix, setSearchParams]);

  const state = localState;
  const setState = useCallback(
    (newValue: Partial<typeof initialState> | undefined) => {
      setLocalState(p =>
        newValue === undefined
          ? initialStateRef.current
          : { ...p, ...newValue },
      );
    },
    [],
  );

  return useMemo(
    () =>
      [
        {
          pagination: {
            total: state.total ?? undefined,
            current: state.page,
            pageSize: state.pageSize ?? 10,
          },
          onChange: (pagination, _, sorter) => {
            setState({
              ...state,
              ...(pagination.current && {
                page: pagination.current,
              }),
              ...(pagination.pageSize && {
                pageSize: pagination.pageSize,
              }),

              ...(sorter &&
                !Array.isArray(sorter) &&
                typeof sorter.field === 'string' && {
                  sortBy:
                    typeof sorter.field === 'string' && sorter.order
                      ? sorter.field
                      : undefined,
                }),
              ...(sorter &&
                !Array.isArray(sorter) &&
                typeof sorter.order === 'string' && {
                  sortOrder:
                    sorter.order === 'ascend' ? 'ascending' : 'descending',
                }),
            });
          },
        } satisfies Partial<TableProps<any>>,
        state,
        setState,
      ] as const,
    [setState, state],
  );
};
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
                <HoverTooltip title={col.title[1]}>
                  <Icon name={bxInfoCircle} size={16} strokeWidth={0.5} />
                </HoverTooltip>
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
