import { bxCameraMovie } from 'boxicons-quasar';
import YouTube from 'react-youtube';
import { useWindowSize } from 'usehooks-ts';
import { useRef, useState } from 'react';
import { Modal } from 'antd';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';

const BinanceApiIntroVideo = () => {
  const ws = useWindowSize();
  const isMobile = useIsMobile();
  const width = Math.min(ws.width - 32, 800);
  const height = (width * 360) / 640;

  const [open, setOpen] = useState(false);
  const player = useRef<YouTube>(null);

  return (
    <div>
      <a className="flex items-center text-info" onClick={() => setOpen(true)}>
        <Icon name={bxCameraMovie} className="mr-1" />
        How to Add Binance Wallet
      </a>

      {open && (
        <Modal
          centered
          open={open}
          footer={false}
          width={width + (isMobile ? 0 : 48)}
          onCancel={() => setOpen(false)}
          wrapClassName="intro-style"
        >
          <div className="mobile:-mx-6 mobile:-mb-6">
            <div className="mb-3 mobile:ml-3">How to Add Binance Wallet</div>
            <YouTube
              ref={player}
              videoId="Z0X7FzgaCgw"
              opts={{ width, height }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BinanceApiIntroVideo;
