import React, { useState } from "react";
import Modal from "../common/Modal";

export default function AdminChangeRoleModal() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(true);
  const handleClose = () => {
    setIsRoleModalOpen(false);
  };

  return (
    <>
      {isRoleModalOpen && (
        <Modal title={"Cannot Change Roles"} onClose={handleClose}>
          <div className="flex flex-col gap-4 p-4">
            <p className="dark:text-white">
              Warning: you must assign another member to admin first
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
