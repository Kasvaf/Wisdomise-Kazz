import YouTube from 'react-youtube';
import { useWindowSize } from 'usehooks-ts';
import { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as PlayIcon } from './icon/play.svg';

export default function WatchGuideVideo({ videoId }: { videoId: string }) {
  const ws = useWindowSize();
  const isMobile = useIsMobile();
  const { t } = useTranslation('home');
  const width = Math.min(ws.width - 32, 800);
  const height = (width * 360) / 640;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-[2px] text-xs text-[#00A3FF] underline"
      >
        <PlayIcon />
        {t('watch-video')}
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
    </div>
  );
}
