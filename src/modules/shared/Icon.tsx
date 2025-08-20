import { useMemo } from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  className?: string;
}

const Icon = ({ name, size = 24, className, ...attrs }: Props) => {
  return useMemo(() => {
    const paths = name.split('&&');

    return (
      <div className={className}>
        <svg viewBox="0 0 24 24" width={size} height={size} {...attrs}>
          {paths.map(d => (
            <path d={d} fill="currentColor" key={d}></path>
          ))}
        </svg>
      </div>
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  }, [name, size, className, attrs]);
};

export default Icon;
