import { Modal, type ModalProps } from 'antd';
import type React from 'react';

export const ModalV2: React.FC<ModalProps> = props => {
  return (
    <Modal
      open={props.open}
      footer={props.footer}
      onCancel={props.onCancel}
      width={props.width}
    >
      {props.children}
    </Modal>
  );
};
