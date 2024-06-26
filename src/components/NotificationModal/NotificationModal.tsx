import { Modal } from "antd";
// import "./NotificationModal.css";
import React from "react";

function NotificationModal({
  isOpen,
  title,
  message,
  onCancel,
}: {
  isOpen: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  onCancel: () => void;
}) {
  return (
    <div>
      <Modal
        title={title}
        open={isOpen}
        cancelText="Cancel"
        style={{ top: "30%" }}
        // className="w-2"
        onCancel={onCancel}
        footer={null}
      >
        {message}
      </Modal>
    </div>
  );
}

export default NotificationModal;
