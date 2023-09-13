/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import type { Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";
import { MoveIssueButton } from "./MoveIssueButton";
import EditModal from "./editModal";

export function IssueItem({ issue }: { issue: Issue }) {
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

      console.log("refreshing state");
      await router.replace(router.asPath);
      console.log(status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-1 flex items-center justify-between gap-4 rounded-lg border p-3">
      <input className="m-1 h-6 w-6" type="checkbox"></input>
      <p className="flex-auto space-x-2 px-2">{issue.summary}</p>
      <MoveIssueButton updateIssue={updateIssue} issue={issue} />
      <select
        name="status"
        id="status"
        defaultValue={issue.status}
        onChange={(e) => clickHandler(e.target.value)}
      >
        <option value="toDo">To Do</option>
        <option value="inProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button
        className="rounded bg-blue-500 px-4 font-semibold text-white hover:bg-blue-600"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => editHandler()}
      >
        <FaEdit fontSize={24} />
      </button>
      <EditModal onClose={() => setShow(false)} show={show} issue={issue} />
    </div>
  );
}
