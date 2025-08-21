import RewardModalContent from 'modules/account/PageRewards/RewardModal/RewardModalContent';
import useModal from 'shared/useModal';

export default function useRewardModal() {
  return useModal(RewardModalContent, {
    mobileDrawer: true,
    className:
      '[&>.ant-drawer-wrapper-body]:!bg-v1-surface-l1 [&>.ant-modal-content]:!bg-v1-surface-l1',
  });
}
