import React, { useState } from "react";
import type { Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import MoveIssueButton from "./MoveIssueButton";
import UpsertModal from "./UpsertIssueModal";

export default function IssueItem({
  issue,
  role,
}: {
  issue: Issue;
  role: string;
}) {
  const router = useRouter();
  if (issue.status == null) {
    issue.status = "toDo";
  }
  const [show, setShow] = useState(false);

  const clickHandler = async (status: string) => {
    await updateIssue(issue.id, issue.summary, status, issue.backlog);
  };

  const editHandler = () => {
    setShow(true);
  };

  const updateIssue = async (
    issueID: string,
    summary: string,
    status: string,
    backlog: string,
  ) => {
    try {
      const body = { issueID, summary, status, backlog };
      await fetch(`/api/updateIssue`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {show && <UpsertModal onClose={() => setShow(false)} issue={issue} />}
      <div className="m-1 flex items-center justify-between gap-4 rounded-lg border p-3">
        <p className="flex-auto space-x-2 px-2">{issue.summary}</p>
        {role === "productOwner" && (
          <MoveIssueButton updateIssue={updateIssue} issue={issue} />
        )}
        <select
          name="status"
          id="status"
          defaultValue={issue.status}
          onChange={(e) => clickHandler(e.target.value)}
        >
          <option value="toDo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          className="h-8 rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-600"
          onClick={() => editHandler()}
        >
          <FiEdit size="1.5em" />
        </button>
      </div>
    </>
  );
}
