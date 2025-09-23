import { bxShareAlt } from 'boxicons-quasar';
import type { FC } from 'react';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';

export const BtnTokenShare: FC<{
  className?: string;
}> = ({ className }) => {
  const [share, shareNotif] = useShare('copy');

  return (
    <>
      <Button
        className={className}
        fab
        onClick={() =>
          share(`${window.location.origin}${window.location.pathname}`)
        }
        size="sm"
        surface={1}
        variant="outline"
      >
        <Icon name={bxShareAlt} />
      </Button>
      {shareNotif}
    </>
  );
};
