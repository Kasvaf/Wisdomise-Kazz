import { type PropsWithChildren } from 'react';
import { bxInfoCircle } from 'boxicons-quasar';
import Icon from './Icon';

const LabelInfo: React.FC<PropsWithChildren<{ url: string }>> = ({
  url,
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      {children && <span>{children}</span>}
      <a
        target="_blank"
        href={url}
        rel="noreferrer"
        className="text-warning/70 hover:text-warning"
      >
        <Icon name={bxInfoCircle} />
      </a>
    </div>
  );
};

export default LabelInfo;
