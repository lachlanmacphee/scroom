import { type Issue } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { type UpdateIssue } from "~/utils/types";

function SummaryItem({
  issue,
  updateIssue,
}: {
  issue: Issue;
  updateIssue: UpdateIssue;
}) {
  const [activeName, setActiveName] = useState(issue.summary);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setActiveName(issue.summary);
  }, [issue.summary]);

  return (
    <p
      className="flex-auto space-x-2 px-2 dark:text-white"
      onClick={() => setEditMode(true)}
    >
      {!editMode && activeName}
      {editMode && (
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={activeName}
          onChange={(e) => setActiveName(e.target.value)}
          autoFocus
          onBlur={() => {
            updateIssue({ id: issue.id, summary: activeName });
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              return;
            }
            updateIssue({ id: issue.id, summary: activeName });
            setEditMode(false);
          }}
        />
      )}
    </p>
  );
}

export default SummaryItem;
