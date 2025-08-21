import type { SocialMessage } from 'api/discovery';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Dialog } from 'shared/v1-components/Dialog';
import { useSocialMessage } from './useSocialMessage';

export function SocialMessageImage({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  const [isExpand, setIsExpand] = useState(false);
  const { image: src } = useSocialMessage(message);

  if (!src) return null;

  return (
    <>
      <img
        className={clsx('cursor-pointer object-contain', className)}
        onClick={() => setIsExpand(p => !p)}
        src={src}
        tabIndex={-1}
      />
      <Dialog
        className="w-[960px]"
        closable
        modalConfig={{
          closeButton: true,
        }}
        mode={'modal'}
        onClose={() => setIsExpand(false)}
        open={isExpand}
      >
        <img className="size-full object-contain" src={src} />
      </Dialog>
    </>
  );
}
