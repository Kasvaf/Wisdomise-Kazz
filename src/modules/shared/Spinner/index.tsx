import { clsx } from 'clsx';
import './style.css';

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('brand-spinner', 'size-20 mobile:size-16', className)}>
      <div />
    </div>
  );
};
export default Spinner;
