import { bxsDownArrow } from 'boxicons-quasar';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Icon from 'shared/Icon';
import { ReactComponent as SupportIcon } from './support.svg';

const FabSupport = () => {
  const [closedCount, setClosedCount] = useLocalStorage('support-fab', 0);
  const [isHintOpen, setIsHintOpen] = useState(closedCount < 3);
  useEffect(() => {
    const handler = () => {
      setIsHintOpen(false);
      setClosedCount(x => x + 1);
      window.removeEventListener('scroll', handler);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [setClosedCount]);

  return (
    <div className="fixed bottom-20 right-6 z-20 flex flex-col items-end">
      {isHintOpen && (
        <div className="relative mb-3 rounded-lg bg-v1-background-selected p-2 text-xs">
          Need help? Tap for support!
          <Icon
            name={bxsDownArrow}
            className="absolute -bottom-2.5 right-4 text-v1-background-selected"
            size={14}
          />
        </div>
      )}

      <a
        href="#"
        target="_blank"
        className="flex size-12 items-center justify-center rounded-full bg-v1-background-selected p-2"
      >
        <SupportIcon />
      </a>
    </div>
  );
};

export default FabSupport;
