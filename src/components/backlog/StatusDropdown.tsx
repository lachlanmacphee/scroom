import { type Status, type Issue } from "@prisma/client";
import React from "react";
import { type UpdateIssue } from "~/utils/types";

export default function StatusDropdown({
  issue,
  updateIssue,
  statuses,
}: {
  issue: Issue;
  updateIssue: UpdateIssue;
  statuses: Status[];
}) {
  return (
    <select
      name="status"
      id="status"
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      defaultValue={issue.status ?? "toDo"}
      onChange={(e) => updateIssue({ id: issue.id, status: e.target.value })}
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.title}
        </option>
      ))}
    </select>
  );
}
