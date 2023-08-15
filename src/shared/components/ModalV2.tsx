import { Modal, ModalProps } from "antd";
import React from "react";

export const ModalV2: React.FC<ModalProps> = (props) => {
  return (
    <Modal open={props.open} footer={false} onCancel={props.onCancel}>
      {props.children}
    </Modal>
  );
};
