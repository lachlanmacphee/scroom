import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type Team } from "@prisma/client";
import { FiRotateCcw } from "react-icons/fi";

export default function ResetTeamButton({ team }: { team: Team }) {
  const router = useRouter();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [reset, setReset] = useState("");

  const handleResetTeam = async () => {
    try {
      const body = { teamId: team.id };
      await fetch(`/api/resetTeam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsResetModalOpen(false);
      await router.replace(router.asPath);
    } catch (error) {
      console.error("Error resetting team:", error);
    }
  };

  const handleClose = () => {
    setReset("");
    setIsResetModalOpen(false);
  };

  return (
    <>
      <button
        data-testid="resetTeamButton"
        onClick={() => setIsResetModalOpen(true)}
      >
        <FiRotateCcw size="1.75em" className="dark:stroke-white" />
      </button>
      {isResetModalOpen && (
        <Modal title="Confirm Team Reset" onClose={handleClose}>
          <div className="flex flex-col gap-4 p-4">
            <p className="dark:text-white">
              Warning: this will remove all issues in your team and all
              non-admin team members
            </p>
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">
                Type &quot;reset&quot; to confirm
              </label>
              <input
                name="reset"
                value={reset}
                onChange={(e) => setReset(e.target.value)}
                data-testid="resetConfirmField"
                className="pl-2"
                required
                placeholder="reset"
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
                onClick={handleResetTeam}
                data-testid="resetButton"
                disabled={reset != "reset"}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-blue-600 dark:focus:ring-blue-800"
              >
                Reset
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
