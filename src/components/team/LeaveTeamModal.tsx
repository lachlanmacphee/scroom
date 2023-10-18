import React, { useState } from "react";
import Modal from "../common/Modal";
import { type voidReturnFunc, type onClose } from "~/utils/types";

export default function LeaveTeamModal({
  handleClose,
  adminCount,
  usersCount,
  handleLeaveTeam,
  handleDeleteTeam,
}: {
  handleClose: onClose;
  adminCount: number;
  usersCount: number;
  handleLeaveTeam: voidReturnFunc;
  handleDeleteTeam: voidReturnFunc;
}) {
  const [confirmationText, setConfirmationText] = useState("");

  function getTeamCondition(): string {
    if (adminCount > 1) {
      return "leave";
    } else if (adminCount === 1 && usersCount === 1) {
      return "delete";
    } else if (adminCount === 1) {
      return "reassign";
    }
    return "reassign";
  }

  const teamCondition = getTeamCondition();

  function getModalTitle(): string {
    switch (teamCondition) {
      case "leave":
        return "Confirm Leaving Team";
      case "delete":
        return "Confirm Deleting Team";
      case "reassign":
        return "Cannot Leave Team";
    }
    return "Cannot Leave Team";
  }

  function getModalText(): string {
    switch (teamCondition) {
      case "leave":
        return "Warning: this will remove you from your team";
      case "delete":
        return "Warning: you are the only admin and user, if you leave the team will be deleted";
      case "reassign":
        return "Warning: you are the only admin, you must reallocate the admin role to leave";
    }
    return "Warning: you are the only admin, you must reallocate the admin role to leave";
  }

  return (
    <Modal title={getModalTitle()} onClose={handleClose}>
      <div className="flex flex-col gap-4 p-4">
        <p className="dark:text-white">{getModalText()}</p>
        {["leave", "delete"].includes(teamCondition) && (
          <div className="flex flex-col gap-1">
            <label className="dark:text-white" htmlFor="confirmation">
              Type &quot;confirm&quot; below to proceed
            </label>
            <input
              name="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              data-testid="confirmationField"
              className="pl-2"
              required
              placeholder="confirm"
            />
          </div>
        )}

        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          {["leave", "delete"].includes(teamCondition) && (
            <button
              type="button"
              onClick={
                teamCondition === "leave" ? handleLeaveTeam : handleDeleteTeam
              }
              data-testid="confirmButton"
              disabled={confirmationText != "confirm"}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-blue-600 dark:focus:ring-blue-800"
            >
              {teamCondition === "leave" ? "Leave" : "Delete"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
