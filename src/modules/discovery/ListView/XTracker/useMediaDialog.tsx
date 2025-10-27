import { useMemo, useState } from 'react';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';

export function useMediaDialog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const openMedia = (url: string) => {
    setOpen(true);
    setUrl(url);
  };

  const dialog = useMemo(
    () => (
      <Dialog
        contentClassName="mobile:p-3"
        drawerConfig={{ closeButton: true, position: 'bottom' }}
        modalConfig={{ closeButton: true }}
        mode={isMobile ? 'drawer' : 'modal'}
        onClose={() => setOpen(false)}
        open={open}
      >
        <img
          alt={url}
          className="h-auto max-h-[calc(100vh-100px)] min-h-16 rounded-lg bg-v1-surface-l2"
          src={url}
        />
      </Dialog>
    ),
    [open, isMobile, url],
  );

  return { dialog, openMedia };
}
