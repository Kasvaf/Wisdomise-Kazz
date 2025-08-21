import type { FC } from 'react';

export const SkeletonTrs: FC<{ length: number; rowHeight: number }> = ({
  length,
  rowHeight,
}) => (
  <>
    {Array.from({ length }).map((_, i) => (
      <tr
        data-skeleton="true"
        key={`loading_${i}`}
        style={{ height: `${rowHeight}px` }}
      >
        <td
          colSpan={99}
          data-align="center"
          data-first-child="true"
          data-last-child="true"
        >
          <div />
        </td>
      </tr>
    ))}
  </>
);
