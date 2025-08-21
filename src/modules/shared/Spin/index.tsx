import { LoadingOutlined } from '@ant-design/icons';
import { Spin as Spinner } from 'antd';
import { ReactComponent as SpinSvg } from './spin.svg';

const Spin: React.FC<{ className?: string; fontSize?: number }> = ({
  className,
  fontSize = 14,
}) => (
  <Spinner
    className={className}
    indicator={
      fontSize === 24 ? (
        <LoadingOutlined rev="false" spin style={{ fontSize }} />
      ) : (
        <SpinSvg className="!h-[14px] animate-spin" />
      )
    }
  />
);

export default Spin;
