import { bxInfoCircle } from 'boxicons-quasar';
import Card from 'shared/Card';
import Icon from 'shared/Icon';

const PublishNotice = () => (
  <Card className="mt-12 !p-4 text-xs opacity-70">
    <div className="flex items-center gap-4">
      <Icon name={bxInfoCircle} className="shrink-0 text-warning" />
      <div>
        Once you have finished developing your signaler, you can email us to
        publish it for everyone.
      </div>
    </div>
  </Card>
);

export default PublishNotice;
