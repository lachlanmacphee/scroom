import React, { useState } from "react";
import type { Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import MoveIssueButton from "./MoveIssueButton";
import UpsertModal from "./UpsertIssueModal";
import { useSession } from "next-auth/react";

export default function IssueItem({
  issue,
  backlog,
}: {
  issue: Issue;
  backlog: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [show, setShow] = useState(false);

  const updateStatusHandler = async (status: string) => {
    await updateIssue(issue.id, issue.summary, status);
  };

  const updateIssue = async (
    issueID: string,
    summary: string,
    status: string,
    backlog?: string,
  ) => {
    try {
      const body = { issueID, summary, status, backlog };
      await fetch(`/api/issues/update`, {
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
      <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-800">
        <p className="flex-auto space-x-2 px-2 dark:text-white">
          {issue.summary}
        </p>
        {session?.user.role === "productOwner" && (
          <MoveIssueButton updateIssue={updateIssue} issue={issue} />
        )}
        {backlog === "sprint" && (
          <select
            name="status"
            id="status"
            className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            defaultValue={issue.status ?? "toDo"}
            onChange={(e) => updateStatusHandler(e.target.value)}
          >
            <option value="toDo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
        )}
        <button
          className="block rounded-lg font-semibold"
          onClick={() => setShow(true)}
        >
          <FiEdit size="1.5em" className="dark:stroke-white" />
        </button>
      </div>
    </>
  );
}
