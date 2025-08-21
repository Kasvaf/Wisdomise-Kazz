import { postEvent } from '@telegram-apps/sdk';
import * as htmlToImage from 'html-to-image';
import { type RefObject, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { isMiniApp } from 'utils/version';
import { useShare } from './useShare';

export const useScreenshot = (
  el: RefObject<HTMLElement>,
  config: {
    fileName?: string;
    afterCapture?: 'share' | 'download';
    backgroundColor?: string;
  },
) => {
  const [share] = useShare('share');
  const isMobile = useIsMobile();
  const [isCapturing, setIsCapturing] = useState(false);

  const afterCapture = config.afterCapture ?? (isMobile ? 'share' : 'download');

  return {
    isCapturing,
    capture: async () => {
      if (!el.current || el.current.classList.contains('capturing'))
        throw new Error('capture is in progress');
      el.current.classList.add('capturing');
      setIsCapturing(true);
      try {
        const dataUrl = await htmlToImage.toPng(el.current, {
          backgroundColor: config.backgroundColor,
          includeQueryParams: true,
        });
        return await new Promise(resolve => {
          const fileName = `${config.fileName ?? Date.now()}.png`;

          if (afterCapture === 'share') {
            const blob = dataURLToBlob(dataUrl);
            if (!blob)
              throw new Error('Error creating blob from html element!');
            const file = new File([blob], fileName, { type: 'image/png' });
            void share(file);
            resolve(true);
          } else {
            if (isMiniApp) {
              postEvent('web_app_request_file_download', {
                url: dataUrl,
                file_name: fileName,
              });
            } else {
              const anchorElement = document.createElement('a');
              anchorElement.href = dataUrl;
              anchorElement.download = fileName;
              anchorElement.click();
            }
            resolve(true);
          }
        });
      } finally {
        setIsCapturing(false);
        if (el.current) {
          el.current.classList.remove('capturing');
        }
      }
    },
  };
};

function dataURLToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.codePointAt(i) as number;
  }

  return new Blob([array], { type: mime });
}
