import { LoadingOutlined } from '@ant-design/icons';
import { Spin as Spinner } from 'antd';

const Spin: React.FC<{ className?: string; fontSize?: number }> = ({
  className,
  fontSize = 14,
}) => (
  <Spinner
    className={className}
    indicator={<LoadingOutlined style={{ fontSize }} spin rev="false" />}
  />
);

export default Spin;
