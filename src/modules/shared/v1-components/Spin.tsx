import { bxLoader } from 'boxicons-quasar';
import Icon from 'shared/Icon';

export default function Spin() {
  return (
    <Icon
      className="animate-spin text-v1-content-secondary"
      name={bxLoader}
      size={16}
    />
  );
}
