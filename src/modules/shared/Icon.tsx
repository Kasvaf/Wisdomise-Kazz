import { clsx } from 'clsx';
import { useMemo } from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  circled?: boolean;
  size?: number;
  className?: string;
}

const Icon = ({ name, circled, size = 24, className, ...attrs }: Props) => {
  return useMemo(() => {
    const paths = name.split('&&');

    return (
      <div
        className={clsx(circled && 'rounded-full bg-[#272A32] p-1', className)}
      >
        <svg viewBox="0 0 24 24" width={size} height={size} {...attrs}>
          {paths.map(d => (
            <path d={d} fill="currentColor" key={d}></path>
          ))}
        </svg>
      </div>
    );
  }, [name, circled, size, className, attrs]);
};

export default Icon;
