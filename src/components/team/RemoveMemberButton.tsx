import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type User } from "@prisma/client";
import { BsFillPersonDashFill } from "react-icons/bs";

export default function RemoveMemberButton({ user }: { user: User }) {
  const router = useRouter();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [remove, setRemove] = useState("");

  const handleRemoveMember = async () => {
    try {
      const body = { userId: user.id };
      await fetch(`/api/teams/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsRemoveModalOpen(false);
      await router.replace(router.asPath);
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleClose = () => {
    setRemove("");
    setIsRemoveModalOpen(false);
  };

  return (
    <>
      <button
        data-testid="removeMemberButton"
        onClick={() => setIsRemoveModalOpen(true)}
      >
        <BsFillPersonDashFill size="1.75em" className="dark:fill-white" />
      </button>
      {isRemoveModalOpen && (
        <Modal title="Confirm Removing Member" onClose={handleClose}>
          <div className="flex flex-col gap-4 p-4">
            <p className="dark:text-white">
              {`Warning: this will remove ${user.name} from the team`}
            </p>
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">
                Type &quot;remove&quot; to confirm
              </label>
              <input
                name="remove"
                value={remove}
                onChange={(e) => setRemove(e.target.value)}
                data-testid="removeConfirmField"
                className="pl-2"
                required
                placeholder="remove"
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveMember}
                data-testid="removeButton"
                disabled={remove != "remove"}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-blue-600 dark:focus:ring-blue-800"
              >
                Remove
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
