import { type Issue } from "@prisma/client";
import React from "react";
import { type UpdateIssue } from "~/utils/types";

export default function StatusDropdown({
  issue,
  updateIssue,
}: {
  issue: Issue;
  updateIssue: UpdateIssue;
}) {
  return (
    <select
      name="status"
      id="status"
      className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      defaultValue={issue.status ?? "toDo"}
      onChange={(e) => updateIssue({ id: issue.id, status: e.target.value })}
    >
      <option value="toDo">To Do</option>
      <option value="inProgress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
}
