import { bxRefresh } from 'boxicons-quasar';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { ReactComponent as ErrorUndraw } from './undraw.svg';

const onReload = () => window.location.reload();
export default function PageError() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-white">
      <ErrorUndraw className="mb-10 h-auto w-full max-w-sm px-6" />
      <div className="text-center">
        Something went wrong and we don&rsquo;t know how :(
      </div>
      <div className="mb-6 mt-2 text-center text-sm text-white/70">
        But we&rsquo;ll try our best so that it won&rsquo;t happen again.
      </div>

      <Button variant="primary" className="pl-4" onClick={onReload}>
        <Icon name={bxRefresh} className="mr-2" />
        Reload
      </Button>
    </div>
  );
}
