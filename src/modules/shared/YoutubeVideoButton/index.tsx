import YouTube from 'react-youtube';
import { useWindowSize } from 'usehooks-ts';
import {
  type FC,
  type ReactNode,
  useState,
  type MouseEventHandler,
} from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
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
        onClick={() => setOpen(true)}
        className={clsx(
          'flex items-center gap-[2px] text-xs text-[#00A3FF] hover:underline',
          className,
        )}
      >
        {children || (
          <>
            <PlayIcon />
            {t('watch-video')}
          </>
        )}
      </button>

      {open && (
        <Modal
          centered
          open={open}
          footer={false}
          width={width + (isMobile ? 0 : 48)}
          onCancel={() => setOpen(false)}
          wrapClassName="intro-style"
        >
          <div className="mt-6 mobile:-mx-6 mobile:-mb-6">
            <YouTube videoId={videoId} opts={{ width, height }} />
          </div>
        </Modal>
      )}
    </>
  );
};
