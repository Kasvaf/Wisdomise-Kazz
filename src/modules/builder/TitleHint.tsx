import { type PropsWithChildren } from 'react';

interface Props {
  className?: string;
  title: string;
}

const TitleHint: React.FC<PropsWithChildren<Props>> = ({
  className,
  title,
  children,
}) => (
  <div className={className}>
    <h2 className="text-base font-semibold">{title}</h2>
    <p className="mt-2 text-sm text-white/60">{children}</p>
  </div>
);

export default TitleHint;
