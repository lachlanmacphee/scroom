import { type Issue } from "@prisma/client";
import React, { useState } from "react";

type updateIssue = (
  issueID: string,
  summary: string,
  status: string,
  backlog: string,
) => Promise<void>;

function SummaryItem({
  issue,
  updateIssue,
}: {
  issue: Issue;
  updateIssue: updateIssue;
}) {
  const [activeName, setActiveName] = useState("");
  const [editMode, setEditMode] = useState(false);

  function handleOnClick(issue: Issue) {
    setActiveName(issue.summary);
    setEditMode(true);
  }

  return (
    <p
      className="flex-auto space-x-2 px-2 dark:text-white"
      onClick={() => handleOnClick(issue)}
    >
      {!editMode && issue.summary}
      {editMode && (
        <input
          className="rounded border bg-black px-2 outline-none"
          value={activeName}
          onChange={(e) => setActiveName(e.target.value)}
          autoFocus
          onBlur={() => {
            setEditMode(false);
          }}
          onKeyDown={async (e) => {
            if (e.key !== "Enter") {
              return;
            }
            issue.summary = activeName;
            await updateIssue(
              issue.id,
              activeName,
              issue.status ?? "todo",
              issue.backlog,
            );
            setEditMode(false);
          }}
        />
      )}
    </p>
  );
}

export default SummaryItem;
