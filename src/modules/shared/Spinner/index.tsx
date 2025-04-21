import { clsx } from 'clsx';
import './style.css';

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('wsdm-spinner', 'size-60 mobile:size-40', className)}>
      <div>
        <span />
      </div>
      <div>
        <span />
      </div>
    </div>
  );
};
export default Spinner;
