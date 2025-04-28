import { clsx } from 'clsx';
import { useMemo, useRef } from 'react';
import { useSurface } from 'utils/useSurface';
import './style.css';
import { HoverTooltip } from 'shared/HoverTooltip';
import useIsMobile from 'utils/useIsMobile';
import { type TableProps } from './types';
import { ReactComponent as InfoIcon } from './info.svg';
import { TableSection } from './TableSection';
import { useChunks } from './useChunks';
import { EmptyContent } from './EmptyContent';
import { SkeletonTrs } from './SkeletonTrs';

const CHUNK_SIZE = 32;

export function Table<RecordType extends object>({
  columns,
  dataSource,
  rowKey,
  className,
  loading,
  surface,
  onClick,
  isActive,
  rowHoverPrefix,
  rowHoverSuffix,
  rowClassName,
}: TableProps<RecordType>) {
  const root = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const rowHeight = isMobile ? 54 : 68;

  const colors = useSurface(surface ?? 3);

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
    [trs, loading, tds],
  );

  const chunks = useChunks({
    chunkSize: CHUNK_SIZE,
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
                  data-last-child={index === self.length - 1}
                  data-align={th.align ?? 'start'}
                  data-sticky={th.sticky ?? 'none'}
                >
                  <div>{th.content}</div>
                </th>
              ))}
              {rowHoverSuffix && (
                <th data-sticky="end" style={{ width: '0px' }} />
              )}
            </tr>
          </thead>
        )}
        {loading ? (
          <tbody>
            <SkeletonTrs length={CHUNK_SIZE} rowHeight={rowHeight} />
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
              optimisticStyle={{ height: `${chunk.size * (rowHeight + 8)}px` }}
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
                      data-last-child={index === self.length - 1}
                      data-align={td.align ?? 'start'}
                      data-sticky={td.sticky ?? 'none'}
                    >
                      <div>{td.content}</div>
                    </td>
                  ))}
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
      </table>
    </div>
  );
}
