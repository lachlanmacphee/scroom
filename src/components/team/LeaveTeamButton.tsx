import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { BsFillPersonDashFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function LeaveTeamButton() {
  const router = useRouter();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leave, setLeave] = useState("");
  const { data: session } = useSession();
  const leaveMutation = api.team.remove.useMutation();

  const handleClose = () => {
    setLeave("");
    setIsLeaveModalOpen(false);
  };

  const handleLeaveTeam = async () => {
    if (!session?.user.id) return;
    leaveMutation.mutate({ userId: session?.user.id });
    handleClose();
    await router.replace(router.asPath);
  };

  return (
    <>
      <button
        data-testid="leaveTeamButton"
        onClick={() => setIsLeaveModalOpen(true)}
      >
        <BsFillPersonDashFill size="1.75em" className="dark:fill-white" />
      </button>
      {isLeaveModalOpen && (
        <Modal title="Confirm Leaving Team" onClose={handleClose}>
          <div className="flex flex-col gap-4 p-4">
            <p className="dark:text-white">
              Warning: this will remove you from your team
            </p>
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">
                Type &quot;leave&quot; to confirm
              </label>
              <input
                name="leave"
                value={leave}
                onChange={(e) => setLeave(e.target.value)}
                data-testid="leaveConfirmField"
                className="pl-2"
                required
                placeholder="leave"
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
                onClick={handleLeaveTeam}
                data-testid="leaveButton"
                disabled={leave != "leave"}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-blue-600 dark:focus:ring-blue-800"
              >
                Leave
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
