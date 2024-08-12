/* eslint-disable import/max-dependencies */
import useModal from 'shared/useModal';
import PositionDetailModal, {
  type PositionDetails,
} from './PositionDetailModal';

const usePositionDetailModal = (
  position?: PositionDetails | null,
  exploreLink?: string,
) => {
  const [Modal, showModal] = useModal(PositionDetailModal, {
    width: 400,
  });

  return [
    Modal,
    async () => position && (await showModal({ position, exploreLink })),
  ] as const;
};

export default usePositionDetailModal;
