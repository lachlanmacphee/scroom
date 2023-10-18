import React, { useState } from "react";
import DeleteIssueModal from "./DeleteIssueModal";
import { type Issue } from "@prisma/client";
import { ImBin } from "react-icons/im";

export default function DeleteIssueButton({ issue }: { issue: Issue }) {
  const [showDeleteIssueModal, setShowDeleteIssueModal] = useState(false);

  return (
    <>
      {showDeleteIssueModal && (
        <DeleteIssueModal
          onClose={() => setShowDeleteIssueModal(false)}
          issue={issue}
        />
      )}
      <button
        className="mr-2 inline-flex items-center rounded-lg bg-red-600 p-2.5 text-center text-sm font-medium text-white"
        onClick={() => setShowDeleteIssueModal(true)}
      >
        <ImBin fontSize="1.5em" />
      </button>
    </>
  );
}
