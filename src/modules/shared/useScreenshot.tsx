import * as htmlToImage from 'html-to-image';
import { type RefObject, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useShare } from './useShare';

export const useScreenshot = (
  el: RefObject<HTMLElement>,
  config: {
    fileName?: string;
    afterCapture?: 'share' | 'download' | 'copy';
    backgroundColor?: string;
  },
) => {
  const [share] = useShare('share');
  const [copy, content] = useShare('copy');
  const isMobile = useIsMobile();
  const [isCapturing, setIsCapturing] = useState(false);

  const afterCapture = config.afterCapture ?? (isMobile ? 'share' : 'download');

  return {
    isCapturing,
    capture: async () => {
      if (!el.current || el.current.classList.contains('capturing'))
        throw new Error('capture is in progress');
      el.current.classList.add('capturing', '!rounded-none');
      setIsCapturing(true);
      try {
        const dataUrl = await htmlToImage.toPng(el.current, {
          backgroundColor: config.backgroundColor,
          includeQueryParams: true,
        });
        return await new Promise(resolve => {
          const fileName = `${config.fileName ?? Date.now()}.png`;

          const blob = dataURLToBlob(dataUrl);
          if (afterCapture === 'share') {
            const file = new File([blob], fileName, { type: 'image/png' });
            void share(file);
            resolve(true);
          } else if (afterCapture === 'copy') {
            copy(blob as File);
            resolve(true);
          } else {
            const anchorElement = document.createElement('a');
            anchorElement.href = dataUrl;
            anchorElement.download = fileName;
            anchorElement.click();
            resolve(true);
          }
        });
      } finally {
        setIsCapturing(false);
        if (el.current) {
          el.current.classList.remove('capturing', '!rounded-none');
        }
      }
    },
    content,
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
