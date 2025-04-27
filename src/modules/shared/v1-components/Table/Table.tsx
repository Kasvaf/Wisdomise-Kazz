import { clsx } from 'clsx';
import { useMemo, useRef } from 'react';
import { useSurface } from 'utils/useSurface';
import './style.css';
import { HoverTooltip } from 'shared/HoverTooltip';
import { type TableProps } from './types';
import { ReactComponent as InfoIcon } from './info.svg';
import { TableSection } from './TableSection';
import { useChunks } from './useChunks';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyContent } from './EmptyContent';

export function Table<RecordType extends object>({
  columns,
  dataSource,
  rowKey,
  className,
  loading,
  surface,
  rowHeight,
}: TableProps<RecordType>) {
  const root = useRef<HTMLDivElement>(null);

  const colors = useSurface(surface ?? 2);

  const tds = useMemo(
    () => columns.filter(col => !col.hidden) ?? [],
    [columns],
  );
  const ths = useMemo(
    () =>
      tds.some(col => !!col.title || !!col.info || col.sortable) &&
      !loading &&
      dataSource.length > 0
        ? tds.map(th => ({
            ...th,
            content: (
              <>
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
    [dataSource.length, loading, tds],
  );

  const trs = useMemo(
    () =>
      (dataSource ?? []).map((data, index) => {
        const key = rowKey(data, index);
        return {
          index,
          key,
          tds: tds.map(td => ({
            ...td,
            content: td.render(data, index),
          })),
        };
      }),
    [dataSource, rowKey, tds],
  );

  const chunks = useChunks({
    chunkSize: 32,
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
      ref={root}
    >
      <table>
        {ths.length > 0 && (
          <thead>
            <tr>
              {ths.map(th => (
                <th
                  key={th.key}
                  style={{
                    width: th.width,
                  }}
                  data-align={th.align ?? 'start'}
                  data-sticky={th.sticky ?? 'none'}
                >
                  <div>{th.content}</div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        {loading ? (
          <tbody>
            <tr data-placeholder>
              <td colSpan={99} data-align="center">
                <div>
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
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
          chunks.map(chunk => (
            <TableSection
              key={chunk.key}
              style={{ height: `${chunk.size * (rowHeight + 8)}px` }}
            >
              {trs.slice(...chunk.range).map(tr => (
                <tr
                  key={tr.key}
                  data-key={tr.key}
                  style={{ height: `${rowHeight}px` }}
                >
                  {tr.tds.map(td => (
                    <td
                      key={td.key}
                      data-align={td.align ?? 'start'}
                      data-sticky={td.sticky ?? 'none'}
                    >
                      <div>{td.content}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </TableSection>
          ))
        )}
      </table>
    </div>
  );
}
