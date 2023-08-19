import { LoadingOutlined } from '@ant-design/icons';
import { Spin as Spinner } from 'antd';

const Spin: React.FC<{ className?: string }> = ({ className }) => (
  <Spinner
    className={className}
    indicator={<LoadingOutlined style={{ fontSize: 14 }} spin rev="false" />}
  />
);

export default Spin;
