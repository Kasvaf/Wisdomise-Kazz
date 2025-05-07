import { clsx } from 'clsx';
import { useState } from 'react';
import { type SocialMessage } from 'api';
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
        src={src}
        className={clsx('cursor-pointer object-contain', className)}
        tabIndex={-1}
        onClick={() => setIsExpand(p => !p)}
      />
      <Dialog
        mode={'modal'}
        open={isExpand}
        onClose={() => setIsExpand(false)}
        closable
        className="w-[960px]"
        modalConfig={{
          closeButton: true,
        }}
      >
        <img src={src} className="size-full object-contain" />
      </Dialog>
    </>
  );
}
