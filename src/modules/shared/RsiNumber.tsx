import { type FC } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';

const mixColors = (src: number[], dst: number[], mixValue: number) =>
  src.map((s, i) => Math.round(s + (dst[i] - s) * mixValue));

const getColorAsString = (color: number[]) =>
  `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;

const getRsiColor = (value: number) => {
  if (value < 40) return mixColors([150, 50, 50], [150, 50, 100], value / 40);
  if (value < 60) return [0, 100, 100];
  return mixColors([0, 100, 100], [0, 100, 50], (value - 60) / 100 + 0.4);
};

export const RsiNumber: FC<{
  value?: number | null;
  className?: string;
}> = ({ value, className }) => {
  const hasValue = typeof value === 'number';
  return (
    <span
      style={{
        color: hasValue ? getColorAsString(getRsiColor(value)) : 'inherit',
      }}
    >
      <ReadableNumber
        value={value}
        className={className}
        format={{
          compactInteger: false,
          decimalLength: 0,
          minifyDecimalRepeats: false,
          separateByComma: true,
        }}
      />
    </span>
  );
};
