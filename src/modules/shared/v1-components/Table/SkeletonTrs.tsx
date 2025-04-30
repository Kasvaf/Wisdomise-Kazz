import { type FC } from 'react';

export const SkeletonTrs: FC<{ length: number; rowHeight: number }> = ({
  length,
  rowHeight,
}) => (
  <>
    {Array.from({ length }).map((_, i) => (
      <tr
        key={`loading_${i}`}
        style={{ height: `${rowHeight}px` }}
        data-skeleton="true"
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
