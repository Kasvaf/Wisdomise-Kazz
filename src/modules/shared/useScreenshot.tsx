import html2canvas from 'html2canvas';
import { type RefObject } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useShare } from './useShare';

export const useScreenshot = (
  el: RefObject<HTMLElement>,
  config: {
    backgroundColor?: string;
    fileName?: string;
    afterCapture?: 'share' | 'download';
  },
) => {
  const [share] = useShare('share');
  const isMobile = useIsMobile();

  const afterCapture = config.afterCapture ?? (isMobile ? 'share' : 'download');

  return () => {
    if (!el.current || el.current.classList.contains('capturing'))
      throw new Error('capture is in progress');
    el.current.classList.add('capturing');
    return html2canvas(el.current, {
      backgroundColor: config.backgroundColor,
      useCORS: true,
    })
      .then(
        canvas =>
          new Promise(resolve => {
            const fileName = `${config.fileName ?? Date.now()}.png`;

            if (afterCapture === 'share') {
              canvas.toBlob(blob => {
                if (!blob)
                  throw new Error('Error creating blob from html element!');
                const file = new File([blob], fileName, { type: 'image/png' });
                void share(file);
                resolve(true);
              }, 'image/png');
            } else {
              const link = document.createElement('a');
              link.href = canvas.toDataURL('image/png');
              link.download = fileName;
              link.click();
              resolve(true);
            }
          }),
      )
      .finally(() => {
        if (el.current) {
          el.current.classList.remove('capturing');
        }
      });
  };
};
