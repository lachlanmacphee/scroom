import React from "react";
import type { Issue } from "@prisma/client";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

type updateIssue = (
  issueID: string,
  summary: string,
  status: string,
  backlog: string,
) => void;

export function MoveIssueButton({
  updateIssue,
  issue,
}: {
  updateIssue: updateIssue;
  issue: Issue;
}) {
  if (issue.backlog == "product") {
    return (
      <button
        className="h-8 rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-600"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() =>
          updateIssue(issue.id, issue.summary, issue.status ?? "todo", "sprint")
        }
      >
        <AiOutlineArrowUp fontSize="1.5em" />
      </button>
    );
  }
  return (
    <button
      className="h-8 rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-600"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() =>
        updateIssue(issue.id, issue.summary, issue.status ?? "todo", "product")
      }
    >
      <AiOutlineArrowDown fontSize="1.5em" />
    </button>
  );
}
