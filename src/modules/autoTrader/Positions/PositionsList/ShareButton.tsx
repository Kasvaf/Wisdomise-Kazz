import { bxShareAlt } from 'boxicons-quasar';
import { useState } from 'react';
import type { Position } from 'services/rest';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { isMiniApp } from 'utils/version';
import PositionSharingModal from './PositionSharingModal';

const ShareButton: React.FC<{ position: Position }> = ({ position }) => {
  const [openShare, setOpenShare] = useState(false);
  return (
    <>
      {(position.status === 'CLOSED' || position.status === 'OPEN') &&
        !isMiniApp &&
        position.mode === 'buy_and_sell' && (
          <Button
            className="id-tour-share !p-0 !text-xs ms-auto text-v1-content-link"
            onClick={() => setOpenShare(true)}
            variant="link"
          >
            <Icon className="mr-1" name={bxShareAlt} size={16} />
            Share
          </Button>
        )}

      <PositionSharingModal
        onClose={() => setOpenShare(false)}
        open={openShare}
        position={position}
      />
    </>
  );
};

export default ShareButton;
