import { bxInfoCircle } from 'boxicons-quasar';
import type { PropsWithChildren } from 'react';
import Icon from './Icon';

const LabelInfo: React.FC<PropsWithChildren<{ url: string }>> = ({
  url,
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      {children && <span>{children}</span>}
      <a
        className="text-v1-content-notice/70 hover:text-v1-content-notice"
        href={url}
        rel="noreferrer"
        target="_blank"
      >
        <Icon name={bxInfoCircle} />
      </a>
    </div>
  );
};

export default LabelInfo;
