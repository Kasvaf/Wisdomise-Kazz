import { clsx } from 'clsx';
import { useState, type FC } from 'react';
import AuthorizedImage from 'shared/AuthorizedImage';
import { ProfileCoverPlaceholder, ProfilePicturePlaceholder } from './assets';

export const ProfilePhoto: FC<{
  src?: string | null;
  type: 'avatar' | 'cover';
  className?: string;
}> = ({ src, className, type }) => {
  const [error, setError] = useState(false);
  const placeholder =
    type === 'avatar' ? ProfilePicturePlaceholder : ProfileCoverPlaceholder;
  const hasPhoto = typeof src === 'string' && src;
  const trueSrc = hasPhoto && !error ? src : placeholder;
  return (
    <AuthorizedImage
      className={clsx(
        'object-cover object-center',
        type === 'avatar' ? 'bg-white' : 'bg-[#161b34]',
        className,
      )}
      src={trueSrc}
      onErrorCapture={() => {
        setError(true);
      }}
    />
  );
};
