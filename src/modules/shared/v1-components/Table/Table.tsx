import { clsx } from 'clsx';
import { useMemo, useRef } from 'react';
import { useSurface } from 'utils/useSurface';
import './style.css';
import { HoverTooltip } from 'shared/HoverTooltip';
import { type TableProps } from './types';
import { ReactComponent as InfoIcon } from './info.svg';
import { TableSection } from './TableSection';
import { useChunks } from './useChunks';
import { EmptyContent } from './EmptyContent';
import { SkeletonTrs } from './SkeletonTrs';
import { Sort, useSorted } from './Sort';
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
          typeof td.width === 'number' ? `${td.width}px` : td.width ?? 'auto',
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
                    value={sort.index === index ? sort.order ?? 'none' : 'none'}
                  />
                )}
                {th.title}
                {th.info && (
                  <HoverTooltip title={th.info}>
                    <InfoIcon data-info />
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
      style={{
        ['--current-color' as never]: colors.current,
        ['--next-color' as never]: colors.next,
        ['--later-color' as never]: colors.later,
      }}
      data-scrollable={scrollable ? 'true' : 'false'}
      ref={root}
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
                  key={th.key}
                  style={{
                    width: th.width,
                  }}
                  data-first-child={index === 0}
                  data-last-child={
                    !scrollable && index === self.length - 1 ? 'true' : 'false'
                  }
                  data-align={th.align ?? 'start'}
                  data-sticky={th.sticky ?? 'none'}
                  data-clickable={typeof th.sorter === 'function'}
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
                <td style={{ width: 'auto' }} data-last-child="true">
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
          chunks.map((chunk, index) => (
            <TableSection
              key={chunk.key}
              optimisticStyle={{
                height: `${chunk.size * (rowHeight + 8)}px`,
              }}
              alwaysVisible={index === 0}
            >
              {trs.slice(...chunk.range).map(tr => (
                <tr
                  key={tr.key}
                  data-key={tr.key}
                  data-clickable={
                    typeof onClick === 'function' ? 'true' : 'false'
                  }
                  data-active={isActive?.(tr.data, tr.index) ? 'true' : 'false'}
                  onClick={() => onClick?.(tr.data, tr.index)}
                  className={rowClassName}
                >
                  {rowHoverPrefix && (
                    <td data-sticky="start" style={{ width: '0px' }} data-hover>
                      <div>{rowHoverPrefix(tr.data, tr.index)}</div>
                    </td>
                  )}
                  {tr.tds.map((td, index, self) => (
                    <td
                      key={td.key}
                      style={{
                        width: td.width,
                      }}
                      data-first-child={index === 0}
                      data-last-child={
                        !scrollable && index === self.length - 1
                          ? 'true'
                          : 'false'
                      }
                      data-align={td.align ?? 'start'}
                      data-sticky={td.sticky ?? 'none'}
                    >
                      <div>{td.content}</div>
                    </td>
                  ))}
                  {scrollable && (
                    <td style={{ width: 'auto' }} data-last-child="true">
                      <div />
                    </td>
                  )}
                  {rowHoverSuffix && (
                    <td data-sticky="end" style={{ width: '0px' }} data-hover>
                      <div>{rowHoverSuffix(tr.data, tr.index)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </TableSection>
          ))
        )}
        {footer && (
          <tfoot>
            <tr data-placeholder="true">
              <td
                data-align="center"
                colSpan={99}
                data-first-child="true"
                data-last-child="true"
              >
                {footer}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
