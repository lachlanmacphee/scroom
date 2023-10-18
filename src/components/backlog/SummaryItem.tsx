import { type Issue } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { type UpdateIssue } from "~/utils/types";

type disableDrag = (changeTo: boolean) => void;

function SummaryItem({
  issue,
  updateIssue,
  disableDrag,
}: {
  issue: Issue;
  updateIssue: UpdateIssue;
  disableDrag: disableDrag;
}) {
  const [activeName, setActiveName] = useState(issue.summary);
  // To determine whether the user is currently editing the modal - disables dragging
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setActiveName(issue.summary);
  }, [issue.summary]);

  const handleClick = () => {
    disableDrag(true);
    setEditMode(true);
  };

  return (
    <p
      className="flex-auto space-x-2 px-2 dark:text-white"
      onClick={handleClick}
    >
      {!editMode && activeName}
      {editMode && (
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={activeName}
          onChange={(e) => setActiveName(e.target.value)}
          autoFocus
          onBlur={() => {
            disableDrag(false);
            updateIssue({ id: issue.id, summary: activeName });
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              return;
            }
            disableDrag(false);
            updateIssue({ id: issue.id, summary: activeName });
            setEditMode(false);
          }}
        />
      )}
    </p>
  );
}

export default SummaryItem;
