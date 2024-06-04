import { clsx } from 'clsx';
import { bxChevronUp } from 'boxicons-quasar';
import { useState, type PropsWithChildren } from 'react';
import Icon from 'shared/Icon';
import Badge from 'shared/Badge';
import Button from 'shared/Button';
import { ReactComponent as DeleteIcon } from './delete-icon.svg';

const Collapsible: React.FC<
  PropsWithChildren<{
    title: string;
    applied?: boolean;
    onDelete?: () => any;
    className?: string;
    headerClassName?: string;
  }>
> = ({ title, applied, onDelete, className, headerClassName, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(!!applied);

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg',
        applied && 'opacity-70 saturate-50',
        className,
      )}
    >
      <div
        className={clsx(
          'flex items-center justify-between p-2',
          headerClassName,
        )}
      >
        <div className="flex items-center gap-3">
          <div>{title}</div>
          {applied && <Badge label="hit" color="grey" />}
          {onDelete && !applied && (
            <Button variant="link" className="!p-0" onClick={onDelete}>
              <DeleteIcon />
            </Button>
          )}
        </div>

        <Button
          variant="link"
          className="!p-0"
          onClick={() => setIsCollapsed(x => !x)}
        >
          <Icon name={bxChevronUp} />
        </Button>
      </div>

      {!isCollapsed && children}
    </div>
  );
};

export default Collapsible;
