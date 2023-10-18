import React, { useState } from "react";
import NewUpsertIssueModal from "./NewUpsertIssueModal";
import { AiOutlinePlus } from "react-icons/ai";
import type { User, Status, Sprint } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function AddIssueButton({
  backlog,
  sprint,
  teamUsers,
  statuses,
}: {
  backlog: string;
  sprint?: Sprint;
  teamUsers: User[];
  statuses: Status[];
}) {
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);

  return (
    <>
      {showAddIssueModal && (
        <NewUpsertIssueModal
          onClose={() => setShowAddIssueModal(false)}
          backlog={backlog}
          sprint={sprint}
          teamUsers={teamUsers}
          statuses={statuses}
          setTheEditMode={setTheEditMode}
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
