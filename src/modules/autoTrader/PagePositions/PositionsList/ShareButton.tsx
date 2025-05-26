import { bxShareAlt } from 'boxicons-quasar';
import { useState } from 'react';
import { type Position } from 'api';
import { isMiniApp } from 'utils/version';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import PositionSharingModal from './PositionSharingModal';

const ShareButton: React.FC<{ position: Position }> = ({ position }) => {
  const [openShare, setOpenShare] = useState(false);
  return (
    <>
      {(position.status === 'CLOSED' || position.status === 'OPEN') &&
        !isMiniApp && (
          <Button
            variant="link"
            className="id-tour-share ms-auto !p-0 !text-xs text-v1-content-link"
            onClick={() => setOpenShare(true)}
          >
            <Icon name={bxShareAlt} size={16} className="mr-1" />
            Share
          </Button>
        )}

      <PositionSharingModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        position={position}
      />
    </>
  );
};

export default ShareButton;
