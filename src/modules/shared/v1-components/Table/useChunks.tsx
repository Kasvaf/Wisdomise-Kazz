import { useMemo } from 'react';

export const useChunks = ({
  totalRows,
  chunkSize,
}: {
  totalRows: number;
  chunkSize: number;
}) => {
  return useMemo(
    () =>
      Array.from({
        length: Math.ceil(totalRows / chunkSize),
      })
        .fill(null)
        .map((_, index) => {
          const range = [
            index * chunkSize,
            Math.min(index * chunkSize + chunkSize, totalRows),
          ] as const;
          return {
            key: range.join(','),
            range,
            size: range[1] - range[0],
          };
        }),
    [chunkSize, totalRows],
  );
};
