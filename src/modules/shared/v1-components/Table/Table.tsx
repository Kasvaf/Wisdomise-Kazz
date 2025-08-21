import { clsx } from 'clsx';
import { useMemo, useRef } from 'react';
import { useSurface } from 'utils/useSurface';
import './style.css';
import { HoverTooltip } from 'shared/HoverTooltip';
import { EmptyCell } from 'shared/v1-components/Table/EmptyCell';
import { DIALOG_OPENER_CLASS } from '../Dialog';
import { EmptyContent } from './EmptyContent';
import { IntersectionObserverProvider } from './IntersectionProvider';
import { ReactComponent as InfoIcon } from './info.svg';
import { SkeletonTrs } from './SkeletonTrs';
import { Sort, useSorted } from './Sort';
import { TableSection } from './TableSection';
import type { TableProps } from './types';
import { useChunks } from './useChunks';
import { useRowHeight } from './useRowHeight';

export function Table<RecordType extends object>({
  columns,
  dataSource: _dataSource,
  rowKey,
  className,
  loading,
  surface,
  onClick,
  isActive,
  rowHoverPrefix,
  rowHoverSuffix,
  rowClassName,
  scrollable,
  chunkSize = 48,
  footer,
}: TableProps<RecordType>) {
  const root = useRef<HTMLDivElement>(null);

  const rowHeight = useRowHeight(root, 59.5);

  const colors = useSurface(surface ?? 3);

  const [dataSource, sort, setSort] = useSorted(_dataSource ?? [], columns);

  const tds = useMemo(
    () =>
      (columns.filter(col => !col.hidden) ?? []).map((td, index) => ({
        ...td,
        width:
          typeof td.width === 'number' ? `${td.width}px` : (td.width ?? 'auto'),
        key: td.key ?? index.toString(),
      })),
    [columns],
  );

  const trs = useMemo(
    () =>
      (dataSource ?? []).map((data, index) => {
        const key = rowKey?.(data, index) ?? JSON.stringify(data);
        return {
          index,
          key,
          data,
          tds: tds.map(td => ({
            ...td,
            content: td.render(data, index),
          })),
        };
      }),
    [dataSource, rowKey, tds],
  );

  const ths = useMemo(
    () =>
      tds.some(col => !!col.title || !!col.info) && !loading && trs.length > 0
        ? tds.map((th, index) => ({
            ...th,
            content: (
              <>
                {typeof th.sorter === 'function' && (
                  <Sort
                    value={
                      sort.index === index ? (sort.order ?? 'none') : 'none'
                    }
                  />
                )}
                {th.title}
                {th.info && (
                  <HoverTooltip title={th.info}>
                    <InfoIcon
                      className={clsx('cursor-help', DIALOG_OPENER_CLASS)}
                      data-info
                    />
                  </HoverTooltip>
                )}
              </>
            ),
          }))
        : [],
    [tds, loading, trs.length, sort.index, sort.order],
  );

  const chunks = useChunks({
    chunkSize,
    totalRows: trs.length,
  });

  return (
    <div
      className={clsx('wsdm-table', className)}
      data-scrollable={scrollable ? 'true' : 'false'}
      ref={root}
      style={{
        ['--current-color' as never]: colors.current,
        ['--next-color' as never]: colors.next,
        ['--later-color' as never]: colors.later,
      }}
    >
      <table>
        {ths.length > 0 && (
          <thead>
            <tr>
              {rowHoverPrefix && (
                <th data-sticky="start" style={{ width: '0px' }} />
              )}
              {ths.map((th, index, self) => (
                <th
                  className={th.className}
                  data-align={th.align ?? 'start'}
                  data-clickable={typeof th.sorter === 'function'}
                  data-first-child={index === 0}
                  data-last-child={
                    !scrollable && index === self.length - 1 ? 'true' : 'false'
                  }
                  data-sticky={th.sticky ?? 'none'}
                  key={th.key}
                  style={{
                    width: th.width,
                  }}
                >
                  <div
                    onClick={() =>
                      typeof th.sorter === 'function'
                        ? setSort(index)
                        : undefined
                    }
                  >
                    {th.content}
                  </div>
                </th>
              ))}
              {scrollable && (
                <td data-last-child="true" style={{ width: 'auto' }}>
                  <div />
                </td>
              )}
              {rowHoverSuffix && (
                <th data-sticky="end" style={{ width: '0px' }} />
              )}
            </tr>
          </thead>
        )}
        {loading ? (
          <tbody>
            <SkeletonTrs length={chunkSize} rowHeight={rowHeight} />
          </tbody>
        ) : trs.length === 0 ? (
          <tbody>
            <tr data-placeholder>
              <td colSpan={99} data-align="center">
                <div>
                  <EmptyContent />
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <IntersectionObserverProvider>
            {chunks.map((chunk, index) => (
              <TableSection
                alwaysVisible={index === 0}
                key={chunk.key}
                optimisticStyle={{
                  height: `${chunk.size * (rowHeight + 8)}px`,
                }}
              >
                {trs.slice(...chunk.range).map(tr => (
                  <tr
                    className={rowClassName}
                    data-active={
                      isActive?.(tr.data, tr.index) ? 'true' : 'false'
                    }
                    data-clickable={
                      typeof onClick === 'function' ? 'true' : 'false'
                    }
                    data-key={tr.key}
                    key={tr.key}
                    onClick={() => onClick?.(tr.data, tr.index)}
                  >
                    {rowHoverPrefix && (
                      <td
                        data-hover
                        data-sticky="start"
                        style={{ width: '0px' }}
                      >
                        <div>{rowHoverPrefix(tr.data, tr.index)}</div>
                      </td>
                    )}
                    {tr.tds.map((td, index, self) => (
                      <td
                        className={td.className}
                        data-align={td.align ?? 'start'}
                        data-first-child={index === 0}
                        data-last-child={
                          !scrollable && index === self.length - 1
                            ? 'true'
                            : 'false'
                        }
                        data-sticky={td.sticky ?? 'none'}
                        key={td.key}
                        style={{
                          width: td.width,
                        }}
                      >
                        <div>{td.content ?? <EmptyCell />}</div>
                      </td>
                    ))}
                    {scrollable && (
                      <td data-last-child="true" style={{ width: 'auto' }}>
                        <div />
                      </td>
                    )}
                    {rowHoverSuffix && (
                      <td data-hover data-sticky="end" style={{ width: '0px' }}>
                        <div>{rowHoverSuffix(tr.data, tr.index)}</div>
                      </td>
                    )}
                  </tr>
                ))}
              </TableSection>
            ))}
          </IntersectionObserverProvider>
        )}
      </table>
      {footer && (
        <div className="sticky start-0 end-0 flex w-full items-center justify-center gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}
