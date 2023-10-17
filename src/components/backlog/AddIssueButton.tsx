import React, { useState } from "react";
import UpsertIssueModal from "./UpsertIssueModal";
import { AiOutlinePlus } from "react-icons/ai";
import type { User } from "@prisma/client";

export default function AddIssueButton({
  backlog,
  teamUsers,
}: {
  backlog: string;
  teamUsers: User[];
}) {
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  return (
    <>
      {showAddIssueModal && (
        <UpsertIssueModal
          onClose={() => setShowAddIssueModal(false)}
          backlog={backlog}
          teamUsers={teamUsers}
        />
      )}

      <button
        className="rounded-full bg-gray-800 p-2.5 shadow-lg"
        data-testid={
          backlog === "sprint"
            ? "addSprintIssueButton"
            : "addProductIssueButton"
        }
        onClick={() => setShowAddIssueModal(true)}
        id={`${backlog}-add-issue-button`}
      >
        <AiOutlinePlus size="1em" color="white" />
      </button>
    </>
  );
}
