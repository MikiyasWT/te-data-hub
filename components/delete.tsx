import React from "react";

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed z-30 h-full w-full top-0 bottom-0 left-0 right-0  flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <p>Are you sure you want to delete this item?</p>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 mr-2 text-red-500" onClick={onConfirm}>
            Confirm
          </button>
          <button className="px-4 py-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
