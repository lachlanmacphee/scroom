import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type User } from "@prisma/client";
import { BsFillPersonDashFill } from "react-icons/bs";
import { api } from "~/utils/api";
import InputGroup from "../common/InputGroup";

export default function RemoveMemberButton({ user }: { user: User }) {
  const router = useRouter();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [remove, setRemove] = useState("");
  const removeMutation = api.team.remove.useMutation();

  const handleClose = () => {
    setRemove("");
    setIsRemoveModalOpen(false);
  };

  const handleRemoveMember = () => {
    removeMutation.mutate(
      { userId: user.id },
      {
        onSuccess: async () => {
          handleClose();
          await router.replace(router.asPath);
        },
      },
    );
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
              {`Warning: this will remove ${
                user.name ?? "a user"
              } from the team`}
            </p>
            <InputGroup
              htmlFor="remove"
              label='Type "remove" to confirm'
              name="remove"
              value={remove}
              onChange={(e) => setRemove(e.target.value)}
              data-testid="removeConfirmField"
              required
              placeholder="remove"
            />
            <div className="flex items-center justify-end space-x-2">
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
