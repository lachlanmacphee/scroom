import React from "react";
import type { Issue } from "@prisma/client";

interface IssueProps {
  issues: Issue[];
  status: string;
}

export default function IssueComp({ issues, status }: IssueProps) {
  return (
    <div className="w-1/3 rounded-lg bg-gray-200 p-4">
      <h2 className="mb-2 text-lg font-semibold">
        {status} ({issues?.length ?? 0})
      </h2>
      {issues?.map((issue) => (
        <div key={issue.id} className="mb-2 border border-blue-800 p-2">
          {issue.summary}
        </div>
      ))}
    </div>
  );
}
