import React from "react";
import type { Issue } from "@prisma/client";

interface IssueProps {
  issues: Issue[];
  status: string;
}

export default function IssueComp({ issues, status }: IssueProps) {
  return (
    <div className="w-full p-4 md:w-1/3">
      <h2 className="mb-2 text-lg font-semibold dark:text-white">
        {status} ({issues?.length ?? 0})
      </h2>
      {issues?.map((issue) => (
        <div
          key={issue.id}
          className="mt-2 block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {issue.summary}
        </div>
      ))}
    </div>
  );
}
