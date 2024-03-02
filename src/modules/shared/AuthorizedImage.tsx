import { useEffect, useState } from 'react';

export default function AuthorizedImage(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
) {
  const { src } = props;
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (src) {
      void fetch(src, {
        headers: {
          Authorization: `Token ${import.meta.env.VITE_API_TOKEN as string}`,
        },
      }).then(async res => {
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
      });
    }
  }, [src]);

  return <img {...props} src={imgSrc} />;
}
