import { useEffect, useState } from 'react';
import { getJwtToken } from 'modules/base/auth/jwt-store';

export default function AuthorizedImage({
  onError,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  onError?: () => void;
}) {
  const { src } = props;
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (src) {
      void fetch(src, {
        headers: {
          Authorization: `Bearer ${getJwtToken() || ''}`,
        },
      })
        .then(async res => {
          const blob = await res.blob();
          const reader = new FileReader();
          await new Promise((resolve, reject) => {
            reader.addEventListener('load', resolve);
            // eslint-disable-next-line unicorn/prefer-add-event-listener
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          reader.result && setImgSrc(reader.result.toString());
          return null;
        })
        .catch(() => {
          onError?.();
        });
    }
  }, [src, onError]);

  return <img {...props} src={imgSrc} />;
}
