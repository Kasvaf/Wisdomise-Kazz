import { ReactComponent as RefreshIcon } from '@images/refresh.svg';
import { ReactComponent as ErrorUndraw } from '@images/errorUndraw.svg';
import Button from 'modules/shared/Button';

const onReload = () => window.location.reload();
export default function ErrorPage() {
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
        <RefreshIcon className="mr-2" />
        Reload
      </Button>
    </div>
  );
}
