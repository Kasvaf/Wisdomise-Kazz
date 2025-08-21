import { clsx } from 'clsx';
import {
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import { Dialog } from 'shared/v1-components/Dialog';
import { useWindowSize } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as PlayIcon } from './play.svg';

export const YoutubeVideoButton: FC<{
  videoId: string;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ videoId, className, children }) => {
  const ws = useWindowSize();
  const isMobile = useIsMobile();
  const { t } = useTranslation('home');
  const width = Math.min(ws.width - 32, 800);
  const height = (width * 360) / 640;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={clsx(
          'flex items-center gap-[2px] text-[#00A3FF] text-xs hover:underline',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        {children || (
          <>
            <PlayIcon />
            {t('watch-video')}
          </>
        )}
      </button>

      {open && (
        <Dialog
          className="w-max"
          footer={false}
          mode="modal"
          onClose={() => setOpen(false)}
          open={open}
        >
          <div
            className="mobile:-mx-6 mobile:-mb-6 mt-6"
            style={{ width: `${width + (isMobile ? 0 : 48)}px` }}
          >
            <YouTube opts={{ width, height }} videoId={videoId} />
          </div>
        </Dialog>
      )}
    </>
  );
};
