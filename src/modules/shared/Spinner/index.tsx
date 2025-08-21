import { clsx } from 'clsx';
import './style.css';

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('brand-spinner', 'mobile:size-16 size-20', className)}>
      <div />
    </div>
  );
};
export default Spinner;
