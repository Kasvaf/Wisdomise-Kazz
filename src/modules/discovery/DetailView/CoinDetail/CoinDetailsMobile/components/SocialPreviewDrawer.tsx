import { Spin } from 'antd';
import type { Social } from 'modules/shared/TokenSocials/lib';
import { SocialPreview } from 'modules/shared/TokenSocials/SocialPreview';
import { Suspense } from 'react';
import { Dialog } from 'shared/v1-components/Dialog';

interface SocialPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  social: Social | null;
}

export function SocialPreviewDrawer({
  isOpen,
  onClose,
  social,
}: SocialPreviewDrawerProps) {
  if (!social) return null;

  const header = (
    <div className="flex w-full items-center justify-between">
      <span className="font-bold text-base text-white capitalize">
        {social.type} Preview
      </span>
      <a
        className="text-sm text-v1-content-brand hover:underline"
        href={social.url.href}
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open Link →
      </a>
    </div>
  );

  return (
    <Dialog
      className="bg-v1-background-primary"
      contentClassName="px-4 py-4"
      drawerConfig={{ position: 'bottom', closeButton: true }}
      header={header}
      mode="drawer"
      onClose={onClose}
      open={isOpen}
    >
      <div className="max-h-[70vh] overflow-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <Spin />
            </div>
          }
        >
          <SocialPreview social={social} />
        </Suspense>
      </div>
    </Dialog>
  );
}
